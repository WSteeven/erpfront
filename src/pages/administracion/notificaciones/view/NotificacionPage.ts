//Dependencias
import { configuracionColumnasNotificaciones } from '../domain/configuracionColumnasNotificaciones'

//Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { computed, defineComponent } from 'vue'
import { Notificacion } from '../domain/Notificacion'
import { NotificacionController } from '../infraestructure/NotificacionController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificationRealtimeStore } from 'stores/notificationRealtime'
import { useNotificaciones } from 'shared/notificaciones'
import { accionesTabla } from 'config/utils'

//Logica y controladores

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(Notificacion, new NotificacionController())
    const { entidad: notificacion, disabled, accion, listado } = mixin.useReferencias()
    const { listar } = mixin.useComportamiento()
    const { notificarCorrecto } = useNotificaciones()

    /* A function that is defined in the mixin. It is a function that is used to list all the entities. */
    listar()
    const totalNoLeidas = computed(() => listado.value.filter((notificacion: Notificacion) => !notificacion.leida).length)

    const notificacionesPusher = useNotificationRealtimeStore()

    /* A custom action button that will be added to the table. */
    const BotonMarcarLeido: CustomActionTable = {
      titulo: 'Marcar como leído',
      color: 'positive',
      icono: 'bi-check-circle-fill',
      visible: ({ entidad }) => !entidad.leida,
      accion: async ({ entidad, posicion }) => {
        notificacionesPusher.idNotificacion = entidad.id
        const modelo = await notificacionesPusher.marcarLeida()
        if (modelo) {
          notificarCorrecto('Notificación marcada como leída')
          listado.value.splice(posicion, 1, modelo)
        }
      }
    }
    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad)
        listado.value = [...listado.value]
      }
    }

    return {
      mixin, notificacion, disabled, accion, listado,
      configuracionColumnas: configuracionColumnasNotificaciones, accionesTabla,
      BotonMarcarLeido,
      totalNoLeidas,
    }
  }
})
