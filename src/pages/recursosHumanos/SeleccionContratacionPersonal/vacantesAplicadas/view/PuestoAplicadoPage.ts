// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuestoTrabajo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoPuestoTrabajoController } from '../infraestructure/TipoPuestoTrabajoController'
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo'
import { removeAccents } from 'shared/utils'
import BasicContainer from 'shared/contenedor/modules/basic/view/BasicContainer.vue'
import { PostulacionController } from '../../postulacionVacante/infraestructure/PostulacionController'
import { userIsAuthenticated } from 'shared/helpers/verifyAuthenticatedUser'
import { tipoAutenticacion } from 'config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useAuthenticationExternalStore } from 'stores/authenticationExternal'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: { BasicContainer },
  setup() {
    const mixin = new ContenedorSimpleMixin(TipoPuestoTrabajo,new TipoPuestoTrabajoController())
    const { entidad: tipo_puesto_trabajo, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    const { autenticado, tipoAutenticacion: tipoAuth } = userIsAuthenticated()
    let store
    const postulaciones = ref()
    const $q = useQuasar()


    cargarVista(async()=>{
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
        postulaciones: {controller: new PostulacionController(), params:{user_id:store.user.id}}
      })

      postulaciones.value = listadosAuxiliares.postulaciones
    })



    const puestos_trabajos = [
      {
        id:1,
        nombre: 'Puesto 1',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 10,
        tiempo_caducidad: 'hace 1 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia:'https://cdn.quasar.dev/img/parallax2.jpg'
      },
      {
        id:2,
        nombre: 'Puesto 2',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 8,
        tiempo_caducidad: 'hace 3 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia:'https://cdn.quasar.dev/img/parallax2.jpg'
      },{
        id:3,
        nombre: 'Puesto 3',
        descripcion_vacante:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        numero_postulantes: 11,
        tiempo_caducidad: 'hace 8 día',
        tipo_empleo: 'Tiempo Completo',
        imagen_referencia:'https://cdn.quasar.dev/img/parallax2.jpg'
      },
    ]
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
      puestos_trabajos: postulaciones,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTipoPuestoTrabajo,

      //funciones
      getShortDescription,
      
    }
  },
})
