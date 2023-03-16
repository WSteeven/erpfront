import {  defineComponent,ref } from 'vue'
import {  GastoCoordinadores } from '../domain/GastoCoordinadores'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required,maxLength, minLength } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoCoordinadoresController } from '../infrestructure/GastoCoordinadoresController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'


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
    const mixin = new ContenedorSimpleMixin(GastoCoordinadores, new GastoCoordinadoresController())
    const {
      entidad: gasto,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, consultar } =
      mixin.useComportamiento()

    /*******
     * Init
     ******/
    const fondoRotativoStore = useFondoRotativoStore()
    const mostrarListado = ref(true)
    if (fondoRotativoStore.id_gasto) {
      consultar({ id: fondoRotativoStore.id_gasto })
      mostrarListado.value = false
    }

    /*************
     * Validaciones
     **************/
    const reglas = {
      fecha_gasto: {
        required,
        minLength:minLength(3),
        maxLength: maxLength(50),
      },
      lugar: {
        required
      },
      monto: {
        required,
        minLength:minLength(3),
        maxLength: maxLength(50),
      },
      motivo:{
        required,
      },
      observacion: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)
    const cantones = ref([])
    const autorizacionesEspeciales = ref([])
    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' },
        },
      })
      cantones.value = listadosAuxiliares.cantones
      autorizacionesEspeciales.value =
        listadosAuxiliares.autorizacionesEspeciales

    })

    /*********
     * Filtros
     **********/

      // - Filtro Lugares
    function filtrarCantones(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      mixin,
      gasto,
      cantones,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      filtrarCantones,
    }
  },
})
