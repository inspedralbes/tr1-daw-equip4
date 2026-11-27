<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import Phaser from "phaser";
import { Personatge } from "../phaser/Personatge.js";
import { socket } from "@/services/socket";

const contenidorJoc = ref(null);
let jocPhaser = null;

// Avatar del registre -> textura de Phaser
const texturesAvatar = {
    noi_pell_clara: "chicoClaro",
    noi_pell_fosca: "chicoOscuro",
    noia_pell_clara: "chicaClara",
    noia_pell_fosca: "chicaOscura"
};

// Crea el meu personatge i el dels altres, i esborra els que han marxat
function actualitzarJugadors(escena, usuaris) {
    usuaris.forEach(function (usuari) {
        const textura = texturesAvatar[usuari.avatar];

        if (usuari.id === socket.id) {
            if (!escena.personatge) {
                escena.personatge = new Personatge(escena, usuari.x, usuari.y, textura);
                escena.etiquetes[usuari.id] = crearEtiqueta(escena, usuari);
            }
        } else if (!escena.altresJugadors[usuari.id]) {
            escena.altresJugadors[usuari.id] = new Personatge(escena, usuari.x, usuari.y, textura);
            escena.etiquetes[usuari.id] = crearEtiqueta(escena, usuari);
        }
    });

    Object.keys(escena.altresJugadors).forEach(function (id) {
        if (!usuaris.some(u => u.id === id)) {
            escena.altresJugadors[id].sprite.destroy();
            escena.etiquetes[id].destroy();
            delete escena.altresJugadors[id];
            delete escena.etiquetes[id];
        }
    });
}

// Mou un altre jugador i posa la seva animació
function moureAltreJugador(escena, usuari) {
    const jugador = escena.altresJugadors[usuari.id];
    if (!jugador) return;

    jugador.sprite.setPosition(usuari.x, usuari.y);

    if (usuari.enMoviment) {
        jugador.sprite.anims.play(jugador.textura + "-caminar-" + usuari.direccio, true);
    } else {
        jugador.sprite.anims.stop();
        jugador.sprite.setFrame(jugador.fotogramesAturats[usuari.direccio]);
    }
}

// Crea el text amb el nom: fons gris fosc i nom del color de l'usuari
function crearEtiqueta(escena, usuari) {
    return escena.add.text(usuari.x, usuari.y, usuari.nombre, {
        fontSize: "40px",
        color: usuari.color,
        backgroundColor: "#333333",
        padding: { x: 12, y: 4 }
    }).setOrigin(0.5);
}

// Posa el nom a sobre del cap
function colocarEtiqueta(etiqueta, sprite) {
    etiqueta.setPosition(sprite.x, sprite.y - sprite.displayHeight / 2 - 10);
}

onMounted(function muntarJoc() {
    jocPhaser = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        pixelArt: true,
        parent: contenidorJoc.value,
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 0 },
                fps: 60,
                debug: false
            }
        },
        scene: {
            preload: function carregarRecursos() {
                this.load.spritesheet("chicoClaro", "/assets/sprites/chico_claro.png", { frameWidth: 64, frameHeight: 64 });
                this.load.spritesheet("chicoOscuro", "/assets/sprites/chico_oscuro.png", { frameWidth: 64, frameHeight: 64 });
                this.load.spritesheet("chicaClara", "/assets/sprites/chica_clara.png", { frameWidth: 64, frameHeight: 64 });
                this.load.spritesheet("chicaOscura", "/assets/sprites/chica_oscura.png", { frameWidth: 64, frameHeight: 64 });
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
                this.cameras.main.centerOn(mapaSala.widthInPixels / 2, mapaSala.heightInPixels / 2);

                this.personatge = null;
                this.altresJugadors = {};
                this.etiquetes = {};
                this.estavaEnMoviment = false;

                // Llista de jugadors i moviment dels altres
                socket.on("llista-usuaris", (usuaris) => actualitzarJugadors(this, usuaris));
                socket.on("usuari-mogut", (usuari) => moureAltreJugador(this, usuari));
                socket.emit("demanar-usuaris");
            },

            update: function actualitzarEscena() {
                if (!this.personatge) return;

                this.personatge.actualitzar();

                // Noms a sobre del cap
                colocarEtiqueta(this.etiquetes[socket.id], this.personatge.sprite);
                Object.keys(this.altresJugadors).forEach((id) => {
                    colocarEtiqueta(this.etiquetes[id], this.altresJugadors[id].sprite);
                });

                // Envio la posició mentre em moc, i un cop més quan m'aturo
                const sprite = this.personatge.sprite;
                const enMoviment = sprite.body.velocity.x !== 0 || sprite.body.velocity.y !== 0;

                if (enMoviment || this.estavaEnMoviment) {
                    socket.emit("moure", {
                        x: sprite.x,
                        y: sprite.y,
                        direccio: this.personatge.direccioActual,
                        enMoviment: enMoviment
                    });
                }

                this.estavaEnMoviment = enMoviment;
            }
        }
    });
});

onBeforeUnmount(function destruirJoc() {
    socket.off("llista-usuaris");
    socket.off("usuari-mogut");

    if (jocPhaser !== null) {
        jocPhaser.destroy(true);
        jocPhaser = null;
    }
});
</script>

<template>
    <div ref="contenidorJoc"></div>
</template>