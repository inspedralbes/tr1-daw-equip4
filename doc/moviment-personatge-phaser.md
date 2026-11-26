# Moviment i animació del personatge amb Phaser

Aquest document descriu com es carrega el joc, com es crea el personatge i com
funcionen els controls, la física Arcade i les animacions direccionals.

## Fitxers relacionats

- `front-projecteTR1-G4/src/components/cmpPlazaCanvas.vue`: inicialitza Phaser,
  carrega els recursos i actualitza l'escena.
- `front-projecteTR1-G4/src/phaser/Personatge.js`: representa el personatge,
  registra les animacions i llegeix els controls.

## Flux de comunicació entre Vue, Phaser i Personatge

Els tres elements cooperen en aquest ordre:

1. **Vue** mostra el `<div ref="contenidorJoc">`. Quan el component es munta,
   `onMounted` crea el joc Phaser i li passa aquest element com a contenidor.
2. **Phaser** executa `preload` per carregar els recursos. Quan acaba, executa
   `create` per preparar l'escena i crear el jugador.
3. **L'escena** crea `Personatge` i li passa tres dades: la mateixa escena, la
   posició inicial i la clau del spritesheet.
4. **Phaser** crida `update` contínuament. Aquest mètode delega el moviment a
   `personatge.actualitzar()`.
5. **Personatge** consulta el teclat, posa una velocitat al seu cos Arcade i
   demana a Phaser l'animació adequada. Phaser mou i dibuixa el sprite.
6. Quan Vue desmunta el component, es destrueix la instància del joc.

La comunicació aquí es fa amb referències i crides de mètodes: l'escena passa
`this` al constructor, i després crida els mètodes de l'objecte `Personatge`.
No es fa servir Pinia ni s'envien posicions a Vue; el moviment i l'animació són
responsabilitat de Phaser. Vue només crea i destrueix el joc.

## 1. Inicialització del joc

`cmpPlazaCanvas.vue` crea la instància de Phaser quan Vue ha muntat el component.
El joc queda associat al `<div>` del template mitjançant `contenidorJoc`.

La configuració actual del joc és:

- Mida del canvas: `800 × 600` píxels.
- Renderització: `Phaser.AUTO`, amb `pixelArt` activat.
- Motor físic: Arcade Physics.
- Gravetat vertical: `0`, perquè és un joc de vista zenital.
- Freqüència de la física: `60` actualitzacions per segon.
- Depuració de la física: desactivada (`debug: false`).

La configuració d'Arcade Physics dins de `new Phaser.Game` és:

```js
physics: {
    default: "arcade",
    arcade: {
        gravity: { y: 0 },
        fps: 60,
        debug: false
    }
}
```

La gravetat es posa a zero perquè el personatge es mou en un mapa zenital i no
ha de caure. Arcade Physics actualitza la posició a partir de la velocitat que
rep. `default: "arcade"` activa aquest motor; `fps: 60` fixa el pas de la
simulació física, i `debug: false` amaga les formes dels cossos físics.

Quan el component es desmunta, `onBeforeUnmount` destrueix la instància de
Phaser. Això evita deixar el canvas i els recursos actius després de sortir de
la vista.

```js
onBeforeUnmount(function destruirJoc() {
    if (jocPhaser !== null) {
        jocPhaser.destroy(true);
        jocPhaser = null;
    }
});
```

`destroy(true)` destrueix el joc i els elements de Phaser que conté. Assignar
`null` a `jocPhaser` deixa clar que el component ja no conserva cap instància
activa.

## 2. Càrrega del mapa i dels spritesheets

Durant `preload`, l'escena carrega el mapa Tiled, el tileset i quatre
spritesheets:

| Clau de Phaser | Fitxer |
|---|---|
| `chicoClaro` | `/assets/sprites/chico_claro.png` |
| `chicoOscuro` | `/assets/sprites/chico_oscuro.png` |
| `chicaClara` | `/assets/sprites/chica_clara.png` |
| `chicaOscura` | `/assets/sprites/chica_oscura.png` |

Cada imatge fa `256 × 256` píxels i està dividida en una graella de `4 × 4`.
Per això, cada fotograma mesura `64 × 64` píxels i es carrega amb
`frameWidth: 64` i `frameHeight: 64`.

Per exemple, la càrrega d'un spritesheet i del mapa es fa així:

```js
this.load.spritesheet(
    "chicoClaro",
    "/assets/sprites/chico_claro.png",
    { frameWidth: 64, frameHeight: 64 }
);
this.load.tilemapTiledJSON("mapaSala", "/assets/maps/sala.json");
```

La mateixa crida a `load.spritesheet` es repeteix per als altres tres avatars.
El primer argument (`"chicoClaro"`) és una clau interna de Phaser: més endavant
`Personatge` rep aquesta mateixa clau a `textura` per crear el sprite i cercar
els seus fotogrames. El segon argument és la ruta pública del fitxer. Els
valors `frameWidth` i `frameHeight` indiquen a Phaser com dividir la imatge.

Actualment, `create` crea el jugador amb la clau `chicoClaro`. Els altres tres
spritesheets es carreguen, però encara no se seleccionen dinàmicament des de
l'avatar triat a la pantalla de login.

