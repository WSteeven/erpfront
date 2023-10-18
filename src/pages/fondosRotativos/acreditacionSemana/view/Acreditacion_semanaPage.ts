import { defineComponent, reactive, ref, watchEffect } from 'vue'

import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useVuelidate } from '@vuelidate/core'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoFondoController } from 'pages/fondosRotativos/tipoFondo/infrestructure/TipoFonfoController'
import { AcreditacionSemana } from '../domain/AcreditacionSemana'
import { AcreditacionSemanaController } from '../infrestructure/AcreditacionSemanaController'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { ConfiguracionColumnasAcreditacionSemana } from '../domain/ConfiguracionColumnasAcreditacionSemana'
import { useFondoRotativoStore } from 'stores/fondo_rotativo'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { accionesTabla, maskFecha } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useAcreditacionesStore } from 'stores/acreditaciones'

export default defineComponent({
  components: { TabLayout, EssentialTable },
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

    const {
      entidad: fondo_rotativo_contabilidad,
      disabled,
      accion,
      listadosAuxiliares,
      listado,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } =
      mixin.useComportamiento()

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
        acreditacionesStore.idAcreditacion = entidad.id
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
      watchEffect,
      listado,
      botonVerModalGasto,
      accionesTabla,
    }
  },
})
