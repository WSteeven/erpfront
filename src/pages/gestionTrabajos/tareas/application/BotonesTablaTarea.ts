import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { Tarea } from '../domain/Tarea'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export const useBotonesTablaTarea = (mixin: ContenedorSimpleMixin<Tarea>) => {
  const { confirmar, prompt, notificarAdvertencia } = useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()
  const authenticationStore = useAuthenticationStore()

  const btnFinalizarTarea: CustomActionTable = {
    titulo: 'Finalizar tarea',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) => !entidad.finalizado,
    accion: async ({ entidad, posicion }) => {
      if (listado.value[posicion].cantidad_subtareas == 0) return notificarAdvertencia('La tarea debe tener al menos una subtarea para poder finalizarla.')
      const estanFinalizadas = await verificarTodasSubtareasFinalizadas(entidad.id)
      const materialDevuelto = await verificarMaterialTareaDevuelto(entidad.id, authenticationStore.user.id)
      if (!estanFinalizadas) return notificarAdvertencia('La tarea aún tiene subtareas pendientes de FINALIZAR, CANCELAR o REAGENDAR.')
      if (!materialDevuelto) return notificarAdvertencia('La tarea aún tiene materiales pendiente de devolución.')

      if (!entidad.codigo_tarea_cliente) {
        const data: CustomActionPrompt = {
          titulo: 'Finalizar tarea',
          mensaje: 'Para finalizar la tarea ingrese el código de tarea que le otorgó el cliente corporativo.',
          validacion: (val) => !!val,
          accion: (codigoTareaCliente) => {

            const data2: CustomActionPrompt = {
              titulo: 'Novedad',
              mensaje: 'Ingrese alguna novedad en caso de presentarse.',
              accion: (novedad) => {

                confirmar('¿Está seguro de finalizar la tarea?', async () => {
                  await editarParcial(entidad.id, { finalizado: true, novedad: novedad, codigo_tarea_cliente: codigoTareaCliente })
                  eliminarElemento(posicion)
                })
              },
            }

            prompt(data2)

          },
        }

        prompt(data)
      } else {

        const data: CustomActionPrompt = {
          titulo: 'Novedad',
          mensaje: 'Ingrese alguna novedad en caso de presentarse.',
          accion: (novedad) => {

            confirmar('¿Está seguro de finalizar la tarea?', async () => {
              await editarParcial(entidad.id, { finalizado: true, novedad: novedad })
              eliminarElemento(posicion)
            })
          },
        }

        prompt(data)
      }
    }
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }

  async function verificarTodasSubtareasFinalizadas(idTarea: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.verificar_todas_subtareas_finalizadas, { tarea_id: idTarea })
    const response: AxiosResponse = await axios.get(ruta)
    return response.data.estan_finalizadas
  }

  async function verificarMaterialTareaDevuelto(idTarea: number, idEmpleado: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.verificar_material_tarea_devuelto, { tarea_id: idTarea, empleado_id: idEmpleado })
    const response: AxiosResponse = await axios.get(ruta)
    return response.data.materiales_devueltos
  }

  return {
    btnFinalizarTarea,
    verificarTodasSubtareasFinalizadas,
  }
}
