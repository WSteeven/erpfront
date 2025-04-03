import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'
import TanqueoLitePage from 'vehiculos/bitacoraVehicular/view/TanqueoLitePage.vue'

export class BitacoraVehicularModales{
  TanqueoPage:ComponenteModal

  constructor() {
    this.TanqueoPage = markRaw(new ComponenteModal('Tanqueo de Combustible', TanqueoLitePage))
  }
}
