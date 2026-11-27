export function configurarWebRTC(io) {

    io.on('connection', (socket) => {

        socket.on('webrtc:signal', ({ to, data }) => {

            io.to(to).emit('webrtc:signal', {
                from: socket.id,
                data: data
            });

        });

    });

}
