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
import { ActualizarNotificacionesPusherEvent } from 'src/pusherEvents/ActualizarNotificacionesPusherEvent'
import { NotificarVacacionPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/NotificarVacacionPusherEvent'
import { PreingresoMaterialPusherEvent } from 'pages/bodega/preingresoMateriales/application/PreingresoPusherEvent'
import { IngresoPusherEvent } from 'pages/bodega/transacciones/modules/transaccionIngreso/application/IngresoPusherEvent'
import { MatriculaPusherEvent } from 'pages/controlVehiculos/matriculacion/application/MatriculaPusherEvent'
import { NotificarPermisoEmpleadoPusherEvent } from 'src/pusherEvents/recursosHumanos/nominasPermisos/NotificarPermisoEmpleadoPusherEvent'
import { MultaConductorPusherEvent } from 'pages/controlVehiculos/conductores/modules/multas/application/MultaPusherEvent'
import { AsignarVehiculoPusherEvent } from 'pages/controlVehiculos/asignarVehiculos/application/AsignarVehiculoPusherEvent'
import { OrdenReparacionPusherEvent } from 'src/pusherEvents/vehiculos/OrdenReparacionPusherEvent'
import { BitacoraVehicularPusherEvent } from 'src/pusherEvents/vehiculos/BitacoraVehicularPusherEvent'
import { MantenimientoVehiculoPusherEvent } from 'src/pusherEvents/vehiculos/MantenimientVehiculoPusherEvent'
import { SolicitudExamenPusherEvent } from 'src/pusherEvents/medico/SolicitudExamenPusherEvent'
import { DiasDescansoPusherEvent } from 'src/pusherEvents/medico/DiasDescansoPusherEvent'


export class NotificacionesSistema {
  init() {
    // Actualizar Notificaciones
    const actualizarNotificacionesPusherEvent = new ActualizarNotificacionesPusherEvent()
    actualizarNotificacionesPusherEvent.start()

    // Pedidos
    const pedidoPusherEvent = new PedidoPusherEvent()
    pedidoPusherEvent.start()

    // Preingresos de materiales
    const preingresoMaterialEvent = new PreingresoMaterialPusherEvent()
    preingresoMaterialEvent.start()

    // Devoluciones
    const devolucionPusherEvent = new DevolucionPusherEvent()
    devolucionPusherEvent.start()

    // Ingresos
    const ingresoPusherEvent = new IngresoPusherEvent()
    ingresoPusherEvent.start()
    // Egresos
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

    /*******************
    * Recursos Humanos
    ********************/
    // Permiso de Empleado
    const permisoEmpleadoPusherEvent = new PermisoEmpleadoPusherEvent()
    permisoEmpleadoPusherEvent.start()

    //Notificar permisos de empleados de fecha actual a recursos humanos
    const notificarPermisoEmpleadoPusherEvent = new NotificarPermisoEmpleadoPusherEvent()
    notificarPermisoEmpleadoPusherEvent.start()

    // Licencia
    const licenciaPusherEvent = new LicenciaPusherEvent()
    licenciaPusherEvent.start()

    // Solicitud prestamo empresarial
    const solicitudPrestamoEmpresarialPusherEvent = new SolicitudPrestamoEmpresarialPusherEvent()
    solicitudPrestamoEmpresarialPusherEvent.start()

    //Vacacion
    const vacacionPusherEvent = new VacacionPusherEvent()
    vacacionPusherEvent.start()

    // Notificar Vacaciones
    const notificarVacacionPusherEvent = new NotificarVacacionPusherEvent()
    notificarVacacionPusherEvent.start()

    // Proveedor
    const proveedorPusherEvent = new ProveedorEvent()
    proveedorPusherEvent.start()

    // Preorden de compra
    const preordenCompraPusherEvent = new PreordenCompraEvent()
    preordenCompraPusherEvent.start()

    // Orden de compra
    const ordenCompraPusherEvent = new OrdenCompraEvent()
    ordenCompraPusherEvent.start()

    // Proforma
    const proformaPusherEvent = new ProformaEvent()
    proformaPusherEvent.start()


    /*******************
     * MODULO VEHICULOS
     ********************/
    const matriculaPusherEvent = new MatriculaPusherEvent()
    matriculaPusherEvent.start()

    const multaPusherEvent = new MultaConductorPusherEvent()
    multaPusherEvent.start()

    const asignacionVehiculoEvent = new AsignarVehiculoPusherEvent()
    asignacionVehiculoEvent.start()

    const ordenesReparacionesVehiculos = new OrdenReparacionPusherEvent()
    ordenesReparacionesVehiculos.start()

    const bitacorasVehiculos = new BitacoraVehicularPusherEvent()
    bitacorasVehiculos.start()

    new MantenimientoVehiculoPusherEvent().start()

    /******************
     *  Modulo medico
     ******************/
    const solicitudExamenPusherEvent = new SolicitudExamenPusherEvent()
    solicitudExamenPusherEvent.start()

    const diasDescansoPusherEvent = new DiasDescansoPusherEvent()
    diasDescansoPusherEvent.start()
  }
}
