// import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { Tarea } from '../domain/Tarea'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { ref } from 'vue'
import { clientes } from 'config/clientes'

export const useBotonesTablaTarea = (mixin: ContenedorSimpleMixin<Tarea>) => {
  const { confirmar, prompt, notificarAdvertencia } = useNotificaciones()
  const { listado } = mixin.useReferencias()
  const { editarParcial } = mixin.useComportamiento()
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
  const entidadTarea = ref()

  const btnFinalizarTarea: CustomActionTable = {
    titulo: 'Finalizar tarea',
    icono: 'bi-check-circle-fill',
    color: 'positive',
    visible: ({ entidad }) => !entidad.finalizado,
    accion: async ({ entidad, posicion }) => {
      if (listado.value[posicion].cantidad_subtareas == 0) return notificarAdvertencia('La tarea debe tener al menos una subtarea para poder finalizarla.')
      const estanFinalizadas = await verificarTodasSubtareasFinalizadas(entidad.id)
      // const materialDevuelto = await verificarMaterialTareaDevuelto(entidad.id, authenticationStore.user.id)
      if (!estanFinalizadas) return notificarAdvertencia('La tarea aún tiene subtareas pendientes de FINALIZAR, CANCELAR o REAGENDAR.')
      // if (!materialDevuelto) return notificarAdvertencia('La tarea aún tiene materiales pendiente de devolución.')

      filaFinalizar.id = entidad.id
      filaFinalizar.posicion = posicion
      entidadTarea.value = entidad

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

                if (entidad.cliente_id === clientes.NEDETEL) mostrarSolicitarImagen.value = true
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

            if (entidad.cliente_id === clientes.NEDETEL) mostrarSolicitarImagen.value = true
            else imagenSubida()
          },
        }

        prompt(data)
      }
    }
  }

  // function notificarTransferenciaMaterialTareaAStock(accion: () => void) {
  //   confirmar('Los materiales serán transferidos automáticamente al stock personal de cada empleado responsable. ¿Desea continuar?', async () => {
  //     // accion()
  //   })
  // }

  const btnVerImagenInforme: CustomActionTable = {
    titulo: 'Ver imagen informe',
    icono: 'bi-image-fill',
    color: 'secondary',
    visible: ({ entidad }) => !!entidad.imagen_informe,
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

  // Funcion que finaliza la tarea ya sea directamente o luego de subir la imagen solicitada
  function imagenSubida(imagen?) {

    const mensaje = entidadTarea.value.cliente_id === clientes.NEDETEL ? 'Los materiales serán transferidos automáticamente al stock personal de cada empleado responsable. ¿Desea finalizar?' : '¿Desea finalizar?'
    confirmar(mensaje, async () => {
      const posicion = filaFinalizar.posicion
      const id = filaFinalizar.id

      filaFinalizar.imagen_informe = imagen

      if (!imagen) delete (filaFinalizar as any).imagen_informe
      delete (filaFinalizar as any).id
      delete (filaFinalizar as any).posicion


      if (id) editarParcial(id, filaFinalizar).then(() => eliminarElemento(posicion))
    })
  }

  return {
    refVisorImagen,
    btnFinalizarTarea,
    mostrarSolicitarImagen,
    imagenSubida,
    btnVerImagenInforme,
  }
}
