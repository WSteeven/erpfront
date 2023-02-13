import { defineComponent, reactive ,ref, watchEffect} from 'vue'
import { Saldo } from '../domain/Saldo'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { SaldoController } from '../infrestructure/SaldoController'
import { configuracionColumnasSaldo } from '../domain/configuracionColumnasSaldo'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'


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
    const mixin = new ContenedorSimpleMixin(Saldo, new SaldoController())
    const { entidad: saldo, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      usuario: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_fondo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      tipo_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      id_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      descripcion_saldo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      fecha: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      saldo_anterior: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      saldo_depositado: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      saldo_actual: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, saldo)
    setValidador(v$.value)
   const usuarios= ref([]);
   usuarios.value=listadosAuxiliares.usuarios

   cargarVista(async () => {
    await obtenerListados({
      cantones: {
        controller: new UsuarioController(),
        params: { campos: 'id,canton' },
      },

    })

    usuarios.value = listadosAuxiliares.usuarios

  })
    return {
      mixin,
      saldo,
      disabled, accion, v$,
      usuarios,
      configuracionColumnas: configuracionColumnasSaldo,
    }
  }
})


