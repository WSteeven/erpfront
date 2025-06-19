import { defineComponent } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasGastosRechazados } from 'pages/fondosRotativos/gasto/modules/gastosRechazadosSistema/domain/configuracionColumnasGastosRechazados'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { GastoController } from 'pages/fondosRotativos/gasto/infrestructure/GastoController'
import { GastoRechazado } from 'pages/fondosRotativos/gasto/modules/gastosRechazadosSistema/domain/GastoRechazado'
import { accionesTabla } from 'config/utils'
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export default defineComponent({
  components: { EssentialTableTabs, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      GastoRechazado,
      new GastoController()
    )
    const { listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()

    const store = useAuthenticationStore()
    const cargando = new StatusEssentialLoading()
    const {
      confirmar,
      notificarCorrecto,
      notificarError,
      prompt
    } = useNotificaciones()

    async function actualizarListado() {
      await listar({
        estado: 2,
        'detalle_estado[like]': '%RECHAZADO POR EL SISTEMA%'
      })
    }

    async function activarGastoRechazado(id: number, data: string) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url =
          apiConfig.URL_BASE +
          '/' +
          axios.getEndpoint(endpoints.activar_gasto_rechazado) +
          '/' +
          id
        const response: AxiosResponse = await axios.put(url, { motivo: data })
        if (response.status === 200) {
            notificarCorrecto(response.data.mensaje)
            await actualizarListado()
        }
      } catch (e) {
        notificarError('No se pudo reactivar el gasto')
      } finally {
        cargando.desactivar()
      }
    }

    actualizarListado()

    const btnReactivarGasto: CustomActionTable<GastoRechazado> = {
      titulo: 'Reactivar',
      icono: 'bi-check-circle-fill',
      color: 'positive',
      accion: async ({ entidad }) => {
        confirmar('¿Está seguro de reactivar el gasto?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Motivo',
            mensaje: 'Ingrese motivo',
            requerido: true,
            validacion: val => !!val,
            accion: async data => {
              await activarGastoRechazado(entidad.id, data)
            }
          }
          prompt(data)
        })
      },
      visible: () => store.esAdministrador
    }

    return {
      listado,
      actualizarListado,
      configuracionColumnas: [
        ...configuracionColumnasGastosRechazados,
        accionesTabla
      ],
      btnReactivarGasto
    }
  }
})
