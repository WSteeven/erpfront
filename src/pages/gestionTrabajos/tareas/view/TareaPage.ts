// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { configuracionColumnasTareas } from '../domain/configuracionColumnasTareas'
import { computed, defineComponent, reactive, Ref, ref, watch, watchEffect } from 'vue'
import { acciones, rolesSistema, destinosTareas } from 'config/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'
import { mediosNotificacion } from 'config/trabajo.utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ClienteFinalController } from 'clientesFinales/infraestructure/ClienteFinalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'tiposTareas/infraestructure/TipoTrabajoController'
import { ProvinciaController } from 'sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProyectoController } from 'proyectos/infraestructure/ProyectoController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { ClienteFinal } from 'clientesFinales/domain/ClienteFinal'
import { TipoTrabajo } from 'tiposTareas/domain/TipoTrabajo'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { TareaController } from '../infraestructure/TareaController'
import { Tarea } from '../domain/Tarea'

export default defineComponent({
  components: {
    TabLayout,
    EssentialSelectableTable,
    LabelAbrirModal,
    ModalesEntidad,
  },
  setup(props) {
    /*********
     * Stores
     *********/
    const tareaStore = useTareaStore()

    /*******
     * Mixin
     *********/
    const mixin = new ContenedorSimpleMixin(Tarea, new TareaController())
    const { entidad: tarea, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
        proyectos: new ProyectoController(),
        supervisores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador },
        },
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        tiposTrabajos: {
          controller: new TipoTrabajoController(),
          params: { cliente: tareaStore.tarea.cliente ?? tareaStore.idCliente }
        },
      })

      clientes.value = listadosAuxiliares.clientes
      supervisores.value = listadosAuxiliares.supervisores
      coordinadores.value = listadosAuxiliares.coordinadores
      proyectos.value = listadosAuxiliares.proyectos
      provincias.value = listadosAuxiliares.provincias
      cantones.value = listadosAuxiliares.cantones
    })

    const paraProyecto = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => tarea.para_cliente_proyecto === destinosTareas.paraClienteFinal)

    /*************
    * Validaciones
    **************/
    const reglas = {
      cliente: { requiredIfCliente: requiredIf(() => paraClienteFinal.value) },
      titulo: { required },
      codigo_tarea_cliente: { required },
      proyecto: { required: requiredIf(() => paraProyecto.value) },
    }

    const v$ = useVuelidate(reglas, tarea)
    setValidador(v$.value)

    /*********
    * Filtros
    **********/
    // - Filtro clientes corporativos
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

    // - Filtro tipos de clientes finales
    const clientesFinales = ref()
    const clientesFinalesSource = ref()
    function filtrarClientesFinales(val, update) {
      if (val === '') {
        update(() => {
          clientesFinales.value = clientesFinalesSource.value
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientesFinales.value = clientesFinalesSource.value.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro supervisores
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

    // - Filtro coordinadores
    const coordinadores = ref()
    function filtrarCoordinadores(val, update) {
      if (val === '') {
        update(() => {
          coordinadores.value = listadosAuxiliares.coordinadores
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        coordinadores.value = listadosAuxiliares.coordinadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro provincias
    const provincias = ref()
    function filtrarProvincias(val, update) {
      if (val === '') {
        update(() => {
          provincias.value = listadosAuxiliares.provincias
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        provincias.value = listadosAuxiliares.provincias.filter(
          (v) => v.provincia.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro cantones
    const cantones = ref([])
    function filtrarCantones(val, update) {
      if (val === '') {
        update(() => {
          cantones.value = listadosAuxiliares.cantones
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        cantones.value = listadosAuxiliares.cantones.filter(
          (v) => v.canton.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro proyectos
    const proyectos = ref([])
    function filtrarProyectos(val, update) {
      if (val === '') {
        update(() => {
          proyectos.value = listadosAuxiliares.proyectos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        proyectos.value = listadosAuxiliares.proyectos.filter(
          (v) => v.proyectos.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    // - Filtro tipos de trabajos
    const tiposTrabajos: Ref<TipoTrabajo[]> = ref([])
    function filtrarTiposTrabajos(val, update) {
      if (val === '') {
        update(() => {
          tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        tiposTrabajos.value = listadosAuxiliares.tiposTrabajos.filter(
          (v) => v.descripcion.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /************
    * Funciones
    ************/
    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
    }

    /************
    * Observers
    ************/
    const controller = new ClienteFinalController()

    watchEffect(async () => {
      if (tarea.cliente) {
        clientesFinalesSource.value = (await controller.listar({ cliente: tarea.cliente })).result
        clientesFinales.value = clientesFinalesSource.value
      }
    })

    watchEffect(async () => {
      if (tarea.cliente_final) {
        const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
      }
    })

    /* watch(computed(() => tarea.para_cliente_proyecto), (paraClienteProyecto) => {
      reestablecer()
      tarea.para_cliente_proyecto = paraClienteProyecto
    }) */

    // Informacion de cliente final
    const clienteFinal = reactive(new ClienteFinal())

    async function setCliente() {
      if (tarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(tarea.proyecto)
        tarea.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    const modales = new ComportamientoModalesTarea()

    /*********
     * Hooks
     *********/
    onReestablecer(() => {
      clienteFinal.hydrate(new ClienteFinal())
      clientesFinales.value = []
      clientesFinalesSource.value = []
    })

    return {
      clientesFinalesSource,
      v$,
      tarea,
      accion,
      disabled,
      destinosTareas,
      provincias,
      cantones,
      tiposTrabajos,
      guardar,
      editar,
      eliminar,
      tareaStore,
      reestablecer,
      clientes,
      filtrarClientes,
      clientesFinales,
      filtrarClientesFinales,
      filtrarProvincias,
      filtrarCantones,
      filtrarSupervisores,
      filtrarProyectos,
      filtrarTiposTrabajos,
      obtenerClienteFinal,
      supervisores,
      coordinadores,
      filtrarCoordinadores,
      proyectos,
      clienteFinal,
      paraProyecto,
      paraClienteFinal,
      listadosAuxiliares,
      establecerCliente,
      configuracionColumnasClientes,
      setCliente,
      modales,
      mostrarLabelModal,
      configuracionColumnasTareas,
      mixin,
      mediosNotificacion,
    }
  },
})
