import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { defineComponent, onMounted } from "vue";
import { Examen } from "../domain/Examen";
import { ExamenController } from "../infraestructure/ExamenController";
import { usePostulacionStore } from "stores/recursosHumanos/seleccionContratacion/postulacion";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { CantonController } from "sistema/ciudad/infraestructure/CantonControllerontroller";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import OptionGroupComponent from "components/optionGroup/view/OptionGroupComponent.vue";

export default defineComponent({
  components: { OptionGroupComponent },
  props: {},
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Examen, new ExamenController())
    const { entidad: examen, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, consultar, editar } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    const postulacionStore = usePostulacionStore()
    if (postulacionStore.idPostulacion) {
      examen.id = postulacionStore.idPostulacion
      examen.postulacion_id = postulacionStore.idPostulacion
    }

    const cargando = new StatusEssentialLoading()
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        cantones: new CantonController()
      })

      cantones.value = listadosAuxiliares.cantones
      consultar(examen)
    })
    const reglas = {
      fecha_hora: { required },
      canton: { required },
      indicaciones: { required },
      laboratorio: { required },
      direccion: { required },
      observacion: { required },
    }
    const v$ = useVuelidate(reglas, examen)


    onReestablecer(() => {
      emit('cerrar-modal', false)
      emit('guardado', { formulario: 'ActualizarResultadosCitaMedicaPage' })
    })
    async function actualizar() {
      if (await v$.value.$validate()) {
        await editar(examen)
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
      actualizar, cancelar,
    }
  }
})
