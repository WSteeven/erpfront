// Dependencias
import { configuracionColumnasTipoPuestoTrabajo } from '../domain/configuracionColumnasTipoPuestoTrabajo'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, onMounted } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoPuestoTrabajoController } from '../infraestructure/TipoPuestoTrabajoController'
import { TipoPuestoTrabajo } from '../domain/TipoPuestoTrabajo'
import { isAxiosError, notificarMensajesError, removeAccents } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { LoginPostulanteController } from '../../login-postulante/infraestructure/LoginPostulanteController'

export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoPuestoTrabajo,
      new TipoPuestoTrabajoController()
    )
    const { entidad: tipo_puesto_trabajo, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const cargando = new StatusEssentialLoading()
        const loginController = new LoginPostulanteController()

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

    return {
      removeAccents,
      mixin,
      tipo_puesto_trabajo,
      puestos_trabajos,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasTipoPuestoTrabajo,
    }
  },
})
