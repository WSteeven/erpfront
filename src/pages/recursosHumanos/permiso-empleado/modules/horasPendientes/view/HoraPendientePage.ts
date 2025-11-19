import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { HoraPendienteController } from 'recursosHumanos/permiso-empleado/modules/horasPendientes/infraestructure/HoraPendienteController'
import { tabOptionsProveedoresInternacionales } from 'config/utils_compras_proveedores'
import { configuracionColumnasHorasPendientes } from 'recursosHumanos/permiso-empleado/modules/horasPendientes/domain/configuracionColumnasHorasPendientes'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export default defineComponent({
  components: {
    TabLayoutFilterTabs2
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Empleado,
      new HoraPendienteController()
    )
    const { entidad: empleado } = mixin.useReferencias()
    const { filtrar } = mixin.useComportamiento()
    const {} = mixin.useHooks()
    const { confirmar,  notificarCorrecto, prompt } =
      useNotificaciones()
    const cargando = new StatusEssentialLoading()
    const currentTab = ref('1')

    const filtrarListado = async (tab: string) => {
      currentTab.value = tab
      await filtrar({ descontado: tab })
    }

    async function descontarHorasPendientes(
      empleadoId: number,
      motivo: string
    ) {
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const ruta = axios.getEndpoint(
          endpoints.guardarDescuentoHorasNoRecuperadasEmpleado
        )
        const response: AxiosResponse = await axios.post(ruta, {
          empleado_id: empleadoId,
          motivo: motivo
        })
        console.log(
          `Descontando horas pendientes del empleado ID ${empleadoId} por el motivo: ${motivo}`
        )
        console.log(response)
        if(response.status==200) notificarCorrecto(response.data.mensaje)
      } catch (error) {
        console.error(error)
      } finally {
        cargando.desactivar()
      }
    }

    const btnGenerarDescuento: CustomActionTable = {
      titulo: 'Generar descuento',
      accion: ({ entidad }) => {
        console.log('Diste clic en ', entidad)
        confirmar(
          '¿Está seguro que desea generar el descuento de horas pendientes para este empleado?',
          async () => {
            // Aquí iría la lógica para generar el descuento, por ahora solo mostramos una notificación
            const motivo: CustomActionPrompt = {
              titulo: 'Motivo del descuento',
              mensaje:
                'Por favor, ingrese el motivo del descuento de horas pendientes:',
              placeholder: 'Motivo',
              tipo: 'text',
              requerido: true,
              validacion: val => val?.length > 0,
              accion: async data => {
                // aqui va la logica para descontar
                await descontarHorasPendientes(entidad.id, data)

              }
            }
            prompt(motivo)
          }
        )
      },
      visible: () => true
    }

    return {
      empleado,
      mixin,
      configuracionColumnas: configuracionColumnasHorasPendientes,
      filtrarListado,
      currentTab,
      tabOptions: tabOptionsProveedoresInternacionales,
      btnGenerarDescuento
    }
  }
})
