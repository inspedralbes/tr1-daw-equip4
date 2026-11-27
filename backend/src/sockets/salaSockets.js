import { obtenerUsuarios } from '../managers/userManager.js';
import {
    crearSala, unirSala, sortirSala, tancarSala,
    salaDeUsuari, obtenerSales
} from '../managers/salaManager.js';

export function configurarSales(io) {

    // enviar la lista actualizada a todos
    function actualitzarSales() {
        io.emit('llista-sales', obtenerSales());
    }

    // cerrar sala: avisar a los de dentro, sacarlos de la room y borrarla
    function tancar(sala) {
        io.to(sala.id).emit('sala-tancada', { id: sala.id, nom: sala.nom });
        io.in(sala.id).socketsLeave(sala.id);
        tancarSala(sala.id);
        actualitzarSales();
    }

    io.on('connection', (socket) => {

        socket.on('demanar-sales', () => {
            socket.emit('llista-sales', obtenerSales());
        });

        // ---- CREAR (solo profe)
        socket.on('crear-sala', (dades) => {
            const usuari = obtenerUsuarios().find(u => u.id === socket.id);

            if (!usuari || usuari.rol !== 'Profesor') {
                socket.emit('resultat-sala', { correcto: false, mensaje: 'Només els professors poden crear sales' });
                return;
            }

            const resultat = crearSala(dades.nom, usuari);

            if (resultat.correcto) {
                socket.join(resultat.sala.id);
                actualitzarSales();
            }

            socket.emit('resultat-sala', resultat);
        });

        // ---- UNIRSE
        socket.on('unir-sala', (dades) => {
            const usuari = obtenerUsuarios().find(u => u.id === socket.id);
            if (!usuari) return;

            // si ya estaba en otra sala, sale de ella primero
            const anterior = sortirSala(socket.id);
            if (anterior) socket.leave(anterior.id);

            const resultat = unirSala(dades.id, socket.id);

            if (resultat.correcto) {
                socket.join(resultat.sala.id);
                socket.to(resultat.sala.id).emit('usuari-entra', usuari);
                actualitzarSales();
            }

            socket.emit('resultat-sala', resultat);
        });

        // ---- SALIR (alumno) / si sale el profe, se cierra
        socket.on('sortir-sala', () => {
            const sala = salaDeUsuari(socket.id);
            if (!sala) return;

            if (sala.profeId === socket.id) {
                tancar(sala);
                return;
            }

            sortirSala(socket.id);
            socket.leave(sala.id);
            io.to(sala.id).emit('usuari-surt', { id: socket.id });
            actualitzarSales();
        });

        // ---- CERRAR (solo el profe de esa sala)
        socket.on('tancar-sala', () => {
            const sala = salaDeUsuari(socket.id);
            if (sala && sala.profeId === socket.id) tancar(sala);
        });

        // ---- DESCONEXIÓN (cerrar pestaña, perder internet...)
        socket.on('disconnect', () => {
            const sala = salaDeUsuari(socket.id);
            if (!sala) return;

            if (sala.profeId === socket.id) {
                tancar(sala);
            } else {
                sortirSala(socket.id);
                io.to(sala.id).emit('usuari-surt', { id: socket.id });
                actualitzarSales();
            }
        });
    });
}