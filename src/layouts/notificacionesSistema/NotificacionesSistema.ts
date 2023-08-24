import { TransferenciaContabilidadPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaContabilidadPusherEvent'
import { TransferenciaSaldoPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaSaldoPusherEvent'
import { GastoCoordinadorPusherEvent } from 'pages/fondosRotativos/gastoCoordinador/application/GastoCoordinadorPusherEvent'
import { EgresoPusherEvent } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/EgresoPusherEvent'
import { SubtareaPusherEvent } from 'pages/gestionTrabajos/subtareas/application/SubtareaPusherEvent'
import { GastoPusherEvent } from 'pages/fondosRotativos/gasto/application/GastoPusherEvent'
import { PedidoPusherEvent } from 'pages/bodega/pedidos/application/PedidoPusherEvent'
import { TicketPusherEvent } from 'src/pusherEvents/TicketPusherEvent'
import { DevolucionPusherEvent } from 'pages/bodega/devoluciones/application/DevolucionPusherEvent'
import { PermisoEmpleadoPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/PermisosEmpleadoPusherEvent'
import { LicenciaPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/LicenciaEmpleadoPusherEvent'
import { SolicitudPrestamoEmpresarialPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/SolicitudPrestamoEmpresarialPusherEvent'
import { VacacionPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/VacacionPusherEvent'
import { PreordenCompraEvent } from 'pages/comprasProveedores/preordenCompra/application/PreordenCompraEvent'
import { OrdenCompraEvent } from 'pages/comprasProveedores/ordenCompra/application/OrdenCompraEvent'
import { ProformaEvent } from 'pages/comprasProveedores/proforma/application/ProformaEvent'
import { ProveedorEvent } from 'sistema/proveedores/application/ProveedorEvent'


export class NotificacionesSistema {
  init() {
    // Pedidos
    const pedidoPusherEvent = new PedidoPusherEvent()
    pedidoPusherEvent.start()

    //Devoluciones
    const devolucionPusherEvent = new DevolucionPusherEvent()
    devolucionPusherEvent.start()

    //Egresos
    const egresoPusherEvent = new EgresoPusherEvent()
    egresoPusherEvent.start()

    // Fondos rotativos
    const fondosRotativoPusherEvent = new GastoPusherEvent()
    fondosRotativoPusherEvent.start()

    // Saldos
    const transferenciaSaldoPusherEvent = new TransferenciaSaldoPusherEvent()
    transferenciaSaldoPusherEvent.start();

    // Notificar a contabilidad
    const transferenciaContabilidad = new TransferenciaContabilidadPusherEvent()
    transferenciaContabilidad.start();

    // Solicitud de fondos
    const solicitudFondosPusherEvent = new GastoCoordinadorPusherEvent()
    solicitudFondosPusherEvent.start()

    // Subtareas
    const subtareaPusherEvent = new SubtareaPusherEvent()
    subtareaPusherEvent.start()

    // Tickets
    const ticketPusherEvent = new TicketPusherEvent()
    ticketPusherEvent.start()

    //Recursos Humanos
    //Permiso de Empleado
    const permisoEmpleadoPusherEvent = new PermisoEmpleadoPusherEvent()
    permisoEmpleadoPusherEvent.start()
    //Licencia
    const licenciaPusherEvent = new LicenciaPusherEvent()
    licenciaPusherEvent.start()
    //Solicitud prestamo empresarial
    const solicitudPrestamoEmpresarialPusherEvent = new SolicitudPrestamoEmpresarialPusherEvent()
    solicitudPrestamoEmpresarialPusherEvent.start()
    //Vacacion
    const vacacionPusherEvent = new VacacionPusherEvent()
    vacacionPusherEvent.start()

    // Proveedor
    const proveedorPusherEvent = new ProveedorEvent()
    proveedorPusherEvent.start()

    // Preorden de compra
    const preordenCompraPusherEvent = new PreordenCompraEvent()
    preordenCompraPusherEvent.start()

    //Orden de compra
    const ordenCompraPusherEvent = new OrdenCompraEvent()
    ordenCompraPusherEvent.start()

    //Proforma
    const proformaPusherEvent = new ProformaEvent()
    proformaPusherEvent.start()
  }
}
