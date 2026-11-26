# Pixel Plaza — Documentació tècnica

## 1. Objectius del projecte

Pixel Plaza és una aplicació web multijugador que recrea un institut virtual en 2D. Els usuaris poden entrar amb un avatar, moure's pel mapa, accedir a sales, comunicar-se mitjançant xat privat i fer videotrucades.

## 2. Arquitectura bàsica

### Tecnologies utilitzades

- **Vue 3:** interfície de l'aplicació.
- **Pinia:** gestió de l'estat.
- **Phaser 3:** mapa 2D i moviment dels personatges.
- **Node.js:** servidor.
- **Socket.IO:** comunicació en temps real.
- **WebRTC i Simple-Peer:** videotrucades.
- **Docker i Docker Compose:** desplegament.

### Interrelació entre components

Vue gestiona la interfície i es comunica amb Node.js mitjançant Socket.IO. Phaser mostra el mapa i permet moure els avatars. WebRTC gestiona l'àudio i el vídeo directament entre els navegadors.

**Diagrama del sistema:** `docs/diagrama-sistema/`

**Flux d'usuari:** `docs/flux-usuari/`

**Wireframes:** `docs/wireframes/`

## 3. Entorn de desenvolupament

### Repositori

GitHub: `inspedralbes/tr1-daw-equip4`

Carpeta arrel: `tr1-daw-equip4`

Per descarregar el projecte:

```bash
git clone https://github.com/inspedralbes/tr1-daw-equip4.git
cd tr1-daw-equip4
```

Per iniciar el desenvolupament:

1. Instal·lar les dependències del frontend i del backend amb `npm install`.
2. Iniciar cada part del projecte amb les ordres definides als seus respectius `package.json`.

## 4. Desplegament en producció

El projecte està preparat per utilitzar Docker i Docker Compose.

Ordres principals:

```bash
docker compose build
docker compose up -d
docker compose ps
```

Per aturar els serveis:

```bash
docker compose down
```

## 5. API i comunicació amb el backend

La comunicació principal es farà mitjançant Socket.IO.

Els esdeveniments previstos inclouen:

| Esdeveniment | Funció |
|---|---|
| `registrar-usuari` | Registrar un usuari |
| `crear-sala` | Crear una sala |
| `unir-sala` | Entrar en una sala |
| `sortir-sala` | Sortir d'una sala |
| `webrtc:signal` | Intercanviar informació per iniciar la videotrucada |
| `enviar-missatge-privat` | Enviar un missatge privat |
| `xat-privat-esborrar` | Esborrar la conversa |

**Nota:** aquests esdeveniments són la proposta de comunicació del projecte. Caldrà actualitzar aquesta documentació quan estiguin implementats.

Actualment, no es documenten rutes HTTP ni codis d'estat perquè encara no s'han definit els endpoints REST.


## 6. Altres elements

- **Gestió del projecte:** Taiga.
- **Videotrucades:** comunicació mitjançant WebRTC.
- **Xat privat:** missatges temporals entre usuaris d'una mateixa sala.
- **Estat del projecte:** en desenvolupament.