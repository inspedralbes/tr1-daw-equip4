<script setup>
import cmpPlazaCanvas from '@/components/cmpPlazaCanvas.vue';
import cmpChatGeneral from '@/components/cmpChatGeneral.vue';
import VideoCall from '@/components/VideoCall.vue';
</script>

<template>
    <main>
        <h1>Pixel Plaza</h1>

        <div class="contingut">
            <cmpPlazaCanvas />
            <cmpChatGeneral />
        </div>

        <VideoCall />
    </main>
</template>

<style scoped>
.contingut {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}
</style>
