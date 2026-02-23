//Dependencias
import { markRaw } from 'vue'
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'

//Paginas
import VisualizarIngresoPage from '../view/VisualizarIngresoPage.vue'
import DetalleProductoPageJpConstrucred from 'pages/bodega/detalles_productos/view/jpconstrucred/DetalleProductoPage.vue'
import ModificarIngresoPage from 'pages/bodega/transacciones/modules/transaccionIngreso/view/ModificarIngresoPage.vue';


export class GestionarIngresoModales {
  VisualizarIngresoPage: ComponenteModal
  DetalleProductoPage: ComponenteModal
  ModificarIngresoPage: ComponenteModal

  constructor() {
    this.VisualizarIngresoPage = markRaw(new ComponenteModal('Ingreso de bodega', VisualizarIngresoPage))
    this.DetalleProductoPage = markRaw(new ComponenteModal('Detalle de producto', this.obtenerPagina()))
    this.ModificarIngresoPage = markRaw(new ComponenteModal('', ModificarIngresoPage))
  }

  obtenerPagina() {
    switch (process.env.VUE_APP_ID) {
      default: return DetalleProductoPageJpConstrucred
    }
  }
}
