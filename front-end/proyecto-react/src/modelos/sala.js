export class sala {
    constructor({
        id_sala = null,
        nombre = '',
        ubicacion = '',
        capacidad = 0
    } = {}) {
        this.id_sala = id_sala;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.capacidad = capacidad;

        this.id = id_sala;
    }

    static fromJSON(json = {}) {
        return new sala({
            id_sala: json.id_sala ?? json.id ?? null,
            nombre: json.nombre ?? '',
            ubicacion: json.ubicacion ?? '',
            capacidad: json.capacidad ?? 0
        });
    }

    toJSON() {
        return {
            id_sala: this.id_sala,
            nombre: this.nombre,
            ubicacion: this.ubicacion,
            capacidad: this.capacidad
        };
    }
}
