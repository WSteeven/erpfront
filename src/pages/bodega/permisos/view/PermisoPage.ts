// Dependencias

import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PermisoController } from '../infraestructure/PermisoConstroller'
import { Permiso } from '../domain/Permiso'
import { configuracionColumnasPermisosArmas } from '../domain/configuracionColumnasPermisos'
import { maskFecha } from 'config/utils'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Permiso, new PermisoController())
    const { entidad: permiso, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()


    onGuardado((id, response) => {
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'PermisoArmaPage', id: id, modelo: response.modelo })
    })

    //Reglas de validacion
    const reglas = {
      nombre: { required },
      fecha_caducidad: { required },
      fecha_emision: { required },
      imagen_permiso: { required },
      imagen_permiso_reverso: { required },
    }

    const v$ = useVuelidate(reglas, permiso)
    setValidador(v$.value)

    return {
      mixin,
      permiso,
      maskFecha,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasPermisosArmas,
    }
  }
})
