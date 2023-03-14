import { defineComponent,ref} from 'vue'
import { Transferencia } from '../domain/Transferencia'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from 'pages/bodega/transferencia/infraestructure/TransferenciaController'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'


export default defineComponent({
  components: { TabLayout ,SelectorImagen},
  setup() {
    /*********
    * Stores
    *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
    * Mixin
    ************/
    const mixin = new ContenedorSimpleMixin(Transferencia, new TransferenciaController())
    const { entidad: transferencia, disabled, accion,listadosAuxiliares } = mixin.useReferencias()
    const { setValidador ,obtenerListados, cargarVista} = mixin.useComportamiento()

    /*************
    * Validaciones
    **************/
    const reglas = {
      usuario_envia: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      usuario_recive: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      monto: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      motivo: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      comprobante: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    }
    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)
   const usuarios= ref([]);

   usuarios.value=listadosAuxiliares.usuarios

   cargarVista(async () => {
    await obtenerListados({
      usuarios: {
        controller: new UsuarioController(),
        params: { campos: 'id,name' },
      },

    })

    usuarios.value = listadosAuxiliares.usuarios

  })
  /*********
   * Filtros
   **********/
 // - Filtro AUTORIZACIONES ESPECIALES

 function filtrarUsuarios(val, update) {
  if (val === '') {
    update(() => {
      usuarios.value =
        listadosAuxiliares.usuarios
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    usuarios.value =
      listadosAuxiliares.usuarios.filter(
        (v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1
      )
  })
}

    return {
      mixin,
      transferencia,
      disabled, accion, v$,
      usuarios,
      filtrarUsuarios,
      configuracionColumnas: configuracionColumnasTransferencia,
    }
  }
})


