// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { useOrquestadorSelectorClientes } from '../application/OrquestadorSelectorClientes'
import { provincias, ciudades, acciones } from 'config/utils'
import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { required } from '@vuelidate/validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import flatPickr from 'vue-flatpickr-component'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ContactoController } from 'pages/tareas/contactos/infraestructure/ContactoController'
import { ClienteFinal } from 'pages/tareas/contactos/domain/ClienteFinal'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'

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

    const { entidad: tarea, listadosAuxiliares } = props.mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados } =
      props.mixin.useComportamiento()

    tarea.hydrate(tareaStore.tarea)
    // const { onGuardado, onReestablecer } = props.mixin.useHooks()

    obtenerListados({
      clientes: new ClienteController(),
      clientesFinales: new ContactoController(),
      provincias: new ProvinciaController(),
      cantones: new CantonController(),
    })

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

    const rules = {
      cliente: { required },
      detalle: { required },
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

    // Filtro tipos de trabajos
    const clientes = ref([])
    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // Filtro tipos de clientes finales
    const clientesFinales = ref([])
    function filtrarClientesFinales(val, update) {
      if (val === '') {
        update(() => {
          clientesFinales.value = listadosAuxiliares.clientesFinales
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientesFinales.value = listadosAuxiliares.clientesFinales.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const clienteFinal = reactive(new ClienteFinal())

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ContactoController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    return {
      v$,
      tarea,
      provincias,
      ciudades,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      modalesTarea,
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      obtenerClienteFinal,
      clienteFinal,
      listadosAuxiliares,
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
