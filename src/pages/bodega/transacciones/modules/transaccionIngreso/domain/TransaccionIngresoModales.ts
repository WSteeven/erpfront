//Dependencias
import { markRaw } from 'vue'
import { empresas } from 'config/utils/sistema'
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'

//Paginas
import VisualizarIngresoPage from '../view/VisualizarIngresoPage.vue'
import DetalleProductoPageJpConstrucred from 'pages/bodega/detalles_productos/view/jpconstrucred/DetalleProductoPage.vue'
import DetalleProductoPageJpCustody from 'pages/bodega/detalles_productos/view/jpcustody/DetalleProductoPage.vue'


export class GestionarIngresoModales {
  VisualizarIngresoPage: ComponenteModal
  DetalleProductoPage: ComponenteModal

  constructor() {
    this.VisualizarIngresoPage = markRaw(new ComponenteModal('Ingreso de bodega', VisualizarIngresoPage))
    this.DetalleProductoPage = markRaw(new ComponenteModal('Detalle de producto', this.obtenerPagina()))
  }

  obtenerPagina() {
    switch (process.env.VUE_APP_ID) {
      case empresas.JPCONSTRUCRED: return DetalleProductoPageJpConstrucred
      case empresas.JPCUSTODY: return DetalleProductoPageJpCustody
      default: return DetalleProductoPageJpConstrucred
    }
  }
}