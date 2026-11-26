import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDispositivosStore = defineStore('dispositivos', () => {

    const camara = ref(false);
    const micro = ref(true);
    const stream = ref(null);

    async function activarDesactivarCamara() {

        if (camara.value) {

            // Apagar cámara
            if (stream.value) {
                stream.value.getTracks().forEach(track => track.stop());
                stream.value = null;
            }

            camara.value = false;

        } else {

            // Encender cámara
            try {
                stream.value = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });

                camara.value = true;

            } catch (error) {
                console.error('Error al acceder a la cámara:', error);
                throw error;
            }
        }
    }

    function activarDesactivarMicro() {

    micro.value = !micro.value;

    if (stream.value) {
        stream.value.getAudioTracks().forEach(track => {
            track.enabled = micro.value;
        });
    }
}no

    return {
        camara,
        micro,
        stream,
        activarDesactivarCamara,
        activarDesactivarMicro
    };
});