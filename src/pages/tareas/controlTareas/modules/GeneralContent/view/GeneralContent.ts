// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { provincias, ciudades } from 'config/utils'
import { required } from '@vuelidate/validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ContactoController } from 'pages/tareas/contactos/infraestructure/ContactoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { ClienteFinal } from 'pages/tareas/contactos/domain/ClienteFinal'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<any>,
      required: true,
    },
  },
  components: {
    EssentialSelectableTable,
    LabelAbrirModal,
    ButtonSubmits,
    ModalesEntidad,
  },
  setup(props) {
    const tareaStore = useTareaStore()

    const { entidad: tarea, listadosAuxiliares } = props.mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      props.mixin.useComportamiento()


    // const { onGuardado, onReestablecer } = props.mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        clientesFinales: new ContactoController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
        supervisores: {
          controller: new EmpleadoController(),
          params: {},
        }
      })
      clientes.value = listadosAuxiliares.clientes
      clientesFinales.value = listadosAuxiliares.clientesFinales
      supervisores.value = listadosAuxiliares.supervisores
      tarea.hydrate(tareaStore.tarea)
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

    // Filtro clientes principales
    const clientes = ref()
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
    const clientesFinales = ref()
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

    // Filtro supervisores
    const supervisores = ref()
    function filtrarSupervisores(val, update) {
      if (val === '') {
        update(() => {
          supervisores.value = listadosAuxiliares.supervisores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        supervisores.value = listadosAuxiliares.supervisores.filter(
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

    watchEffect(() => {
      if (tarea.cliente_final)
        obtenerClienteFinal(tarea.cliente_final)
      else
        clienteFinal.hydrate(new ClienteFinal())
    })

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
      supervisores,
      filtrarSupervisores,
      clienteFinal,
      listadosAuxiliares,
      // Selector
      configuracionColumnasClientes,
    }
  },
})
