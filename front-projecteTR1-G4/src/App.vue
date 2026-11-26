<script setup>
import { RouterView } from 'vue-router';
import cmpChatGeneral from './components/cmpChatGeneral.vue';
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterView />
        <cmpChatGeneral />
      </nav>
    </div>
  </header>
</template>

<style scoped>

</style>