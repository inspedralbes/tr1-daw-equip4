import Phaser from "phaser";

// Crea el personatge, les animacions direccionals i els controls de cursor.
export function Personatge(escena, posicioHoritzontal, posicioVertical, textura) {
    this.escena = escena;
    this.textura = textura;
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

    // Deixar que les tecles arribin també als inputs (xat)
    escena.input.keyboard.clearCaptures();

    this.direccioActual = "avall";
    this.velocitat = 260;
    this.fotogramesAturats = {
        avall: 0,
        dreta: 3,
        amunt: 2,
        esquerra: 1
    };

    this.crearAnimacions();
}

Personatge.prototype.crearAnimacions = function () {
    const animacions = [
        { direccio: "avall", fotogrames: [0, 4, 8, 12] },
        { direccio: "dreta", fotogrames: [3, 7, 11, 15] },
        { direccio: "amunt", fotogrames: [2, 6, 10, 14] },
        { direccio: "esquerra", fotogrames: [1, 5, 9, 13] }
    ];

    animacions.forEach(function (animacio) {
        const clauAnimacio = this.textura + "-caminar-" + animacio.direccio;

        if (!this.escena.anims.get(clauAnimacio)) {
            this.escena.anims.create({
                key: clauAnimacio,
                frames: this.escena.anims.generateFrameNumbers(this.textura, {
                    frames: animacio.fotogrames
                }),
                frameRate: 8,
                repeat: -1
            });
        }
    }, this);
};

// Mou el personatge i reprodueix l'animació de la direcció corresponent.
Personatge.prototype.actualitzar = function () {

    // Si estic escrivint al xat, el personatge no es mou
    const escrivint = document.activeElement && document.activeElement.tagName === "INPUT";
    if (escrivint) {
        this.sprite.setVelocity(0, 0);
        this.sprite.anims.stop();
        this.sprite.setFrame(this.fotogramesAturats[this.direccioActual]);
        return;
    }

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

    if (Math.abs(moviment.x) > Math.abs(moviment.y)) {
        this.direccioActual = moviment.x > 0 ? "dreta" : "esquerra";
    } else {
        this.direccioActual = moviment.y > 0 ? "avall" : "amunt";
    }

    this.sprite.anims.play(
        this.textura + "-caminar-" + this.direccioActual,
        true
    );
};