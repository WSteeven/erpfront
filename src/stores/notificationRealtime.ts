import { NotificacionController } from 'pages/administracion/notificaciones/infraestructure/NotificacionController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { reactive, Ref, ref } from 'vue'
import { acciones } from 'config/utils'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { defineStore } from 'pinia'
import Pusher from 'pusher-js'


export const useNotificationRealtimeStore = defineStore('notificaciones', () => {
  // Pusher.logToConsole = true

  // Pusher
  const pusher = new Pusher(process.env.PUSHER_APP_KEY || '0df833686e4616dd7444', {
    cluster: process.env.PUSHER_APP_CLUSTER || 'sa1',
  })

  // State
  const notificacion = reactive(new Notificacion())
  const notificacionReset = new Notificacion()
  const idNotificacion = ref()
  const listadoNotificaciones: Ref<Notificacion[]> = ref([])

  const { notificarAdvertencia, notificarCorrecto } = useNotificaciones()
  const accionNotificacion = acciones.nuevo
  const statusLoading = new StatusEssentialLoading()

  /**
   * Consulta el listado de notificaciones en la base de datos y lo agrega a una variable listadoNotificaciones.
   */
  async function all() {
    const { result } = await new NotificacionController().listar({ campos: 'id,mensaje,link,tipo_notificacion,leida,created_at', leida: 0 })
    listadoNotificaciones.value = result
  }

  /**
   * If the function all() throws an error, then the function listar() will catch it and execute the
   * code in the catch block, otherwise it will execute the code in the finally block.
   */
  async function listar() {
    try {
      statusLoading.activar()
      await all()
    } catch (e) {
      notificarAdvertencia('Ocurrió un error al listar todas las notificaciones')
    } finally {
      statusLoading.desactivar()
    }
  }

  /**
   * Agrega un nuevo notificacion a la base de datos.
   * @param {Notificacion} notificacion
   */
  function agregar(notificacion: Notificacion) {
    listadoNotificaciones.value.unshift(notificacion)
  }

  /**
   * Actualiza las notificaciones obtenidas desde la base de datos.
   */
  async function actualizar() {
    await listar()
  }


  async function marcarLeida() {
    const indiceEncontrado = listadoNotificaciones.value.findIndex((v: Notificacion) => v.id === idNotificacion.value)
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.notificaciones) + '/marcar-leida/' + idNotificacion.value
    const response: AxiosResponse = await axios.post(ruta)
    if (response.data.modelo.leida) {
      listadoNotificaciones.value.splice(indiceEncontrado, 1)
    }
    return response.data.modelo
  }

  async function marcarLeidasTodas(empleado_id:number) {
    const axios = AxiosHttpRepository.getInstance()
    const ruta = axios.getEndpoint(endpoints.notificaciones) + '/marcar-leidas-todas/' + empleado_id
    const response: AxiosResponse = await axios.post(ruta)
    if (response.status==200) {
      listadoNotificaciones.value = []
      notificarCorrecto('Todas las notificaciones se han actualizado correctamente')
    }
    return response.data.modelo
  }

  return {
    pusher,
    notificacion,
    notificacionReset,
    idNotificacion,
    listadoNotificaciones,
    accionNotificacion,
    listar,
    agregar,
    actualizar,
    marcarLeida,
    marcarLeidasTodas,
  }
})
