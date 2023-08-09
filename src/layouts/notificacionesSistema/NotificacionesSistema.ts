import { TransferenciaContabilidadPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaContabilidadPusherEvent'
import { TransferenciaSaldoPusherEvent } from 'pages/fondosRotativos/autorizarTransferencia/application/TransferenciaSaldoPusherEvent'
import { GastoCoordinadorPusherEvent } from 'pages/fondosRotativos/gastoCoordinador/application/GastoCoordinadorPusherEvent'
import { EgresoPusherEvent } from 'pages/bodega/transacciones/modules/transaccionEgreso/application/EgresoPusherEvent'
import { SubtareaPusherEvent } from 'pages/gestionTrabajos/subtareas/application/SubtareaPusherEvent'
import { GastoPusherEvent } from 'pages/fondosRotativos/gasto/application/GastoPusherEvent'
import { PedidoPusherEvent } from 'pages/bodega/pedidos/application/PedidoPusherEvent'
import { TicketPusherEvent } from 'src/pusherEvents/TicketPusherEvent'
import { DevolucionPusherEvent } from 'pages/bodega/devoluciones/application/DevolucionPusherEvent'
import { PreordenCompraEvent } from 'pages/comprasProveedores/preordenCompra/application/PreordenCompraEvent'


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

    // Preorden de compra
    const preordenCompraPusherEvent = new PreordenCompraEvent()
    preordenCompraPusherEvent.start()
  }
}
