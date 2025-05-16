// Dependencias
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { configuracionColumnasEmpleadoDesignado } from '../domain/configuracionColumnasEmpleadoDesignado'
import { useOrquestadorSelectorEmpleadosZona } from '../application/useOrquestadorSelectorEmpleadosZona'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { accionesTabla } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { iconos } from 'config/iconos'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import CoordenadasInput from 'components/inputs/CoordenadasInput.vue'

// Logica y controladores
import { configuracionColumnasZona } from '../domain/configuracionColumnasZona'
import { ZonaController } from '../infraestructure/ZonaController'
import { Zona } from '../domain/Zona'

export default defineComponent({
  components: { CoordenadasInput, TabLayout, EssentialTable, EssentialSelectableTable },
  setup() {
    /**********
     * Stores
     **********/
    const notificacionStore = useNotificacionStore()
    notificacionStore.setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(Zona, new ZonaController())
    const { entidad: zona, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onBeforeModificar } = mixin.useHooks()

    /*************
     * Variables
     *************/
    const { confirmar } = useNotificaciones()

    /************
     * Funciones
     ************/
    const extraerIdsEmpleados = () => zona.empleados_asignados_ids = zona.empleados_asignados.map(x => x.id)

    /***************
     * Orquestador
     ***************/
    const {
      refListadoSeleccionable,
      criterioBusqueda,
      listado,
      listar,
      seleccionar,
    } = useOrquestadorSelectorEmpleadosZona(zona, 'empleados')

    /*********
     * Reglas
     *********/
    const rules = {
      nombre: { required },
      descripcion: { required },
      direccion: { required },
    }

    // Inicializamos Vuelidate
    const v$ = useVuelidate(rules, zona)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onBeforeGuardar(() => extraerIdsEmpleados())
    onBeforeModificar(() => extraerIdsEmpleados())

    return {
      v$,
      mixin,
      zona,
      disabled,
      configuracionColumnasZona,
      configuracionColumnasEmpleadosLite,
      ccEmpleadoDesignado: [...configuracionColumnasEmpleadoDesignado, accionesTabla],
      btnEliminarEmpleadoDesignado: ({ posicion }) => confirmar('Esta operación es irreversible. ¿Desea continuar?', () => zona.empleados_asignados.splice(posicion, 1)),
      iconos,
      // Orquestador
      refListadoSeleccionable,
      criterioBusqueda,
      listado,
      listar,
      seleccionar,
    }
  },
})
