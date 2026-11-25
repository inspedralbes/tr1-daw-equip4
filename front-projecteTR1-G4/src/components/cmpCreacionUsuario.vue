<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

let nombre = ref('');
let rol = ref('');
let avatar = ref('');
let camara = ref(false);
let micro = ref(true);

let video = ref(null);
let stream = null;

let avatars = [
    { nom: 'noi_pell_clara', imatge: '/avatars/noi_pell_clara.png' },
    { nom: 'noi_pell_fosca', imatge: '/avatars/noi_pell_fosca.png' },
    { nom: 'noia_pell_clara', imatge: '/avatars/noia_pell_clara.png' },
    { nom: 'noia_pell_fosca', imatge: '/avatars/noia_pell_fosca.png' }
];

// --------------- FUNCIONS --------------

async function desactivar_ActivarMicro() {
    micro.value = !micro.value;
}

async function desactivar_ActivarCamara() {

    if (camara.value) {

        // Apaguem la càmera
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        camara.value = false;

    } else {

        // Encenem la càmera
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

            video.value.srcObject = stream;
            camara.value = true;

        } catch (error) {
            console.error('Error en accedir a la càmera:', error);
            alert('No s\'ha pogut accedir a la càmera.');
        }
    }
}

function enviarRegistro() {

    if (nombre.value.trim() === '' || rol.value === '' || avatar.value === '') {
        alert('Completa el nom, el rol i selecciona un avatar.');
        return;
    }

    router.push('/lobby');
}

// Aturem la càmera quan sortim de la pàgina
onBeforeUnmount(() => {

    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

});

</script>

<template>

    <div class="pagina-login">

        <div class="targeta-login">

            <!-- CAPÇALERA -->
            <div class="capcalera">
                <span class="etiqueta">INSTITUT VIRTUAL</span>
                <h1>Benvingut a <span>Pixel Plaza</span></h1>
                <p>Prepara't per entrar al teu institut virtual!</p>
            </div>

            <form @submit.prevent="enviarRegistro">

                <!-- NOM -->
                <div class="camp">

                    <label for="nom">Com et dius?</label>

                    <input
                        type="text"
                        placeholder="Escriu el teu nom..."
                        id="nom"
                        v-model="nombre"
                    >

                </div>

                <!-- ROL -->
                <div class="camp">

                    <label for="rol">Selecciona el teu rol</label>

                    <select id="rol" v-model="rol">
                        <option value="" disabled>Selecciona un rol</option>
                        <option value="Alumno">Alumne</option>
                        <option value="Profesor">Professor</option>
                    </select>

                </div>

                <!-- AVATARS -->
                <div class="camp">

                    <label>Tria el teu avatar</label>

                    <div class="galeria-avatars">

                        <button
                            v-for="opcio in avatars"
                            :key="opcio.nom"
                            type="button"
                            class="avatar-opcio"
                            :class="{ seleccionat: avatar === opcio.nom }"
                            @click="avatar = opcio.nom"
                        >

                            <img :src="opcio.imatge" :alt="opcio.nom">

                        </button>

                    </div>

                </div>

                <!-- DISPOSITIUS -->
                <div class="camp">

                    <label>Configuració dels dispositius</label>

                    <div class="dispositivos">

                        <button
                            type="button"
                            @click="desactivar_ActivarMicro()"
                            :class="micro ? 'activo' : 'desactivado'"
                            class="boton-dispositivo"
                        >
                            {{ micro ? '🎤 Micro activat' : '🔇 Micro desactivat' }}
                        </button>

                        <button
                            type="button"
                            @click="desactivar_ActivarCamara()"
                            :class="camara ? 'activo' : 'desactivado'"
                            class="boton-dispositivo"
                        >
                            {{ camara ? '📷 Càmera activada' : '🚫 Càmera desactivada' }}
                        </button>

                    </div>

                </div>

                <!-- PREVISUALITZACIÓ CÀMERA -->
                <div class="camp">

                    <label>Previsualització de la càmera</label>

                    <div class="contenidor-video">

                        <video
                            ref="video"
                            autoplay
                            playsinline
                            muted
                            v-show="camara"
                        ></video>

                        <div v-if="!camara" class="video-desactivat">
                            <span>📷</span>
                            <p>La càmera està desactivada</p>
                        </div>

                    </div>

                </div>

                <!-- BOTÓ ENTRAR -->
                <button type="submit" class="boton-entrar">
                    Entrar a Pixel Plaza →
                </button>

            </form>

        </div>

    </div>

</template>

<style scoped>

/* FONS */
.pagina-login {
    min-height: 100vh;
    background: linear-gradient(135deg, #dce8ff, #f2e9ff);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 15px;
    font-family: Arial, sans-serif;
}

/* TARGETA */
.targeta-login {
    background: white;
    width: 100%;
    max-width: 550px;
    padding: 35px;
    border-radius: 22px;
    box-shadow: 0 10px 35px rgba(50, 50, 100, 0.15);
}

/* CAPÇALERA */
.capcalera {
    text-align: center;
    margin-bottom: 30px;
}

.etiqueta {
    color: #6475d9;
    font-size: 12px;
    font-weight: bold;
    letter-spacing: 3px;
}

.capcalera h1 {
    font-size: 27px;
    margin: 12px 0;
    color: #30334b;
}

.capcalera h1 span {
    color: #6475d9;
}

.capcalera p {
    color: #888;
    font-size: 14px;
}

/* CAMPS */
.camp {
    margin-bottom: 23px;
}

.camp label {
    display: block;
    font-weight: bold;
    color: #42445c;
    margin-bottom: 10px;
}

.camp input,
.camp select {
    width: 100%;
    padding: 13px;
    border: 2px solid #e4e6f0;
    border-radius: 10px;
    font-size: 14px;
    outline: none;
    box-sizing: border-box;
}

.camp input:focus,
.camp select:focus {
    border-color: #6475d9;
}

/* AVATARS */
.galeria-avatars {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}

.avatar-opcio {
    background: #f7f8fc;
    border: 2px solid #e4e6f0;
    border-radius: 12px;
    cursor: pointer;
    padding: 10px;
    transition: 0.2s;
}

.avatar-opcio img {
    width: 100%;
    height: 90px;
    object-fit: contain;
    image-rendering: pixelated;
}

.avatar-opcio:hover {
    transform: translateY(-3px);
    border-color: #aab5f5;
}

.avatar-opcio.seleccionat {
    border: 3px solid #6475d9;
    background: #e9edff;
}

/* DISPOSITIUS */
.dispositivos {
    display: flex;
    gap: 12px;
}

.boton-dispositivo {
    flex: 1;
    padding: 12px 8px;
    border-radius: 10px;
    border: 2px solid transparent;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.activo {
    background: #e0f5e9;
    color: #21834b;
    border-color: #a5dfb9;
}

.desactivado {
    background: #f1f1f5;
    color: #777;
    border-color: #ddd;
}

.boton-dispositivo:hover {
    transform: translateY(-2px);
}

/* VIDEO */
.contenidor-video {
    width: 100%;
    height: 200px;
    background: #242638;
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

.contenidor-video video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-desactivat {
    text-align: center;
    color: #bfc1d2;
}

.video-desactivat span {
    font-size: 35px;
}

.video-desactivat p {
    font-size: 13px;
}

/* BOTÓ ENTRAR */
.boton-entrar {
    width: 100%;
    padding: 16px;
    border: none;
    border-radius: 12px;
    background: #6475d9;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: 0.2s;
}

.boton-entrar:hover {
    background: #4d5fc5;
    transform: translateY(-2px);
}

</style>