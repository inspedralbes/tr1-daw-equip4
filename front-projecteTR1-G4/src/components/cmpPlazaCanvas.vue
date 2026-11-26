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
        pixelArt: true,
        parent: contenidorJoc.value,
        scene: {
            preload: function carregarRecursos() {
                this.load.image("avatarJugador", "/avatars/noi_pell_clara.png");
                this.load.image("tilesetSala", "/assets/maps/tileset_sala.png");
                this.load.tilemapTiledJSON("mapaSala", "/assets/maps/sala.json");
            },
            create: function crearEscena() {
                const mapaSala = this.make.tilemap({ key: "mapaSala" });
                const tilesetSala = mapaSala.addTilesetImage("sala", "tilesetSala");

                mapaSala.createLayer("Suelo", tilesetSala, 0, 0);
                mapaSala.createLayer("Unirse_sala", tilesetSala, 0, 0);
                mapaSala.createLayer("Crear_sala", tilesetSala, 0, 0);
                mapaSala.createLayer("Paredes", tilesetSala, 0, 0);

                const zoomMapa = Math.min(
                    this.scale.width / mapaSala.widthInPixels,
                    this.scale.height / mapaSala.heightInPixels
                );

                this.cameras.main.setZoom(zoomMapa);
                this.cameras.main.centerOn(
                    mapaSala.widthInPixels / 2,
                    mapaSala.heightInPixels / 2
                );

                this.personatge = this.add.image(200, 150, "avatarJugador");
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
