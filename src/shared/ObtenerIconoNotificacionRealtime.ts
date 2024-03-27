import { iconos } from "config/iconosNotificacionesRealtime";

export class ObtenerIconoNotificacionRealtime {
  obtener(tipoNotificacion: string) {
    switch (tipoNotificacion) {
      case iconos.pedido.label:
        return iconos.pedido.icono
      case iconos.preingreso.label:
        return iconos.preingreso.icono
      case iconos.autorizacion_gasto.label:
        return iconos.autorizacion_gasto.icono
      case iconos.tarea.label:
        return iconos.tarea.icono
      case iconos.subtarea.label:
        return iconos.subtarea.icono
      case iconos.ingreso.label:
        return iconos.ingreso.icono
      case iconos.egreso.label:
        return iconos.egreso.icono
      case iconos.ticket.label:
        return iconos.ticket.icono
      case iconos.devolucion.label:
        return iconos.devolucion.icono
      case iconos.permiso_empleado.label:
        return iconos.permiso_empleado.icono
      case iconos.licencia_empleado.label:
        return iconos.licencia_empleado.icono
      case iconos.solicitud_prestamo_empleado.label:
        return iconos.solicitud_prestamo_empleado.icono
      case iconos.vacacion.label:
        return iconos.vacacion.icono

      /*******************
       * MODULO DE COMPRAS Y PROVEEDORES
       ********************/
      case iconos.preorden.label:
        return iconos.preorden.icono
      case iconos.orden.label:
        return iconos.orden.icono
      case iconos.proforma.label:
        return iconos.proforma.icono
      case iconos.proveedor.label:
        return iconos.proveedor.icono

      /*******************
       * MODULO DE VEHICULOS
       ********************/
      case iconos.matricula.label:
        return iconos.matricula.icono
      case iconos.multa_conductor.label:
        return iconos.multa_conductor.icono
    }
  }
}
