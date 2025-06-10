import { likertCalificacionPostulacion } from 'config/seleccionContratacionPersonal.utils';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { defineComponent } from 'vue';
import { Postulacion } from '../../../domain/Postulacion';
import { required } from 'shared/i18n-validators';
import useVuelidate from '@vuelidate/core';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { useNotificaciones } from 'shared/notificaciones';
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository';
import { endpoints } from 'config/api';
import { AxiosResponse } from 'axios';

export default defineComponent({
  components: {},
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Postulacion>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const { entidad: postulacion } = props.mixinModal.useReferencias()
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    const NO_APTO = 'NO CONSIDERAR'
    const cargando = new StatusEssentialLoading()

    const reglas = {
      calificacion: { required },
    }
    const v$ = useVuelidate(reglas, postulacion)

    /***************************************************************************
    * FUNCIONES
    ***************************************************************************/
    async function enviarCalificacion() {
      const axios = AxiosHttpRepository.getInstance()
      const ruta = axios.getEndpoint(endpoints.postulacion_vacante) + '/calificar/' + postulacion.id
      const response: AxiosResponse = await axios.post(ruta, postulacion)
      notificarCorrecto(response.data.mensaje)
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'CalificarCandidatoPage' })
    }
    async function calificar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          // console.log('Diste clic en calificar candidato....', postulacion.calificacion)
          if (postulacion.calificacion === NO_APTO)
            confirmar('Al marcar como NO CONSIDERAR el sistema finalizará el proceso y no podrá cambiar la calificación para este registro ¿Está seguro de continuar?', async () => {
              enviarCalificacion()
            })
          else
            enviarCalificacion()
        } catch (error: any) {
          notificarAdvertencia(error);
        }
        finally {
          cargando.desactivar()
        }
      }
      v$.value.$reset()

    }
    function cancelar() {
      emit('cerrar-modal', false)
    }

    return {
      v$,
      // Your data here
      postulacion,
      opciones: likertCalificacionPostulacion,

      calificar,
      cancelar,

    }
  }
})
