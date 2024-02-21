// Dependencias
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, computed, Ref, reactive } from 'vue'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { imprimirArchivo, notificarErrores, removeAccents } from 'shared/utils'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { ConceptoIngreso } from 'pages/recursosHumanos/concepto_ingreso/domain/ConceptoIngreso'
import { useAuthenticationStore } from 'stores/authentication'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
import { BonoMensualCumplimiento } from '../domain/BonoMensualCumplimiento'
import axios, { AxiosResponse } from 'axios'
import { BonoMensualCumplimientoController } from '../infrestucture/BonoMensualCumplimientoController'

import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'

import { configuracionColumnasBonoMensualCumplimiento } from '../domain/configuracionColumnasBonoMensualCumplimiento'
import { tabOptionsBonosMensuales } from 'config/ventas.utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2,
    ModalesEntidad,
    SelectorImagen,
    EssentialTable,
    EssentialTableTabs,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      BonoMensualCumplimiento,
      new BonoMensualCumplimientoController()
    )
    const { entidad: bono_mensual_cumplimiento, accion, disabled, listado } = mixin.useReferencias()
    const { setValidador, listar } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()
    const { confirmar, notificarCorrecto, notificarAdvertencia, notificarError } = useNotificaciones()


    useCargandoStore().setQuasar(useQuasar())

    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    const is_month = ref(false)
    const tabDefecto = ref('0')

    const reglas = {
      mes: {
        required: true,
      },
    }
    const v$ = useVuelidate(reglas, bono_mensual_cumplimiento)
    setValidador(v$.value)

    onGuardado(() => {
      console.log('guardado');

      listar({})
    })
    /**************************************************************
     * Funciones
     **************************************************************/
    function filtrarBonos(tab: string) {
      tabDefecto.value = tab
      listar({ pagada: tab })
    }
    /**Verifica si es un mes */
    function checkValue(val, reason, details) {
      is_month.value = reason === 'month' ? false : true
    }
    async function marcarPagado(id: number) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(endpoints.bono_mensual_cumplimiento) + '/marcar-pagada/' + id
        const response: AxiosResponse = await axios.post(ruta)
        if (response.status === 200) notificarCorrecto('Primer mes pagado correctamente')
        return {
          response,
          result: response.data.modelo
        }
      } catch (err) {
        await notificarErrores(err)
      }
      finally {
        cargando.desactivar()
      }
    }
    /**************************************************
     * Botones de tabla
     *************************************************/
    const btnMarcarPagada: CustomActionTable = {
      titulo: 'Marcar Pagada',
      icono: 'fas fa-dollar-sign',
      color: 'primary',
      tooltip: 'Marcar como pagado',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Estás seguro de marcar este bono como pagado?', async () => {
          const response = await marcarPagado(entidad.id)
          // console.log(response)
          listado.value.splice(posicion, 1)
        })
      }, visible: ({ entidad }) => !entidad.pagada
    }
    return {
      removeAccents,
      mixin,
      v$,
      is_month, tabDefecto,
      checkValue,
      bono_mensual_cumplimiento,
      accion,
      disabled,
      maskFecha,
      configuracionColumnas: configuracionColumnasBonoMensualCumplimiento,
      filtrarBonos,
      tabOptionsBonosMensuales,

      btnMarcarPagada,

    }
  },
})
