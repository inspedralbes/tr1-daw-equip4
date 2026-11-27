let sales = [];
let comptador = 1;   // para generar ids: sala-1, sala-2...

export function crearSala(nom, profe) {

    if (!nom || nom.trim().length < 2) {
        return { correcto: false, mensaje: 'Nom de sala no vàlid' };
    }

    // un profe solo puede tener una sala abierta
    if (sales.some(s => s.profeId === profe.id)) {
        return { correcto: false, mensaje: 'Ja tens una sala oberta' };
    }

    const sala = {
        id: 'sala-' + comptador++,
        nom: nom.trim(),
        profeId: profe.id,
        profeNom: profe.nombre,
        membres: [profe.id]          // ids de socket de los que están dentro
    };

    sales.push(sala);
    return { correcto: true, sala };
}

export function unirSala(idSala, idUsuari) {
    const sala = sales.find(s => s.id === idSala);

    if (!sala) {
        return { correcto: false, mensaje: 'La sala no existeix' };
    }

    if (!sala.membres.includes(idUsuari)) {
        sala.membres.push(idUsuari);
    }

    return { correcto: true, sala };
}

export function sortirSala(idUsuari) {
    const sala = salaDeUsuari(idUsuari);
    if (!sala) return null;

    sala.membres = sala.membres.filter(id => id !== idUsuari);
    return sala;
}

export function tancarSala(idSala) {
    sales = sales.filter(s => s.id !== idSala);
}

export function salaDeUsuari(idUsuari) {
    return sales.find(s => s.membres.includes(idUsuari)) || null;
}

// versión resumida para el front (sin ids de socket)
export function obtenerSales() {
    return sales.map(s => ({
        id: s.id,
        nom: s.nom,
        profeNom: s.profeNom,
        numMembres: s.membres.length
    }));
}