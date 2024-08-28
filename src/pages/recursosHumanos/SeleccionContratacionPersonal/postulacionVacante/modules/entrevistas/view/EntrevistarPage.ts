import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { defineComponent, onMounted, ref } from "vue";
import { Entrevista } from "../domain/Entrevista";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { maskFechaHora, numDiaSemana } from "config/utils";
import { format } from "@formkit/tempo";
import { EntrevistaController } from "../infraestructure/EntrevistaController";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";
import { useNotificaciones } from "shared/notificaciones";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { usePostulacionStore } from "stores/recursosHumanos/seleccionContratacion/postulacion";

export default defineComponent({
  components: {},
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Entrevista>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Entrevista, new EntrevistaController())
    const { entidad: entrevista, disabled } = mixin.useReferencias()
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    const postulacionStore = usePostulacionStore()

    const cargando = new StatusEssentialLoading()

    const reglas = {
      fecha_hora: { required },
      duracion: { required },
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
            emit('guardado', { formulario: 'EntrevistarPage', modelo: response.data.modelo })
          })
        } catch (error: any) {
          notificarAdvertencia(error)
        } finally {
          cargando.desactivar()
        }
      }
    }
    function cancelar() {
      emit('cerrar-modal', false)
    }
    return {
      v$,
      entrevista, disabled,
      mask: "YYYY-MM-DD HH:mm",

      optionsFecha,
      hourOptions: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      minuteOptions: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],

      // functions
      agendar, cancelar,
    }
  }
})
