export function configurarTrucada(io) {

    io.on('connection', (socket) => {

        // Entrar en la llamada: le decimos quién hay ya dentro
        socket.on('unir-trucada', () => {
            const sala = io.sockets.adapter.rooms.get('trucada');
            const altres = sala ? [...sala] : [];

            socket.join('trucada');
            socket.emit('usuaris-trucada', altres);
        });

        // Pasar los mensajes de SimplePeer al otro usuario
        socket.on('senyal', ({ to, data }) => {
            io.to(to).emit('senyal', { from: socket.id, data });
        });

        // Salir de la llamada con el botón
        socket.on('sortir-trucada', () => {
            socket.leave('trucada');
        });

    });

}