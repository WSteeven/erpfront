// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuestoTrabajo'
import relativeTime from 'dayjs/plugin/relativeTime';
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import es from 'dayjs/locale/es';

// Componentes
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoPuestoTrabajoController } from '../infraestructure/TipoPuestoTrabajoController'
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo'
import { removeAccents } from 'shared/utils'
import { PostulacionController } from '../../postulacionVacante/infraestructure/PostulacionController'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'
import { tipoAutenticacion } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

export default defineComponent({
  components: { BasicContainer },
  setup() {
    const mixin = new ContenedorSimpleMixin(TipoPuestoTrabajo, new TipoPuestoTrabajoController())
    const { entidad: tipo_puesto_trabajo, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()
    let store
    const postulaciones = ref()
    const $q = useQuasar()
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


    // Función para eliminar etiquetas HTML
    function removeHTMLTags(html) {
      // Expresión regular para eliminar etiquetas HTML y reemplazar &nbsp;
      const regex = /<[^>]*>|&nbsp;/g;
      // Reemplazar las etiquetas HTML y &nbsp; por una cadena vacía
      const plainText = html.replace(regex, '\n').trim();
      return plainText;
    }
    function getShortDescription(description: string): string {
      const maxLength = $q.screen.lg ? 300 : 100 // Ajusta este valor según la longitud deseada
      const descripcion_plain_text = removeHTMLTags(description)
      if (descripcion_plain_text.length > maxLength) {
        return descripcion_plain_text.substring(0, maxLength) + '...'
      }
      return descripcion_plain_text
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

      //funciones
      getShortDescription,

    }
  },
})
