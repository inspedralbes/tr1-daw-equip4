<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Phaser from "phaser";
import { Personatge } from "../phaser/Personatge.js";

const contenidorJoc = ref(null);
let jocPhaser = null;

// Crea el joc quan Vue ja ha afegit el contenidor al DOM.
onMounted(function muntarJoc() {
    jocPhaser = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt: true,
        parent: contenidorJoc.value,
        scene: {
            // Carrega les imatges i el mapa abans de crear l'escena.
            preload: function carregarRecursos() {
                this.load.image("avatarJugador", "/avatars/noi_pell_clara.png");
                this.load.image("tilesetSala", "/assets/maps/tileset_sala.png");
                this.load.tilemapTiledJSON("mapaSala", "/assets/maps/sala.json");
            },
            // Construeix el mapa, ajusta la càmera i crea el personatge.
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

                this.personatge = new Personatge(this, 200, 150, "avatarJugador");
            },
            // Phaser crida aquesta funció cada fotograma i li passa el temps transcorregut.
            update: function actualitzarEscena(temps, delta) {
                this.personatge.actualitzar(delta);
            },
        },
    });
});

// Destrueix Phaser en sortir del component per alliberar el canvas i els recursos.
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
