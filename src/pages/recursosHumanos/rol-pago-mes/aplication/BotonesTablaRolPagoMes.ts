import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { RolPagoMes } from '../domain/RolPagoMes'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

export const useBotonesTablaRolPagoMes = (
  mixin: ContenedorSimpleMixin<RolPagoMes>
) => {
  const { confirmar, prompt, notificarAdvertencia } = useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()
  const authenticationStore = useAuthenticationStore()
  const filaFinalizar = {
    id: null,
    novedad: null,
    codigo_tarea_cliente: null,
    finalizado: true,
    posicion: 0,
    imagen_informe: null,
  }

  const btnFinalizarRolPago: CustomActionTable = {
    titulo: 'Finalizar Rol de Pago',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) => !entidad.finalizado,
    accion: async ({ entidad, posicion }) => {
      if (listado.value[posicion].cantidad_subtareas == 0)
        return notificarAdvertencia(
          'La tarea debe tener al menos una subtarea para poder finalizarla.'
        )
      const estanFinalizadas = await verificarTodasSubtareasFinalizadas(
        entidad.id
      )

      if (!estanFinalizadas)
        return notificarAdvertencia(
          'La tarea aún tiene subtareas pendientes de FINALIZAR, CANCELAR o REAGENDAR.'
        )


      filaFinalizar.id = entidad.id
      filaFinalizar.posicion = posicion

      if (!entidad.codigo_tarea_cliente) {
        const data: CustomActionPrompt = {
          titulo: 'Finalizar tarea',
          mensaje:
            'Para finalizar la tarea ingrese el código de tarea que le otorgó el cliente corporativo.',
          validacion: (val) => !!val,
          accion: (codigoRolPagoCliente) => {
            filaFinalizar.codigo_tarea_cliente = codigoRolPagoCliente

            const data2: CustomActionPrompt = {
              titulo: 'Novedad',
              mensaje: 'Ingrese alguna novedad en caso de presentarse.',
              accion: (novedad) => {
                filaFinalizar.novedad = novedad
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

          },
        }

        prompt(data)
      }
    },
  }

  function eliminarElemento(posicion: number): void {
    if (posicion >= 0) listado.value.splice(posicion, 1)
  }

  async function verificarTodasSubtareasFinalizadas(idRolPago: number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(
      endpoints.verificar_todas_subtareas_finalizadas,
      { tarea_id: idRolPago }
    )
    const response: AxiosResponse = await axios.get(ruta)
    return response.data.estan_finalizadas
  }

  return {
    btnFinalizarRolPago,
  }
}
