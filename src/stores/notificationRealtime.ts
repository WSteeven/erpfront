import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { acciones } from 'config/utils';
import { Notificacion } from 'pages/administracion/notificaciones/domain/Notificacion';
import { NotificacionController } from 'pages/administracion/notificaciones/infraestructure/NotificacionController';
import { defineStore } from 'pinia';
import Pusher from 'pusher-js';
import { useNotificaciones } from 'shared/notificaciones';
import { reactive, ref } from 'vue';


export const useNotificationRealtimeStore = defineStore('notificaciones', () => {
    //Pusher 
    const pusher = new Pusher(process.env.PUSHER_APP_KEY!, {
        cluster: process.env.PUSHER_APP_CLUSTER,
    });
    //State
    const notificacion = reactive(new Notificacion())
    const notificacionReset = new Notificacion()
    const idNotificacion = ref()
    const listadoNotificaciones = ref([])

    const { notificarAdvertencia } = useNotificaciones()
    const accionNotificacion = acciones.nuevo
    const statusLoading = new StatusEssentialLoading()

    /**
     * Consulta el listado de notificaciones en la base de datos y lo agrega a una variable listadoNotificaciones.
     */
    async function all() {
        const { result } = await new NotificacionController().listar({campos:'id,mensaje'})
        listadoNotificaciones.value = result
    }
    /**
     * If the function all() throws an error, then the function listar() will catch it and execute the
     * code in the catch block, otherwise it will execute the code in the finally block.
     */
    async function listar() {
        try {
            statusLoading.activar()
            all();
        }catch (e) {
            notificarAdvertencia('Ocurrió un error al listar todas las notificaciones')
        }finally{
            statusLoading.desactivar()
        }
    }
    /**
     * Agrega un nuevo notificacion a la base de datos.
     * @param {Notificacion} notificacion 
     */
    function agregar(notificacion:Notificacion){
        listadoNotificaciones.value.unshift(notificacion); 
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
    }

})