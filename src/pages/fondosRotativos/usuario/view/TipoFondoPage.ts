import { defineComponent, reactive } from 'vue'
import { Usuario } from '../domain/Usuario'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasUsuario } from '../domain/configuracionColumnasUsuario'
import { UsuarioController } from '../infrestructure/UsuarioController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Usuario, new UsuarioController())
    const { entidad: usuario, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()

    /*************
    * Validaciones
    **************/
    const reglas = {
      descripcion: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      transcriptor: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, usuario)
    setValidador(v$.value)
    onGuardado(() => {
      //sucursal.value=''
    })
    onReestablecer(() => {
      //sucursal.value=''
    })

    return {
      mixin,
      usuario,
      disabled, accion, v$,
      configuracionColumnas: configuracionColumnasUsuario,
    }
  }
})


