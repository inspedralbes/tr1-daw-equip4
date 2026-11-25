<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Phaser from "phaser";

const contenidorJoc = ref(null);
let jocPhaser = null;

onMounted(function muntarJoc() {
    jocPhaser = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: contenidorJoc.value,
        scene: {
            preload: function carregarRecursos() {
                this.load.image('avatarJugador', '/avatars/noi_pell_clara.png');
            },
            create: function crearEscena() {
                this.personatge = this.add.image(200, 150, 'avatarJugador');
                this.teclesMoviment = this.input.keyboard.createCursorKeys();
            },
            update: function actualitzarEscena() {
                if (this.teclesMoviment.left.isDown) {
                    this.personatge.x -= 3;
                }

                if (this.teclesMoviment.right.isDown) {
                    this.personatge.x += 3;
                }

                if (this.teclesMoviment.up.isDown) {
                    this.personatge.y -= 3;
                }

                if (this.teclesMoviment.down.isDown) {
                    this.personatge.y += 3;
                }
            },
        },
    });
});

onBeforeUnmount(function destruirJoc() {
    if (jocPhaser !== null) {
        jocPhaser.destroy(true);
        jocPhaser = null;
    }
});
</script>

<template>
    <div ref="contenidorJoc"></div>
</template>
