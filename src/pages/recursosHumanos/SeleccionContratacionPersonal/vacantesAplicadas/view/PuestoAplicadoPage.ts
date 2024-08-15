// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuestoTrabajo'
import relativeTime from 'dayjs/plugin/relativeTime';
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import es from 'dayjs/locale/es';

// Componentes
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoPuestoTrabajoController } from '../infraestructure/TipoPuestoTrabajoController'
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo'
import { getShortDescription, removeAccents } from 'shared/utils'
import { PostulacionController } from '../../postulacionVacante/infraestructure/PostulacionController'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'
import { tipoAutenticacion } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'
import dayjs from 'dayjs'
import { useVacanteStore } from 'stores/recursosHumanos/seleccionContratacion/vacante';
import { ComportamientoModalesVacanteDisponible } from '../../vacantesDisponibles/application/ComportamientoModalesVacanteDisponible';

export default defineComponent({
  components: { BasicContainer, ModalEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(TipoPuestoTrabajo, new TipoPuestoTrabajoController())
    const { entidad: tipo_puesto_trabajo, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()
    const vacanteStore = useVacanteStore()
    const modales = new ComportamientoModalesVacanteDisponible()
    let store
    const postulaciones = ref()
    dayjs.extend(relativeTime)
    dayjs.locale(es)


    cargarVista(async () => {
      if (autenticado) {
        switch (tipoAuth) {
          case tipoAutenticacion.empleado:
            store = useAuthenticationStore()
            break
          case tipoAutenticacion.usuario_externo:
            store = useAuthenticationExternalStore()
            break
          default:
            console.log('El usuario no está autenticado')
        }
      }

      await obtenerListados({
        postulaciones: { controller: new PostulacionController(), params: { user_id: store.user.id } }
      })

      postulaciones.value = listadosAuxiliares.postulaciones
    })



    //Reglas de validacion
    const reglas = {
      nombre: { required },
    }

    const v$ = useVuelidate(reglas, tipo_puesto_trabajo)
    setValidador(v$.value)


    async function visualizarVacante(id: number) {
      vacanteStore.idVacante = id
      modales.abrirModalEntidad('VisualizarVacantePage')
    }


    return {
      removeAccents,
      mixin,
      tipo_puesto_trabajo,
      vacantesPostuladas: postulaciones,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTipoPuestoTrabajo,
      dayjs,
      modales,

      //funciones
      getShortDescription,
      visualizarVacante,

    }
  },
})
