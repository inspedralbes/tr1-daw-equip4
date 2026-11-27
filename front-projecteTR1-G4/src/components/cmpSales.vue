<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { socket } from '@/services/socket';

const props = defineProps({ rol: String });

let sales = ref([]);
let nomSala = ref('');
let salaActual = ref(null);
let error = ref('');

// ---------- ACCIONS
function crearSala() {
    if (nomSala.value.trim() === '') {
        error.value = 'Posa un nom a la sala.';
        return;
    }
    socket.emit('crear-sala', { nom: nomSala.value });
}

function unirSala(id) {
    socket.emit('unir-sala', { id });
}

function sortirSala() {
    socket.emit('sortir-sala');
    salaActual.value = null;
}

// ---------- LISTENERS
function onLlista(llista) {
    sales.value = llista;
}

function onResultat(resultat) {
    if (resultat.correcto) {
        salaActual.value = resultat.sala;
        nomSala.value = '';
        error.value = '';
    } else {
        error.value = resultat.mensaje;
    }
}

function onTancada(sala) {
    if (salaActual.value?.id === sala.id) {
        salaActual.value = null;
        error.value = `El professor ha tancat "${sala.nom}".`;
    }
}

onMounted(() => {
    socket.on('llista-sales', onLlista);
    socket.on('resultat-sala', onResultat);
    socket.on('sala-tancada', onTancada);
    socket.emit('demanar-sales');
});

// quitar listeners al salir, si no se duplican cada vez que entras al lobby
onBeforeUnmount(() => {
    socket.off('llista-sales', onLlista);
    socket.off('resultat-sala', onResultat);
    socket.off('sala-tancada', onTancada);
});
</script>

<template>
    <div class="panell-sales">
        <h2>Sales</h2>

        <!-- dentro de una sala -->
        <div v-if="salaActual">
            <p>Estàs a <strong>{{ salaActual.nom }}</strong></p>
            <button @click="sortirSala">
                {{ rol === 'Profesor' ? 'Tancar sala' : 'Sortir' }}
            </button>
        </div>

        <!-- fuera de una sala -->
        <div v-else>
            <form v-if="rol === 'Profesor'" @submit.prevent="crearSala">
                <input v-model="nomSala" placeholder="Nom de la sala">
                <button type="submit">Crear sala</button>
            </form>

            <ul>
                <li v-for="sala in sales" :key="sala.id">
                    {{ sala.nom }} · {{ sala.profeNom }} ({{ sala.numMembres }})
                    <button v-if="rol === 'Alumno'" @click="unirSala(sala.id)">Unir-me</button>
                </li>
            </ul>

            <p v-if="sales.length === 0">No hi ha sales obertes.</p>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<style scoped>
.error { color: #e05555; }
</style>