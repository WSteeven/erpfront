import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { defineComponent, onMounted } from 'vue';
import { Entrevista } from '../domain/Entrevista';
import { required, requiredIf } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';
import { numDiaSemana } from 'config/utils';
import { format } from '@formkit/tempo';
import { EntrevistaController } from '../infraestructure/EntrevistaController';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import { AxiosResponse } from 'axios';
import { useNotificaciones } from 'shared/notificaciones';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { usePostulacionStore } from 'stores/recursosHumanos/seleccionContratacion/postulacion';
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue';
import ErrorComponent from 'components/ErrorComponent.vue';

export default defineComponent({
  components: { ErrorComponent, OptionGroupComponent },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Entrevista,
      new EntrevistaController()
    )
    const {
      entidad: entrevista,
      disabled,
      listadosAuxiliares
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()
    const { confirmar, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()

    const postulacionStore = usePostulacionStore()

    const cargando = new StatusEssentialLoading()

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
      direccion: { required: requiredIf(() => entrevista.presencial) }
    }
    const v$ = useVuelidate(reglas, entrevista)

    function optionsFecha(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')
      return (
        date >= currentDateString &&
        new Date(date).getDay() < numDiaSemana.sabado &&
        new Date(date).getDay() > numDiaSemana.domingo
      )
    }

    onMounted(() => {
      entrevista.postulacion_id = postulacionStore.idPostulacion
      entrevista.duracion = 30
      entrevista.canton = 53 //canton machala por defecto
      entrevista.direccion = direccionDefault
    })

    /***************************************************************************
     * FUNCIONES
     ***************************************************************************/

    async function agendar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          confirmar('¿Está seguro de continuar?', async () => {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.entrevistas)
            const response: AxiosResponse = await axios.post(ruta, entrevista)
            notificarCorrecto(response.data.mensaje)
            emit('cerrar-modal', false)
            emit('guardado', {
              formulario: 'EntrevistarPage',
              modelo: response.data.modelo
            })
          })
        } catch (error: any) {
          notificarAdvertencia(error)
        } finally {
          cargando.desactivar()
          v$.value.$reset()
        }
      }
    }
    function cancelar() {
      emit('cerrar-modal', false)
    }
    return {
      v$,
      entrevista,
      disabled,
      mask: 'YYYY-MM-DD HH:mm',

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
      filtrarCantones,
      // functions
      agendar,
      cancelar
    }
  }
})
