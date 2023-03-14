import { defineComponent, ref } from 'vue'
import { Transferencia } from '../domain/Transferencia'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import {  required,maxLength, requiredIf } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransferenciaController } from '../infrestructure/TransferenciaController'
import { configuracionColumnasTransferencia } from '../domain/configuracionColumnasTransferencia'
import { UsuarioController } from 'pages/fondosRotativos/usuario/infrestructure/UsuarioController'

export default defineComponent({
  components: { TabLayout, SelectorImagen },
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Transferencia, new TransferenciaController())
    const {
      entidad: transferencia,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*************
     * Validaciones
     **************/
    const reglas = {
      usuario_envia : {
        required,
        requiredIf: requiredIf(() => transferencia.usuario_envia !== transferencia.usuario_recibe? false : true),
        maxLength: maxLength(50),
      },
      usuario_recibe: {
        requiredIf: requiredIf(() => transferencia.usuario_envia !== transferencia.usuario_recibe? false : true),
        maxLength: maxLength(50),
      },
      monto: {
        required,
        maxLength: maxLength(50),
      },
      cuenta: {
        required,
        maxLength: maxLength(50),
      },
      comprobante: {
        required,
      },
    }

    const v$ = useVuelidate(reglas, transferencia)
    setValidador(v$.value)

    const usuarios = ref([])
    const esDevolucion = ref(true)
    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        usuarios: {
          controller: new UsuarioController(),
          params: { campos: 'id,canton' },
        },
      })
      usuarios.value = listadosAuxiliares.usuarios
    })

    /*********
     * Filtros
     **********/
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
    function existeDevolucion(){
      if(esDevolucion.value ==true){
        transferencia.usuario_recibe = null
        transferencia.motivo = 'DEVOLUCION'
      }else{
        transferencia.motivo = 'TRANSFERENCIA ENTRE USUARIOS'
      }
    }
    return {
      mixin,
      transferencia,
      esDevolucion,
      disabled, accion, v$,
      usuarios,
      filtrarUsuarios,
      existeDevolucion,
      configuracionColumnas: configuracionColumnasTransferencia,
    }
  },
})
