export class notificacionEmail {
    constructor({
        id_email = null,
        id_reserva = null,
        destinatario = '',
        tipo = 'confirmacion',
        fecha_envio = null,
        estado_envio = 'pendiente',
        error = ''
    } = {}) {
        this.id_email = id_email;
        this.id_reserva = id_reserva;
        this.destinatario = destinatario;
        this.tipo = tipo;
        this.fecha_envio = fecha_envio;
        this.estado_envio = estado_envio;
        this.error = error;

        this.id = id_email;
    }

    static fromJSON(json = {}) {
        return new notificacionEmail({
            id_email: json.id_email ?? json.id ?? null,
            id_reserva: json.id_reserva ?? null,
            destinatario: json.destinatario ?? '',
            tipo: json.tipo ?? 'confirmacion',
            fecha_envio: json.fecha_envio ?? null,
            estado_envio: json.estado_envio ?? 'pendiente',
            error: json.error ?? ''
        });
    }

    toJSON() {
        return {
            id_email: this.id_email,
            id_reserva: this.id_reserva,
            destinatario: this.destinatario,
            tipo: this.tipo,
            fecha_envio: this.fecha_envio,
            estado_envio: this.estado_envio,
            error: this.error
        };
    }
}
