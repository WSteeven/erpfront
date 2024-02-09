import { EsquemaVacuna } from 'pages/medico/gestionarPacientes/domain/EsquemaVacuna'
import { defineComponent } from 'vue'

import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import { EsquemaVacunaControllerController } from '../infraestructure/EsquemaVacunaController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'

export default defineComponent({
  components: {
    SimpleLayout,
  },
  setup() {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(EsquemaVacuna, new EsquemaVacunaControllerController())
    const { entidad: esquema, listadosAuxiliares } = mixin.useReferencias()

    return {
      mixin,
      esquema,
    }
  }
})
