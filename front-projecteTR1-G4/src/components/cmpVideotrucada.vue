<script setup>
import { shallowRef, ref, onUnmounted } from 'vue';
import SimplePeer from 'simple-peer/simplepeer.min.js'; 
import { socket } from '@/services/socket';

let enTrucada = ref(false);
let elMeuVideo = shallowRef(null);
let videos = shallowRef([]);   //vídeos dels altres
let peers = {};                //una connexió per usuari

//crear la connexió amb un altre usuari
function crearPeer(id, iniciador) {
    const peer = new SimplePeer({
        initiator: iniciador,
        stream: elMeuVideo.value,
        config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', (data) => {
        socket.emit('senyal', { to: id, data: data });
    });

    peer.on('stream', (remoteStream) => {
        videos.value = [...videos.value, { id: id, remoteStream: remoteStream }];
    });

    peers[id] = peer;
}

async function entrar() {
    elMeuVideo.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    enTrucada.value = true;
    socket.emit('unir-trucada');
}

//quan entro, connecto amb els que ja hi eren
socket.on('usuaris-trucada', (ids) => {
    ids.forEach(id => crearPeer(id, true));
});

//quan arriba un missatge d'un altre usuari
socket.on('senyal', ({ from, data }) => {
    if (!enTrucada.value) return;
    if (!peers[from]) crearPeer(from, false);
    peers[from].signal(data);
});

//deixar d'escoltar en sortir del lobby
onUnmounted(() => {
    socket.off('usuaris-trucada');
    socket.off('senyal');
});
</script>

<template>
    <div class="trucada">
        <button v-if="!enTrucada" @click="entrar">Entrar a la videotrucada</button>

        <div v-else class="videos">
            <video :srcObject="elMeuVideo" autoplay playsinline muted></video>
            <video v-for="v in videos" :key="v.id" :srcObject="v.remoteStream" autoplay playsinline></video>
        </div>
    </div>
</template>

<style scoped>
.videos {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

video {
    width: 200px;
    border: 2px solid #6475d9;
    border-radius: 10px;
    background: black;
}
</style>