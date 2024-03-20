import {  defineComponent,ref } from 'vue'
import {  GastoCoordinadores } from '../domain/GastoCoordinadores'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from 'shared/i18n-validators'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoCoordinadoresController } from '../infrestructure/GastoCoordinadoresController'
import { configuracionColumnasGasto } from '../domain/configuracionColumnasGasto'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { MotivoGastoController } from 'pages/fondosRotativos/MotivoGasto/infrestructure/MotivoGastoController'
import { GrupoController } from 'pages/recursosHumanos/grupos/infraestructure/GrupoController'


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
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

    /*******
     * Init
     ******/



    /*************
     * Validaciones
     **************/
    const reglas = {
      lugar: {
        required
      },
      grupo:{
        required
      },
      monto: {
        required,
      },
      motivo:{
        required,
      },
      observacion: {
        required,
        minLength: minLength(25),
      },
    }

    const v$ = useVuelidate(reglas, gasto)
    setValidador(v$.value)
    const cantones = ref([])
    const motivos = ref([])
    const grupos = ref([])
    const autorizacionesEspeciales = ref([])
    //Obtener el listado de las cantones
    cargarVista(async () => {
      await obtenerListados({
        cantones: {
          controller: new CantonController(),
          params: { campos: 'id,canton' },
        },
        motivos: {
          controller: new MotivoGastoController(),
          params: { campos: 'id,nombre' },
        },
        grupos:{
          controller: new GrupoController(),
          params: { campos: 'id,nombre' },
        }
      })
      cantones.value = listadosAuxiliares.cantones
      motivos.value = listadosAuxiliares.motivos
      grupos.value = listadosAuxiliares.grupos
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
    // filtro de grupos
    function filtrarGrupos(val, update) {
      if (val === '') {
        update(() => {
          grupos.value = listadosAuxiliares.grupos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        grupos.value = listadosAuxiliares.grupos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    function filtarMotivos(val, update) {
      if (val === '') {
        update(() => {
          motivos.value = listadosAuxiliares.motivos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        motivos.value = listadosAuxiliares.motivos.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      mixin,
      gasto,
      cantones,
      grupos,
      motivos,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasGasto,
      autorizacionesEspeciales,
      filtrarGrupos,
      filtrarCantones,
      filtarMotivos
    }
  },
})
