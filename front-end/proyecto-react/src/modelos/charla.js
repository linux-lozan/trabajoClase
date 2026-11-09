export class charla {
    constructor(
        id_charla = null,
        id_organizador = null,
        id_sala = null,
        titulo = '',
        descripcion = '',
        fecha = null,
        hora_inicio = null,
        hora_fin = null,
        aforo_maximo = 0,
        estado = 'borrador'
    ) {
        this.id_charla = id_charla;
        this.id_organizador = id_organizador;
        this.id_sala = id_sala;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.fecha = fecha;
        this.hora_inicio = hora_inicio;
        this.hora_fin = hora_fin;
        this.aforo_maximo = aforo_maximo;
        this.estado = estado;

        this.id = id_charla;
        this.nombre = titulo;
        this.ponente = id_organizador;
    }

    static fromJSON(json = {}) {
        return new charla(
            json.id_charla ?? json.id ?? null,
            json.id_organizador ?? null,
            json.id_sala ?? null,
            json.titulo ?? json.nombre ?? '',
            json.descripcion ?? '',
            json.fecha ?? null,
            json.hora_inicio ?? null,
            json.hora_fin ?? null,
            json.aforo_maximo ?? 0,
            json.estado ?? 'borrador'
        );
    }

    toJSON() {
        return {
            id_charla: this.id_charla,
            id_organizador: this.id_organizador,
            id_sala: this.id_sala,
            titulo: this.titulo,
            descripcion: this.descripcion,
            fecha: this.fecha,
            hora_inicio: this.hora_inicio,
            hora_fin: this.hora_fin,
            aforo_maximo: this.aforo_maximo,
            estado: this.estado,
        };
    }
}

export default charla;
