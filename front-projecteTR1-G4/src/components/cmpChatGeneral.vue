<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { socket } from '@/services/socket';

let missatges = ref([]);
let texto = ref('');

function rebreMissatge(missatge) {
    missatges.value.push(missatge);
}

function enviarMissatge() {
    if (texto.value.trim() === '') return;
    socket.emit('enviar-missatge', texto.value);
    texto.value = '';
    document.activeElement.blur();
}

onMounted(() => {
    if (!socket.connected) {
        socket.connect();
    }
    socket.on('nou-missatge', rebreMissatge);
});

onUnmounted(() => {
    socket.off('nou-missatge', rebreMissatge);
});
</script>

<template>
    <div class="xat">
        <h3>Xat general</h3>

        <div class="missatges">
            <p v-for="(m, index) in missatges" :key="index">
                <strong>{{ m.nombre }}:</strong> {{ m.texto }}
            </p>
        </div>

        <form @submit.prevent="enviarMissatge">
            <input v-model="texto" placeholder="Escriu un missatge...">
            <button type="submit">Enviar</button>
        </form>
    </div>
</template>

<style scoped>
.xat {
    width: 300px;
    border: 2px solid #6475d9;
    border-radius: 10px;
    padding: 10px;
}

.missatges {
    height: 250px;
    overflow-y: auto;
}
</style>