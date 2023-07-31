// Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

// Paginas
import RolPagoPage from 'recursosHumanos/rol-pago/view/RolPagoPage.vue'


export class RolPagoModales {
  RolPagoPage: ComponenteModal


  constructor() {
    this.RolPagoPage = markRaw(
      new ComponenteModal('Rol Pago Empleado', RolPagoPage)
    )
  }
}