## 3. Organització dels fotogrames i animacions

Els fotogrames es numeren d'esquerra a dreta i de dalt a baix. Les columnes
representen les direccions i les files contenen els fotogrames de cada
moviment:

| Direcció | Fotogrames de caminar | Fotograma aturat |
|---|---|---:|
| Avall | `[0, 4, 8, 12]` | `0` |
| Esquerra | `[1, 5, 9, 13]` | `1` |
| Amunt | `[2, 6, 10, 14]` | `2` |
| Dreta | `[3, 7, 11, 15]` | `3` |

`Personatge.crearAnimacions` registra una animació per direcció. Les claus
generades tenen aquest format:

```text
<clau-del-spritesheet>-caminar-<direcció>
```

Per exemple, la clau per caminar cap avall amb `chicoClaro` és
`chicoClaro-caminar-avall`. Cada animació avança a `8` fotogrames per segon i
es repeteix indefinidament mentre es camina. Abans de crear-la, el codi comprova
si ja existeix a l'escena per evitar duplicar-la.

Les seqüències es defineixen com una llista de direccions i fotogrames:

```js
const animacions = [
    { direccio: "avall", fotogrames: [0, 4, 8, 12] },
    { direccio: "dreta", fotogrames: [3, 7, 11, 15] },
    { direccio: "amunt", fotogrames: [2, 6, 10, 14] },
    { direccio: "esquerra", fotogrames: [1, 5, 9, 13] }
];
```

Per cada seqüència, Phaser genera els fotogrames i registra una animació:

```js
this.escena.anims.create({
    key: clauAnimacio,
    frames: this.escena.anims.generateFrameNumbers(this.textura, {
        frames: animacio.fotogrames
    }),
    frameRate: 8,
    repeat: -1
});
```

`clauAnimacio` identifica l'animació; `generateFrameNumbers` transforma els
números de fotograma en fotogrames que Phaser pot reproduir. `frameRate: 8`
estableix el ritme i `repeat: -1` indica que el cicle no s'acaba. L'escena
gestiona aquestes animacions i el sprite les reprodueix mitjançant
`this.sprite.anims.play(...)`.

## 4. Creació del personatge

En `create`, l'escena construeix les capes del mapa i ajusta la càmera. Després
crea el jugador:

```js
this.personatge = new Personatge(this, 200, 150, "chicoClaro");
```

El constructor de `Personatge` crea un sprite amb cos de física Arcade, aplica
l'escala i prepara els controls:

```js
this.sprite = escena.physics.add.sprite(
    posicioHoritzontal,
    posicioVertical,
    textura,
    0
);
this.sprite.setScale(3);

this.tecles = escena.input.keyboard.createCursorKeys();
this.teclesWASD = escena.input.keyboard.addKeys({
    amunt: Phaser.Input.Keyboard.KeyCodes.W,
    avall: Phaser.Input.Keyboard.KeyCodes.S,
    esquerra: Phaser.Input.Keyboard.KeyCodes.A,
    dreta: Phaser.Input.Keyboard.KeyCodes.D
});
```

Amb fotogrames originals de `64 × 64`, l'escala `3` fa que el dibuix ocupi
aproximadament `192 × 192` píxels al món del joc. El constructor també inicia la
direcció cap avall i crida `crearAnimacions()`.

El paràmetre `escena` és l'escena de Phaser que crea el jugador. Per això es pot
utilitzar per accedir a `physics`, `input` i `anims`, que són serveis de
l'escena. `physics.add.sprite` crea el dibuix i el seu cos físic; els paràmetres
següents són la posició, la clau de textura i el fotograma inicial (`0`).
`this.sprite` conserva aquest objecte per poder moure'l i animar-lo més tard.

`createCursorKeys()` retorna les quatre fletxes. `addKeys()` registra les tecles
WASD amb noms propis (`amunt`, `avall`, etc.). Aquests dos objectes es guarden
al personatge, que els consultarà a `actualitzar()`.

## 5. Controls

Es poden utilitzar les fletxes o WASD:

| Moviment | Fletxa | Tecla |
|---|---|---|
| Amunt | `↑` | `W` |
| Avall | `↓` | `S` |
| Esquerra | `←` | `A` |
| Dreta | `→` | `D` |

Si es prem la mateixa direcció amb tots dos esquemes alhora, el moviment no es
duplica: el codi combina cada parella de tecles amb una condició booleana.
Si es premen direccions oposades, els seus valors es cancel·len.

Per exemple, per moure's cap a l'esquerra es comprova tant la fletxa com la
tecla `A`:

```js
if (this.tecles.left.isDown || this.teclesWASD.esquerra.isDown) {
    moviment.x -= 1;
}
```

`isDown` és `true` mentre la tecla continua premuda. L'operador `||` combina
dos controls equivalents: n'hi ha prou que estigui premuda la fletxa esquerra
o la tecla `A`. El resultat modifica el vector local `moviment`; encara no
mou directament el sprite.

## 6. Moviment amb Arcade Physics

