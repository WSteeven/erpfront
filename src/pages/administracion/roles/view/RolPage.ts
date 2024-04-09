import { defineComponent } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { RolController } from '../infraestructure/RolController'
import { configuracionColumnasRol } from '../domain/configuracionColumnasRol'
import { Rol } from '../domain/Rol'
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { acciones } from 'config/utils'



export default defineComponent({
  components: { TabLayout, EssentialTable },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Rol, new RolController())
    const { entidad: rol, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      name: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, rol)
    setValidador(v$.value)
    return {
      mixin,
      rol,
      disabled, accion, acciones, v$,
      configuracionColumnas: configuracionColumnasRol,
      columnasEmpleados: configuracionColumnasEmpleadosLite,
    }
  }
})


