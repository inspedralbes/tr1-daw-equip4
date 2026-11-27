import {
    registrarUsuario,
    eliminarUsuario,
    obtenerUsuarios
} from '../managers/userManager.js';

export function configurarSockets(io) {

    io.on('connection', (socket) => {

        console.log('Usuario conectado:', socket.id);

        // Registrar usuario
        socket.on('registrar-usuari', (datos) => {

            const CODI_PROFE = process.env.CODI_PROFE || 'pedralbes2026';

            // Si es profesor, comprobar el código
            if (datos.rol === 'Profesor' && datos.codi !== CODI_PROFE) {
                socket.emit('resultado-registre', {
                    correcto: false,
                    mensaje: 'Codi de professor incorrecte'
                });
                return;
            }

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