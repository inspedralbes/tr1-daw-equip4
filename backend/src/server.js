import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configurarSockets } from './sockets/userSocket.js';
import { configurarChat } from './sockets/chatSocket.js';
import { configurarWebRTC } from './sockets/webrtcSocket.js';
// Crear servidor Express
const app = express();

// Permitir peticiones desde Vue
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Crear servidor HTTP
const servidor = createServer(app);

// Crear servidor Socket.IO
const io = new Server(servidor, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

configurarSockets(io);
configurarChat(io);
configurarWebRTC(io);
// Comprobar que el backend funciona
app.get('/health', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Backend Pixel Plaza funcionando'
    });
});

// Detectar conexiones de usuarios
io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

servidor.listen(PORT, () => {
    console.log(`Backend Pixel Plaza funcionando en http://localhost:${PORT}`);
});
