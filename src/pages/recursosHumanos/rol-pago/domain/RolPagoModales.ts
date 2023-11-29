// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RolPagoPage from 'recursosHumanos/rol-pago/view/RolPagoPage.vue'
import RolPagoFirmadoPage from 'src/pages/recursosHumanos/rol-pago/view/RolPagoFirmadoPage.vue'

export class RolPagoModales {
  RolPagoPage: ComponenteModal
  RolPagoFirmadoPage: ComponenteModal

  constructor() {
    this.RolPagoPage = markRaw(
      new ComponenteModal('Rol Pago Empleado', RolPagoPage)
    )

    this.RolPagoFirmadoPage = markRaw(
      new ComponenteModal('Rol Pago Firmado', RolPagoFirmadoPage)
    )
  }
}
