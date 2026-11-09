export class rol {
    constructor({
        id_rol = null,
        nombre = '',
        descripcion = ''
    } = {}) {
        this.id_rol = id_rol;
        this.nombre = nombre;
        this.descripcion = descripcion;

        this.id = id_rol;
    }

    static fromJSON(json = {}) {
        return new rol({
            id_rol: json.id_rol ?? json.id ?? null,
            nombre: json.nombre ?? '',
            descripcion: json.descripcion ?? ''
        });
    }

    toJSON() {
        return {
            id_rol: this.id_rol,
            nombre: this.nombre,
            descripcion: this.descripcion
        };
    }
}
