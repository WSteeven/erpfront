// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RegistroTendidoPage from '../modules/registrosTendidos/view/RegistroTendidoPage'
import ResumenTendidoPage from '../modules/resumenTendido/view/ResumenTendidoPage'

export class TendidoModales {
  RegistroTendidoPage: ComponenteModal
  ResumenTendidoPage: ComponenteModal

  constructor() {
    this.RegistroTendidoPage = markRaw(
      new ComponenteModal('Agregar elemento', RegistroTendidoPage)
    )
    this.ResumenTendidoPage = markRaw(
      new ComponenteModal('Resumen del tendido', ResumenTendidoPage)
    )
  }
}
