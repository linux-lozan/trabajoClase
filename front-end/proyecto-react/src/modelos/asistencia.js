export class asistencia {
    constructor({
        id_asistencia = null,
        id_reserva = null,
        id_usuario_validador = null,
        fecha_hora_acceso = null,
        resultado = 'valida',
        observaciones = ''
    } = {}) {
        this.id_asistencia = id_asistencia;
        this.id_reserva = id_reserva;
        this.id_usuario_validador = id_usuario_validador;
        this.fecha_hora_acceso = fecha_hora_acceso;
        this.resultado = resultado;
        this.observaciones = observaciones;

        this.id = id_asistencia;
    }

    static fromJSON(json = {}) {
        return new asistencia({
            id_asistencia: json.id_asistencia ?? json.id ?? null,
            id_reserva: json.id_reserva ?? null,
            id_usuario_validador: json.id_usuario_validador ?? null,
            fecha_hora_acceso: json.fecha_hora_acceso ?? null,
            resultado: json.resultado ?? 'valida',
            observaciones: json.observaciones ?? ''
        });
    }

    toJSON() {
        return {
            id_asistencia: this.id_asistencia,
            id_reserva: this.id_reserva,
            id_usuario_validador: this.id_usuario_validador,
            fecha_hora_acceso: this.fecha_hora_acceso,
            resultado: this.resultado,
            observaciones: this.observaciones
        };
    }
}
