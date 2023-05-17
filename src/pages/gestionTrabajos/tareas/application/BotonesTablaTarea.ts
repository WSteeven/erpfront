import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { Tarea } from '../domain/Tarea'
import { endpoints } from 'config/api'
import { AxiosError, AxiosResponse } from 'axios'
import { notificarMensajesError } from 'shared/utils'
import { ApiError } from 'shared/error/domain/ApiError'
import { computed, reactive, ref, watch } from 'vue'

export const useBotonesTablaTarea = (mixin: ContenedorSimpleMixin<Tarea>) => {
  const { confirmar, prompt, notificarAdvertencia } = useNotificaciones()
  const notificaciones = useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()
  const authenticationStore = useAuthenticationStore()
  const mostrarSolicitarImagen = ref(false)
  const filaFinalizar = {
    id: null,
    novedad: null,
    codigo_tarea_cliente: null,
    finalizado: true,
    posicion: 0,
    imagen_informe: null,
  }
  const refVisorImagen = ref()

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

      filaFinalizar.id = entidad.id
      filaFinalizar.posicion = posicion

      if (!entidad.codigo_tarea_cliente) {
        const data: CustomActionPrompt = {
          titulo: 'Finalizar tarea',
          mensaje: 'Para finalizar la tarea ingrese el código de tarea que le otorgó el cliente corporativo.',
          validacion: (val) => !!val,
          accion: (codigoTareaCliente) => {

            filaFinalizar.codigo_tarea_cliente = codigoTareaCliente

            const data2: CustomActionPrompt = {
              titulo: 'Novedad',
              mensaje: 'Ingrese alguna novedad en caso de presentarse.',
              accion: (novedad) => {
                filaFinalizar.novedad = novedad

                if (entidad.cliente_id === 3) mostrarSolicitarImagen.value = true
                else imagenSubida()
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
            filaFinalizar.novedad = novedad
            delete (filaFinalizar as any).codigo_tarea_cliente

            if (entidad.cliente_id === 3) mostrarSolicitarImagen.value = true
            else imagenSubida()
          },
        }

        prompt(data)
      }
    }
  }

  const btnVerImagenInforme: CustomActionTable = {
    titulo: 'Ver imagen informe',
    icono: 'bi-image-fill',
    color: 'secondary',
    visible: ({ entidad }) => entidad.imagen_informe,
    accion: async ({ entidad }) => {
      refVisorImagen.value.abrir(entidad.imagen_informe)
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

  function imagenSubida(imagen?) {
    confirmar('¿Está seguro de finalizar la tarea?', async () => {
      const posicion = filaFinalizar.posicion
      const id = filaFinalizar.id

      filaFinalizar.imagen_informe = imagen

      if (!imagen) delete (filaFinalizar as any).imagen_informe
      delete (filaFinalizar as any).id
      delete (filaFinalizar as any).posicion

      if (id) await editarParcial(id, filaFinalizar)
      eliminarElemento(posicion)
    })
  }

  return {
    refVisorImagen,
    btnFinalizarTarea,
    // verificarTodasSubtareasFinalizadas,
    mostrarSolicitarImagen,
    imagenSubida,
    btnVerImagenInforme,
  }
}
