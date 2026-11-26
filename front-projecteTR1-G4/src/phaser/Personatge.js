// Crea un personatge dins de l'escena i prepara els controls de cursor.
export function Personatge(escena, posicioHoritzontal, posicioVertical, textura) {
    this.sprite = escena.add.image(posicioHoritzontal, posicioVertical, textura);
    this.tecles = escena.input.keyboard.createCursorKeys();
}

// Mou el personatge segons les tecles premudes, independentment dels fotogrames per segon.
Personatge.prototype.actualitzar = function (delta) {
    const velocitat = 380;
    const distancia = velocitat * delta / 1000;

    if (this.tecles.left.isDown) this.sprite.x -= distancia;
    if (this.tecles.right.isDown) this.sprite.x += distancia;
    if (this.tecles.up.isDown) this.sprite.y -= distancia;
    if (this.tecles.down.isDown) this.sprite.y += distancia;
};