`cmpPlazaCanvas.vue` crida `personatge.actualitzar()` des del `update` de
l'escena. Phaser executa aquesta funció durant el cicle del joc.
La funció `actualitzarEscena` de `cmpPlazaCanvas.vue` actua com a pont: no
calcula el moviment, sinó que delega aquesta feina a l'objecte `Personatge`.

El mètode `actualitzar` segueix aquests passos:

1. Comença amb un vector de moviment `(0, 0)`.
2. Suma o resta `1` als eixos segons les tecles premudes.
   - L'eix horitzontal correspon a `x`: negatiu és esquerra i positiu és dreta.
   - L'eix vertical correspon a `y`: negatiu és amunt i positiu és avall.
3. Si el vector continua sent `(0, 0)`, posa la velocitat física a zero, atura
   l'animació i mostra el fotograma aturat de l'última direcció.
4. Si hi ha moviment, normalitza el vector amb `Vector2.normalize()` i el
   multiplica per `this.velocitat`.
5. Envia el resultat a Arcade Physics amb `setVelocity`.
6. Tria l'animació segons l'eix dominant. En un moviment diagonal equilibrat,
   preval l'eix vertical.

La normalització manté constant la velocitat total quan es camina en diagonal:
prémer dues direccions no fa que el personatge es mogui més de pressa que en
horitzontal o vertical.

Aquest és el fragment central del mètode `actualitzar`:

```js
const moviment = new Phaser.Math.Vector2(0, 0);

if (this.tecles.left.isDown || this.teclesWASD.esquerra.isDown) moviment.x -= 1;
if (this.tecles.right.isDown || this.teclesWASD.dreta.isDown) moviment.x += 1;
if (this.tecles.up.isDown || this.teclesWASD.amunt.isDown) moviment.y -= 1;
if (this.tecles.down.isDown || this.teclesWASD.avall.isDown) moviment.y += 1;

if (moviment.x === 0 && moviment.y === 0) {
    this.sprite.setVelocity(0, 0);
    this.sprite.anims.stop();
    this.sprite.setFrame(this.fotogramesAturats[this.direccioActual]);
    return;
}

moviment.normalize().scale(this.velocitat);
this.sprite.setVelocity(moviment.x, moviment.y);
```

El vector comença a zero. Les tecles n'alteren els eixos; si no hi ha moviment,
la velocitat s'atura. Si hi ha moviment, `normalize()` el converteix en un
vector de longitud `1` i `scale(this.velocitat)` l'ajusta a la velocitat actual.
`setVelocity` lliura el vector final al cos Arcade. A partir d'aquí, el motor
físic actualitza la posició del sprite; per això aquest codi no suma directament
valors a `sprite.x` o `sprite.y` ni necessita calcular la distància amb `delta`.

La velocitat configurada actualment a `Personatge.js` és `260` píxels per
segon. El material de la pràctica indica `160` píxels per segon; per coincidir
amb aquest valor, caldria canviar `this.velocitat`.

La direcció de l'animació s'escull amb l'eix dominant:

```js
if (Math.abs(moviment.x) > Math.abs(moviment.y)) {
    this.direccioActual = moviment.x > 0 ? "dreta" : "esquerra";
} else {
    this.direccioActual = moviment.y > 0 ? "avall" : "amunt";
}

this.sprite.anims.play(
    this.textura + "-caminar-" + this.direccioActual,
    true
);
```

El segon argument `true` evita reiniciar l'animació des del primer fotograma
cada vegada que Phaser crida `update`.
La clau construïda combina la textura i la direcció, de manera que cada variant
d'avatar pot tenir les seves pròpies animacions. `direccioActual` també es
guarda a l'objecte i s'utilitza quan el jugador deixa de moure's.

## 7. Aturada i orientació

Quan no es prem cap tecla, s'atura el cos físic i l'animació de caminar. Després
es fixa el fotograma aturat corresponent a `direccioActual`. Així el personatge
continua mirant cap a l'última direcció en què s'ha mogut.

La correspondència entre direcció i fotograma aturat es guarda al constructor:

```js
this.fotogramesAturats = {
    avall: 0,
    dreta: 3,
    amunt: 2,
    esquerra: 1
};
```

Quan no es prem cap tecla, `setVelocity(0, 0)` atura el cos físic; `anims.stop()`
atura el cicle de caminar; i `setFrame(...)` mostra el fotograma quiet
corresponent a `direccioActual`. Aquestes tres crides actuen sobre el mateix
sprite que es va crear al constructor.

## 8. Què encara no està implementat

La configuració d'Arcade Physics i el cos del jugador ja existeixen, però
aquesta part encara no:

- Ajustar la hitbox als peus del personatge.
- Fer que la capa `Paredes` bloquegi el moviment.
- Crear zones de proximitat i comunicar-les a Vue.

El cos físic manté, per tant, la mida per defecte del sprite escalat. Aquests
punts es poden afegir en una etapa posterior sense canviar el sistema de
controls i animacions.

## 9. Verificació

Des de la carpeta `front-projecteTR1-G4`, es pot comprovar que el frontend
compila amb:

```sh
npm run build
```
