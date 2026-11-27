<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Peer from 'simple-peer';
import { socket } from '@/services/socket';

const usuarios = ref([]);
const videoLocal = ref(null);
const videoRemoto = ref(null);
const estado = ref('Esperando usuarios...');

let peer = null;
let stream = null;
let idOtroUsuario = null;
let iniciando = false;
let senalesPendientes = [];

function actualizarUsuarios(lista) {
    usuarios.value = lista.filter(usuario => usuario.id !== socket.id);
}

async function prepararPeer(iniciador, idUsuario) {
    if (peer || iniciando) return;

    iniciando = true;
    idOtroUsuario = idUsuario;

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });

        videoLocal.value.srcObject = stream;

        peer = new Peer({
            initiator: iniciador,
            stream: stream,
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }
                ]
            }
        });

        peer.on('signal', data => {
            socket.emit('webrtc:signal', {
                to: idOtroUsuario,
                data: data
            });
        });

        peer.on('stream', video => {
            videoRemoto.value.srcObject = video;
            estado.value = 'Videollamada conectada';
        });

        peer.on('error', error => {
            console.error('Error WebRTC:', error);
            estado.value = 'Error en la videollamada';
        });

        peer.on('close', () => {
            estado.value = 'Videollamada finalizada';
        });

        senalesPendientes.forEach(data => peer.signal(data));
        senalesPendientes = [];

        estado.value = 'Conectando...';

    } catch (error) {
        console.error('Error al acceder a cámara o micrófono:', error);
        estado.value = 'No se pudo acceder a la cámara o al micrófono';
    } finally {
        iniciando = false;
    }
}

function llamar(usuario) {
    if (peer || iniciando) return;

    estado.value = 'Llamando a ' + usuario.nombre;
    prepararPeer(true, usuario.id);
}

function recibirSenal({ from, data }) {
    if (peer) {
        peer.signal(data);
    } else {
        senalesPendientes.push(data);

        if (!iniciando) {
            estado.value = 'Recibiendo llamada...';
            prepararPeer(false, from);
        }
    }
}

function cargarUsuarios() {
    socket.emit('obtenir-usuaris');
}

onMounted(() => {
    socket.on('llista-usuaris', actualizarUsuarios);
    socket.on('webrtc:signal', recibirSenal);

    if (socket.connected) {
        cargarUsuarios();
    } else {
        socket.once('connect', cargarUsuarios);
        socket.connect();
    }
});

onUnmounted(() => {
    socket.off('llista-usuaris', actualizarUsuarios);
    socket.off('webrtc:signal', recibirSenal);
    socket.off('connect', cargarUsuarios);

    if (peer) {
        peer.destroy();
        peer = null;
    }

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
});
</script>

<template>
    <div class="videollamada">
        <h2>Videollamada</h2>

        <h3>Usuarios conectados</h3>

        <div v-if="usuarios.length === 0">
            No hay otros usuarios conectados.
        </div>

        <div v-for="usuario in usuarios" :key="usuario.id">
            {{ usuario.nombre }}
            <button @click="llamar(usuario)">
                Llamar
            </button>
        </div>

        <p>{{ estado }}</p>

        <div class="videos">
            <div>
                <h3>Mi cámara</h3>
                <video ref="videoLocal" autoplay muted playsinline></video>
            </div>

            <div>
                <h3>Otra persona</h3>
                <video ref="videoRemoto" autoplay playsinline></video>
            </div>
        </div>
    </div>
</template>

<style scoped>
.videollamada {
    margin-top: 20px;
    padding: 15px;
    border: 2px solid #6475d9;
    border-radius: 10px;
}

.videos {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

video {
    width: 250px;
    height: 180px;
    background: #242638;
    border-radius: 8px;
}
</style>
