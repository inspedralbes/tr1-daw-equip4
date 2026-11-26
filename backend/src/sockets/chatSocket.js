import { obtenerUsuarios } from '../managers/userManager.js';

export function configurarChat(io) {

    io.on('connection', (socket) => {

        socket.on('enviar-missatge', (texto) => {

            const usuario = obtenerUsuarios().find(u => u.id === socket.id);

            io.emit('nou-missatge', {
                nombre: usuario ? usuario.nombre : 'Anònim',
                texto: texto
            });

        });

    });

}