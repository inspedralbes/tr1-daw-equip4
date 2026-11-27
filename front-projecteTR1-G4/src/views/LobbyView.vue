<script setup>
import cmpPlazaCanvas from '@/components/cmpPlazaCanvas.vue';
import cmpChatGeneral from '@/components/cmpChatGeneral.vue';

function mostrarMissatge(accio) {
    alert(accio === 'crear_sala' ? 'Crear sala' : 'Unir-se a una sala');
}
</script>

<template>
    <main>
        <h1>Pixel Plaza</h1>

        <div class="contingut">
            <cmpPlazaCanvas @accio="mostrarMissatge" />
            <cmpChatGeneral />
        </div>
    </main>
</template>

<style scoped>
.contingut {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}
</style>