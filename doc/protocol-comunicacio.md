# PROTOCOL DE COMUNICACIÓ
**Pixel Plaza – Versió 1.0**

## 1. Objectiu

Aquest document defineix el protocol de comunicació de Pixel Plaza. Especifica com s'intercanviarà informació entre el client (Vue 3) i el servidor (Node.js), així com la comunicació d'àudio, vídeo i missatges privats entre els usuaris.

L'objectiu és establir unes normes comunes perquè tots els membres de l'equip desenvolupin el projecte seguint la mateixa estructura.

## 2. Tecnologies utilitzades

| Tecnologia | Funció |
|---|---|
| Vue 3 | Interfície de l'aplicació. |
| Pinia | Gestió de l'estat dels usuaris i les sales. |
| Node.js | Servidor de l'aplicació. |
| Socket.IO | Comunicació entre clients i servidor. |
| Simple-Peer | Gestió de les connexions WebRTC d'àudio i vídeo. |

## 3. Connexió i identificació d'usuaris

Quan un usuari accedeix a Pixel Plaza, el client estableix una connexió amb el servidor mitjançant Socket.IO.

A continuació, envia les seves dades per identificar-se i poder accedir al lobby.

| Esdeveniment | Direcció | Dades | Funció |
|---|---|---|---|
| `connect` | Client → Servidor | — | Establir connexió amb el servidor. |
| `registrar-usuari` | Client → Servidor | Nom, avatar | Registrar l'usuari. |
| `llista-usuaris` | Servidor → Client | Llista d'usuaris | Actualitzar els usuaris connectats. |
| `disconnect` | Client → Servidor | — | Notificar la desconnexió. |

## 4. Gestió de sales

Els usuaris podran consultar les sales disponibles, crear-ne de noves o unir-se a sales existents.

| Esdeveniment | Direcció | Dades | Funció |
|---|---|---|---|
| `obtenir-sales` | Client → Servidor | — | Sol·licitar les sales disponibles. |
| `llista-sales` | Servidor → Client | Llista de sales | Retornar les sales disponibles. |
| `crear-sala` | Client → Servidor | Nom de la sala | Crear una sala nova. |
| `unir-sala` | Client → Servidor | ID de la sala | Entrar en una sala. |
| `usuari-unit` | Servidor → Clients de la sala | Dades de l'usuari | Notificar que un usuari ha entrat. |
| `sortir-sala` | Client → Servidor | ID de la sala | Sortir de la sala. |
| `usuari-ha-sortit` | Servidor → Clients de la sala | ID de l'usuari | Notificar que un usuari ha sortit. |

## 5. Comunicació d'àudio i vídeo (WebRTC)

Per a les videotrucades utilitzarem Simple-Peer, que facilitarà l'establiment de connexions WebRTC entre els participants d'una mateixa sala.

Socket.IO s'encarregarà de transportar els senyals necessaris per establir aquestes connexions.

| Esdeveniment | Direcció | Dades | Funció |
|---|---|---|---|
| `webrtc:signal` | Client → Servidor | ID destinatari i senyal | Enviar informació de senyalització. |
| `webrtc:signal` | Servidor → Client destinatari | ID emissor i senyal | Reenviar el senyal a l'altre usuari. |

### Esdeveniments principals de Simple-Peer

| Esdeveniment | Funció |
|---|---|
| `signal` | Generar informació necessària per establir la connexió. |
| `connect` | Indicar que la connexió està establerta. |
| `stream` | Rebre el flux d'àudio i vídeo de l'altre usuari. |
| `close` | Indicar que la connexió s'ha tancat. |
| `error` | Gestionar possibles errors de connexió. |

Els senyals generats per Simple-Peer s'enviaran mitjançant Socket.IO fins a arribar a l'altre participant.

Cada usuari podrà establir connexions amb els altres participants de la sala.

## 6. Controls de micròfon i càmera

Els usuaris podran gestionar els seus dispositius durant la videotrucada.

| Acció | Funcionament |
|---|---|
| Activar/desactivar micròfon | Modificar l'estat de la pista d'àudio. |
| Activar/desactivar càmera | Modificar l'estat de la pista de vídeo. |
| Sortir de la trucada | Tancar les connexions corresponents. |

L'estat del micròfon i la càmera es podrà comunicar mitjançant Socket.IO perquè la resta de participants puguin veure si un usuari els té activats o desactivats.

## 7. Xat privat entre usuaris

Pixel Plaza incorporarà un xat privat perquè dos usuaris d'una mateixa sala puguin intercanviar missatges de text sense que la resta de participants els puguin veure.

El xat funcionarà mitjançant Socket.IO.

| Esdeveniment | Direcció | Dades | Funció |
|---|---|---|---|
| `enviar-missatge-privat` | Client → Servidor | ID destinatari i missatge | Enviar un missatge privat. |
| `rebre-missatge-privat` | Servidor → Client destinatari | ID emissor i missatge | Rebre el missatge privat. |
| `xat-privat-esborrar` | Servidor → Clients implicats | ID de la conversa | Eliminar la conversa quan un usuari surti de la sala. |

### Normes del xat privat

- Només es podrà parlar amb usuaris de la mateixa sala.
- Els missatges només seran visibles per als dos participants de la conversa.
- No es guardarà l'historial en una base de dades.
- Els missatges seran temporals.
- Quan un usuari surti de la sala, s'eliminarà l'historial de la conversa dels dos participants.
- Si tornen a iniciar una conversa, començarà buida.

## 8. Desconnexió i sortida

Quan un usuari abandoni una sala o es desconnecti de l'aplicació:

- El servidor actualitzarà la llista d'usuaris connectats.
- Els altres participants rebran una notificació.
- Es tancaran les connexions WebRTC corresponents.
- S'eliminarà l'historial dels xats privats de la sala.
- S'actualitzarà la informació del lobby.

## 9. Funcionament general

El funcionament general de la comunicació serà:

1. L'usuari es connecta a Pixel Plaza.
2. S'identifica amb el seu nom i avatar.
3. Accedeix al lobby i consulta les sales disponibles.
4. Crea una sala o s'uneix a una existent.
5. Pot comunicar-se amb els altres participants mitjançant àudio i vídeo.
6. Pot iniciar un xat privat amb qualsevol participant de la mateixa sala.
7. Pot activar o desactivar el micròfon i la càmera.
8. Quan surt de la sala, es tanquen les connexions i s'eliminen els missatges privats.

## 10. Consideracions

Aquest protocol correspon a la primera versió de la comunicació de Pixel Plaza.

Els noms dels esdeveniments i les dades indicades són una proposta inicial que haurà de seguir tot l'equip durant el desenvolupament.

Qualsevol modificació del protocol haurà de ser comunicada i acordada entre els membres de l'equip.