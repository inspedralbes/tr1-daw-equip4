import {
    registrarUsuario,
    eliminarUsuario,
    obtenerUsuarios
} from '../managers/userManager.js';

export function configurarSockets(io) {

    io.on('connection', (socket) => {

        console.log('Usuario conectado:', socket.id);

        // Enviar lista de usuarios conectados
        socket.on('obtenir-usuaris', () => {
            socket.emit('llista-usuaris', obtenerUsuarios());
        });

        // Registrar usuario
        socket.on('registrar-usuari', (datos) => {

            const resultado = registrarUsuario(datos, socket.id);
            console.log(resultado);

            // Responder al usuario
            socket.emit('resultado-registre', resultado);

            // Actualizar lista de usuarios
            if (resultado.correcto) {
                io.emit('llista-usuaris', obtenerUsuarios());
            }

        });

        // Desconectar usuario
        socket.on('disconnect', () => {

            eliminarUsuario(socket.id);

            io.emit('llista-usuaris', obtenerUsuarios());

            console.log('Usuario desconectado:', socket.id);

        });

    });

}
