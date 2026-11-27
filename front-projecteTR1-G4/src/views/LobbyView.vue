<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { socket } from '@/services/socket';
import cmpSales from '@/components/cmpSales.vue';
import cmpPlazaCanvas from '@/components/cmpPlazaCanvas.vue';
import cmpChatGeneral from '@/components/cmpChatGeneral.vue';

let usuaris = ref([]);

function onLlistaUsuaris(llista) {
    usuaris.value = llista;
}

onMounted(() => {
    socket.on('llista-usuaris', onLlistaUsuaris);
    socket.emit('demanar-usuaris');
});

onBeforeUnmount(() => {
    socket.off('llista-usuaris', onLlistaUsuaris);
});

const rolMeu = computed(() => {
    const jo = usuaris.value.find(u => u.id === socket.id);
    return jo ? jo.rol : '';
});
</script>

<template>
    <main>
        <h1>Pixel Plaza</h1>

        <div class="contingut">
            <cmpPlazaCanvas />
            <cmpChatGeneral />
        </div>

        <cmpSales v-if="rolMeu" :rol="rolMeu" />
    </main>
</template>

<style scoped>
.contingut {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}
</style>