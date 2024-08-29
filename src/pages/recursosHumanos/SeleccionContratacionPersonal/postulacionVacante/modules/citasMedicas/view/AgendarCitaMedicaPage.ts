import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { defineComponent, onMounted } from "vue";
import { Examen } from "../domain/Examen";
import { ExamenController } from "../infraestructure/ExamenController";
import { useNotificaciones } from "shared/notificaciones";
import { usePostulacionStore } from "stores/recursosHumanos/seleccionContratacion/postulacion";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { CantonController } from "sistema/ciudad/infraestructure/CantonControllerontroller";
import { required, requiredIf } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { format } from "@formkit/tempo";
import { numDiaSemana } from "config/utils";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { endpoints } from "config/api";
import { AxiosResponse } from "axios";

export default defineComponent({
  components: {},
  props: {},
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Examen, new ExamenController())
    const { entidad: examen, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, } = mixin.useComportamiento()
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()

    const postulacionStore = usePostulacionStore()

    const cargando = new StatusEssentialLoading()
    const indicacionesDefault = 'Debes llevar tu cédula de identidad y no haber ingerido alimentos durante las últimas 8 horas.'
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cantones: new CantonController()
      })

      cantones.value = listadosAuxiliares.cantones
    })
    const reglas = {
      fecha_hora: { required },
      canton: { required },
      indicaciones: { required },
      laboratorio: { required },
      direccion: { required },
    }
    const v$ = useVuelidate(reglas, examen)

    function optionsFecha(date) {
      const currentDateString = format(new Date(), 'YYYY/MM/DD')
      return date >= currentDateString
    }
    onMounted(() => {
      // Put here all default settings or values
      examen.postulacion_id = postulacionStore.idPostulacion
      examen.indicaciones = indicacionesDefault
    })



    async function guardar() {
      if (await v$.value.$validate()) {
        try {
          cargando.activar()
          confirmar('Se enviarán las indicaciones por correo al candidato. ¿Está seguro de continuar?', async () => {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.examenes_postulantes)
            const response: AxiosResponse = await axios.post(ruta, examen)
            notificarCorrecto(response.data.mensaje)
            emit('cerrar-modal', false)
            emit('guardado', { formulario: 'AgendarCitaMedicaPage', modelo: response.data.modelo })
          })
        } catch (err: any) {
          notificarAdvertencia(err)
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
      examen, v$,
      mask: "YYYY-MM-DD HH:mm",

      // listados
      cantones, filtrarCantones,
      // functions
      guardar, cancelar, optionsFecha,
    }
  }
})
