import { iconos } from "config/iconosNotificacionesRealtime";

export class ObtenerIconoNotificacionRealtime {
    obtener(tipoNotificacion:string){
        switch(tipoNotificacion){
            case iconos.pedido.label:
                return iconos.pedido.icono
            case iconos.autorizacion_gasto.label:
                return iconos.autorizacion_gasto.icono
            case iconos.tarea.label:
                return iconos.tarea.icono
            case iconos.subtarea.label:
                return iconos.subtarea.icono
            case iconos.egreso.label:
                return iconos.egreso.icono
        }
    }
}