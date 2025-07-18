// Dependencias
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { configuracionColumnasVisitante } from '../domain/configuracionColumnasVisitante'
import { VisitanteController } from '../infraestructure/VisitanteController'
import { required } from 'shared/i18n-validators'
import { defineComponent, UnwrapRef } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
// import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import VoiceInput from 'components/inputs/VoiceInput.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Visitante } from '../domain/Visitante'
import { ActividadBitacora } from '../../actividadBitacora/domain/ActividadBitacora'
import { useOrquestadorSelectorEmpleados } from 'pages/seguridad/bitacoras/application/useOrquestadorSelectorEmpleados'

export default defineComponent({
  components: { TabLayout, VoiceInput },
  props: {
    datos: Object as () => UnwrapRef<{ actividadBitacora: ActividadBitacora }>,
  },
  setup(props) {
    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Visitante, new VisitanteController())
    const { entidad: visitante, disabled, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

    /***************
     * Orquestador
     ***************/
    /* const {
      refListadoSeleccionable,
      criterioBusqueda,
      listado,
      listar,
      seleccionar,
    } = useOrquestadorSelectorEmpleados(visitante, 'empleados', 'persona_visitada') */

    /*********
     * Reglas
     *********/
    const rules = {
      nombre_completo: { required },
      identificacion: { required },
      motivo_visita: { required },
      persona_visitada: { required },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, visitante)
    setValidador(v$.value)

    /********
     * Init
     ********/
    visitante.fecha_hora_ingreso = props.datos?.actividadBitacora.fecha_hora_inicio ?? null

    return {
      v$,
      mixin,
      visitante,
      disabled,
      configuracionColumnasVisitante,
      configuracionColumnasEmpleadosLite,
    }
  },
})