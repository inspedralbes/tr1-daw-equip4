<script setup>
import { shallowRef, ref } from 'vue';
import { socket } from '@/services/socket';

let enTrucada = ref(false);
let elMeuVideo = shallowRef(null);

async function entrar() {
    elMeuVideo.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    enTrucada.value = true;
    socket.emit('unir-trucada');
}
</script>

<template>
    <div class="trucada">
        <button v-if="!enTrucada" @click="entrar">Entrar a la videotrucada</button>

        <div v-else class="videos">
            <video :srcObject="elMeuVideo" autoplay playsinline muted></video>
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