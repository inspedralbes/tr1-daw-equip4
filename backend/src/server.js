import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { configurarSockets } from './sockets/userSocket.js';
import { configurarChat } from './sockets/chatSocket.js';

const origen = process.env.CLIENT_URL || 'http://localhost:5173';


// Crear servidor Express
const app = express();

app.use(cors({
    origin: origen
}));

app.use(express.json());

// Crear servidor HTTP
const servidor = createServer(app);

// Crear servidor Socket.IO
const io = new Server(servidor, {
    cors: {
        origin: origen,
        methods: ['GET', 'POST']
    }
});

configurarSockets(io);
configurarChat(io);

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

servidor.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend Pixel Plaza funcionando en el puerto ${PORT}`);
});