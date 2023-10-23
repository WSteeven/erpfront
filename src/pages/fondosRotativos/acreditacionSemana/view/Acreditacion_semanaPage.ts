import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AcreditacionSemana } from '../domain/AcreditacionSemana'
import { AcreditacionSemanaController } from '../infrestructure/AcreditacionSemanaController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ConfiguracionColumnasAcreditacionSemana } from '../domain/ConfiguracionColumnasAcreditacionSemana'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla, maskFecha } from 'config/utils'
import { useAcreditacionesStore } from 'stores/acreditaciones'
import { ComportamientoModalesAcreditacionSemanas } from '../application/ComportamientoModalesAcreditacionSemanas'
import { ValorAcreditar } from 'pages/fondosRotativos/valorAcreditar/domain/ValorAcreditar'
import { ValorAcreditarController } from 'pages/fondosRotativos/valorAcreditar/infrestructure/ValorAcreditarController'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'


export default defineComponent({
  components: { TabLayout, EssentialTable ,ModalesEntidad},
  setup() {
    /*********
     * Stores
     *********/
    useNotificacionStore().setQuasar(useQuasar())
    const acreditacionesStore = useAcreditacionesStore()
    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      AcreditacionSemana,
      new AcreditacionSemanaController()
    )
    const mixinAcreditacion = new ContenedorSimpleMixin(
      ValorAcreditar,
      new ValorAcreditarController()
    )
    const { listado: roles_empleados } = mixinAcreditacion.useReferencias()

    const {
      entidad: fondo_rotativo_contabilidad,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()
    /************
     * Modales
     ************/
    const modalesAcreditacionSemana = new ComportamientoModalesAcreditacionSemanas()

    /*************
     * Validaciones
     **************/
    const reglas = {
      semana: {
        required: true,
      },
    }
    const opened = ref(false)
    const v$ = useVuelidate(reglas, fondo_rotativo_contabilidad)
    setValidador(v$.value)

    cargarVista(async () => {
      listado.value = (await new AcreditacionSemanaController().listar()).result
    })

    /**Modales */

    const botonVerModalGasto: CustomActionTable = {
      titulo: 'Consultar',
      icono: 'bi-eye',
      color: 'indigo',
      accion: ({ entidad }) => {
        acreditacionesStore.idAcreditacionSeleccionada = entidad.id
        modalesAcreditacionSemana.abrirModalEntidad('ValorAcreditarPage')
      },
    }
    const botonAcreditar: CustomActionTable = {
      titulo: 'Acreditar',
      icono: 'bi-check-all',
      color: 'primary',
      accion: ({ entidad }) => {
        console.log()
      },
    }


    return {
      mixin,
      fondo_rotativo_contabilidad,
      ConfiguracionColumnasAcreditacionSemana,
      disabled,
      accion,
      v$,
      maskFecha,
      opened,
      modalesAcreditacionSemana,
      watchEffect,
      listado,
      botonVerModalGasto,
      botonAcreditar,
      accionesTabla,
    }
  },
})
