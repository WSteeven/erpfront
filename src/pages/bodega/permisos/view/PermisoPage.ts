// Dependencias

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoController } from '../infraestructure/PermisoConstroller'
import { Permiso } from '../domain/Permiso'
import { configuracionColumnasPermisos } from 'pages/permisos/domain/configuracionColumnasPermisos'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisoController())
    const { entidad: permiso, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      emision: { required },
      caducidad: { required },
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)

    return {
      mixin,
      permiso,
      emision,
      caducidad,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPermisos,
    }
  }
})
