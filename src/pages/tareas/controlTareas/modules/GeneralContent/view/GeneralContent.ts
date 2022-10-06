// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { useOrquestadorSelectorClientes } from '../application/OrquestadorSelectorClientes'
import { provincias, ciudades, acciones } from 'config/utils'
import { defineComponent, watchEffect } from 'vue'
import { useTareaStore } from 'stores/tarea'
//import { GuardableRepository } from 'shared/controller/infraestructure/GuardableRepository'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'
import { endpoints } from 'config/api'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import flatPickr from 'vue-flatpickr-component';
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
  },
  components: {
    EssentialSelectableTable,
    ButtonSubmits,
    flatPickr,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup(props) {
    const tareaStore = useTareaStore()
    const tarea = tareaStore.tarea

    const { guardar, editar, eliminar, reestablecer, setValidador } =
      props.mixin.useComportamiento()

    const { onGuardado, onReestablecer } = props.mixin.useHooks()

    const {
      refListadoSeleccionable: refListadoSeleccionableClientes,
      criterioBusqueda: criterioBusquedaCliente,
      listado: listadoClientes,
      listar: listarClientes,
      limpiar: limpiarCliente,
      seleccionar: seleccionarCliente,
    } = useOrquestadorSelectorClientes(tarea, 'clientes')

    watchEffect(() => {
      if (tarea.id && tarea.cliente) {
        seleccionarCliente(tarea.cliente)
      }
    })

    /* async function guardar() {

    } */
    const rules = {
      cliente: { required },
      detalle: { required },
      solicitante: { required },
    }

    const v$ = useVuelidate(rules, tarea)
    setValidador(v$.value)

    /* onGuardado(() => {
      console.log('guardado')
      console.log(tarea)
      tareaStore.tarea = tarea
    }) */

    // onReestablecer(() => )

    /* function reestablecer() {
      tareaStore.tarea.hydrate(new Tarea())
      tareaStore.accion = acciones.nuevo
      limpiarCliente()
    } */

    const modalesTarea = new ComportamientoModalesTarea()

    return {
      tarea,
      provincias,
      ciudades,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      modalesTarea,
      // Selector
      refListadoSeleccionableClientes,
      criterioBusquedaCliente,
      listadoClientes,
      listarClientes,
      limpiarCliente,
      seleccionarCliente,
      configuracionColumnasClientes,
    }
  },
})
