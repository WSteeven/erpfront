//Dependencias
import { ComponenteModal } from 'components/modales/domain/ComponenteModal.domain'
import { markRaw } from 'vue'

//Paginas
import PisoPage from 'pages/administracion/pisos/view/PisoPage.vue'
import PerchaPage from 'pages/administracion/perchas/view/PerchaPage.vue'

export class UbicacionModales {
  PerchaPage: ComponenteModal
  PisoPage: ComponenteModal

  constructor(){
    this.PerchaPage = markRaw(new ComponenteModal('CONSTRUCRED', PerchaPage))
    this.PisoPage = markRaw(new ComponenteModal('CONSTRUCRED', PisoPage))
  }
}
