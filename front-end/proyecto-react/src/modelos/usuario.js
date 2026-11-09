export class usuario {
    constructor({
        id_usuario = null,
        id_rol = null,
        nombre = '',
        apellidos = '',
        email = '',
        password_hash = '',
        fecha_registro = null,
        activo = true
    } = {}) {
        this.id_usuario = id_usuario;
        this.id_rol = id_rol;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.password_hash = password_hash;
        this.fecha_registro = fecha_registro;
        this.activo = activo;

        this.id = id_usuario;
    }

    static fromJSON(json = {}) {
        return new usuario({
            id_usuario: json.id_usuario ?? json.id ?? null,
            id_rol: json.id_rol ?? null,
            nombre: json.nombre ?? '',
            apellidos: json.apellidos ?? '',
            email: json.email ?? '',
            password_hash: json.password_hash ?? '',
            fecha_registro: json.fecha_registro ?? null,
            activo: json.activo ?? true
        });
    }

    toJSON() {
        return {
            id_usuario: this.id_usuario,
            id_rol: this.id_rol,
            nombre: this.nombre,
            apellidos: this.apellidos,
            email: this.email,
            password_hash: this.password_hash,
            fecha_registro: this.fecha_registro,
            activo: this.activo
        };
    }
}
