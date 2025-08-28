import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { defineComponent, onMounted } from 'vue'
import { Entrevista } from '../domain/Entrevista'
import { required, requiredIf } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { acciones, numDiaSemana } from 'config/utils'
import { format } from '@formkit/tempo'
import { EntrevistaController } from '../infraestructure/EntrevistaController'
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

export default defineComponent({
  components: { ButtonSubmits, ErrorComponent, OptionGroupComponent },
  props: {},
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Entrevista,
      new EntrevistaController()
    )
    const {
      entidad: entrevista,
      disabled,
      accion,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, guardar, editar, reestablecer } =
      mixin.useComportamiento()
    const { onGuardado, onModificado, onReestablecer } = mixin.useHooks()

    const postulacionStore = usePostulacionStore()
    const direccionDefault =
      'Machala - El Oro - Ecuador. Napoleón Mera y 8.ª Norte, portón plomo (a la vuelta de mueblería/carpintería Daquilema).'

    const { cantones, filtrarCantones } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cantones: new CantonController()
      })

      cantones.value = listadosAuxiliares.cantones
    })
    const reglas = {
      fecha_hora: { required },
      duracion: { required },
      link: { required: requiredIf(() => !entrevista.presencial) },
      direccion: { required: requiredIf(() => entrevista.presencial) },
      nueva_fecha_hora: { required: requiredIf(() => entrevista.reagendada) }
    }
    const v$ = useVuelidate(reglas, entrevista)
    setValidador(v$.value)

    function optionsFecha(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')
      return (
        date >= currentDateString &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }

    onMounted(() => {
      accion.value = postulacionStore.accionEntrevista
      entrevista.postulacion_id = postulacionStore.idPostulacion
      entrevista.duracion = 30
      entrevista.canton = 53 //canton machala por defecto
      entrevista.direccion = direccionDefault
      obtenerEntrevista(postulacionStore.idPostulacion)
    })

    /***************************************************************************
     * HOOKS
     ***************************************************************************/
    onGuardado((_, response) => {
      console.log(response_data)
      emit('cerrar-modal', false)
      emit('guardado', {
        formulario: 'EntrevistarPage',
        modelo: response.modelo
      })
    })
    onModificado((_, response) => {
      emit('cerrar-modal', false)
      emit('guardado', {
        formulario: 'EntrevistarPage',
        modelo: response.modelo
      })
    })
    onReestablecer(() => {
      emit('cerrar-modal', false)
    })

    /***************************************************************************
     * FUNCIONES
     ***************************************************************************/
    async function obtenerEntrevista(postulacion_id: number) {
      const { result } = await new EntrevistaController().consultar(
        postulacion_id
      )
      console.log(result)
      if (result) {
        entrevista.hydrate(result)
      } else {
        accion.value = acciones.consultar
      }
    }

    return {
      v$,
      entrevista,
      disabled,
      mask: 'YYYY-MM-DD HH:mm',

      accion,
      acciones,
      guardar,
      editar,
      reestablecer,

      optionsFecha,
      hourOptions: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
      options: [
        {
          label: 'Presencial',
          value: true
        },
        {
          label: 'Virtual',
          value: false
        }
      ],
      //listados
      cantones,
      filtrarCantones

    }
  }
})
