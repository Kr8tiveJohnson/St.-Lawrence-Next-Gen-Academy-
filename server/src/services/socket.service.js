const { Server } = require('socket.io');

class SocketService {
    static init(server) {
        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || '*',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log(`User connected via socket: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });
        });

        return io;
    }
}

module.exports = SocketService;
