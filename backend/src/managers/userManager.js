let usuarios = [];

export function registrarUsuario(datos, id) {

    const avatares = [
        'noi_pell_clara',
        'noi_pell_fosca',
        'noia_pell_clara',
        'noia_pell_fosca'
    ];

    // Validar datos
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return { correcto: false, mensaje: 'Nombre no válido' };
    }

    if (!['Alumno', 'Profesor'].includes(datos.rol)) {
        return { correcto: false, mensaje: 'Rol no válido' };
    }

    if (!avatares.includes(datos.avatar)) {
        return { correcto: false, mensaje: 'Avatar no válido' };
    }

    // Comprobar nombre repetido
    if (usuarios.some(u => u.nombre.toLowerCase() === datos.nombre.trim().toLowerCase())) {
        return { correcto: false, mensaje: 'Nombre ya registrado' };
    }

    // Colores para diferenciar a los usuarios
    const colores = ['#ff6b6b', '#4dabf7', '#51cf66', '#fcc419', '#cc5de8', '#ff922b'];
    
    // Guardar usuario
    const usuario = {
        id: id,
        nombre: datos.nombre.trim(),
        rol: datos.rol,
        avatar: datos.avatar,
        color: colores[Math.floor(Math.random() * colores.length)],
        x: 200,
        y: 150,
        direccio: 'avall',
        enMoviment: false
    };

    usuarios.push(usuario);

    return { correcto: true, usuario };
}

export function eliminarUsuario(id) {
    usuarios = usuarios.filter(usuario => usuario.id !== id);
}

export function obtenerUsuarios() {
    return usuarios;
}

// Guardar la nueva posición de un usuario
export function moureUsuario(id, dades) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return null;

    usuario.x = dades.x;
    usuario.y = dades.y;
    usuario.direccio = dades.direccio;
    usuario.enMoviment = dades.enMoviment;

    return usuario;
}