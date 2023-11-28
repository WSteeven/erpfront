// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RolPagoMesPage from 'recursosHumanos/rol-pago-mes/view/RolPagoMesPage.vue'
import RolPagoPage from 'recursosHumanos/rol-pago/view/RolPagoPage.vue'

export class RolPagoMesModales {
  RolPagoMesPage: ComponenteModal
  RolPagoPage: ComponenteModal


  constructor() {

    this.RolPagoMesPage = markRaw(
      new ComponenteModal('Rol de Pago', RolPagoMesPage)
    )
    this.RolPagoPage = markRaw(
      new ComponenteModal('Rol de Pago Empleado', RolPagoPage)
    )
  }
}
