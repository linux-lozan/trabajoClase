export class reserva {
    constructor({
        id_reserva = null,
        id_usuario = null,
        id_charla = null,
        fecha_reserva = null,
        estado = 'pendiente',
        observaciones = '',
        reserva_activa = null
    } = {}) {
        this.id_reserva = id_reserva;
        this.id_usuario = id_usuario;
        this.id_charla = id_charla;
        this.fecha_reserva = fecha_reserva;
        this.estado = estado;
        this.observaciones = observaciones;
        this.reserva_activa = reserva_activa;

        this.id = id_reserva;
    }

    static fromJSON(json = {}) {
        return new reserva({
            id_reserva: json.id_reserva ?? json.id ?? null,
            id_usuario: json.id_usuario ?? null,
            id_charla: json.id_charla ?? null,
            fecha_reserva: json.fecha_reserva ?? null,
            estado: json.estado ?? 'pendiente',
            observaciones: json.observaciones ?? '',
            reserva_activa: json.reserva_activa ?? null
        });
    }

    toJSON() {
        return {
            id_reserva: this.id_reserva,
            id_usuario: this.id_usuario,
            id_charla: this.id_charla,
            fecha_reserva: this.fecha_reserva,
            estado: this.estado,
            observaciones: this.observaciones,
            reserva_activa: this.reserva_activa
        };
    }
}
