export function configurarTrucada(io) {

    io.on('connection', (socket) => {

        // Entrar a la trucada: li diem qui hi ha ja dins
        socket.on('unir-trucada', () => {
            const sala = io.sockets.adapter.rooms.get('trucada');
            const altres = sala ? [...sala] : [];

            socket.join('trucada');
            socket.emit('usuaris-trucada', altres);
        });

        // Passar els missatges de SimplePeer a l'altre usuari
        socket.on('senyal', ({ to, data }) => {
            io.to(to).emit('senyal', { from: socket.id, data });
        });

    });

}