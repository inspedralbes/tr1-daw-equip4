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

    // Guardar usuario
    const usuario = {
        id: id,
        nombre: datos.nombre.trim(),
        rol: datos.rol,
        avatar: datos.avatar
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