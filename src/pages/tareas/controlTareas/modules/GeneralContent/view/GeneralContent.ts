// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, Ref, ref, watch, watchEffect } from 'vue'
import { acciones, rolesSistema, destinosTareas } from 'config/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import SubtareaPage from 'controlTareas/modules/subtareas/view/SubtareaPage.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ClienteFinalController } from 'pages/tareas/clientesFinales/infraestructure/ClienteFinalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGeneralContent } from '../application/ComportamientoModalesGeneralContent'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProyectoController } from 'pages/tareas/proyectos/infraestructure/ProyectoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { SubtareaController } from '../../subtareas/infraestructure/SubtareaController'
import { ClienteFinal } from 'pages/tareas/clientesFinales/domain/ClienteFinal'
import { TipoTrabajo } from 'pages/tareas/tiposTareas/domain/TipoTrabajo'
import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'
import { Subtarea } from '../../subtareas/domain/Subtarea'

export default defineComponent({
  props: {
    mixin: {
      type: Object as () => ContenedorSimpleMixin<Tarea>,
      required: true,
    },
  },
  components: {
    EssentialSelectableTable,
    ButtonSubmits,
    SubtareaPage,
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
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    const { entidad: tarea, listadosAuxiliares, accion } = props.mixin.useReferencias()
    const { consultar, guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      props.mixin.useComportamiento()
    const { onGuardado, onConsultado, onModificado, onBeforeModificar } = props.mixin.useHooks()

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
      provincias.value = listadosAuxiliares.provincias
      cantones.value = listadosAuxiliares.cantones
      proyectos.value = listadosAuxiliares.proyectos
    })

    const paraProyecto = computed(() => tarea.destino === destinosTareas.paraProyecto)
    const paraClienteFinal = computed(() => tarea.destino === destinosTareas.paraClienteFinal)

    /*************
    * Validaciones
    **************/
    const reglas = {
      cliente: { requiredIfCliente: requiredIf(function () { return paraClienteFinal.value ? true : false }) },
      titulo: { required },
      detalle: { required },
      codigo_tarea_cliente: { required },
      proyecto: { required },
      // tipo_trabajo: { required },
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

    // const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === tarea.ubicacion_tarea.provincia))

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
    }

    /********
    * Hooks
    *********/
    onBeforeModificar(() => {
      if (tarea.destino === destinosTareas.paraClienteFinal) {
        tarea.proyecto = null
      }

      if (tarea.destino === destinosTareas.paraProyecto) {
        const copiaTarea = Object.assign({}, tarea)
        tarea.hydrate(new Tarea())
        tarea.id = copiaTarea.id
        tarea.codigo_tarea = copiaTarea.codigo_tarea
        tarea.proyecto = copiaTarea.proyecto
        tarea.detalle = copiaTarea.detalle
      }
    })

    onGuardado(() => {
      accion.value = acciones.editar
      consultar(tarea)
    })

    onModificado(() => {
      accion.value = acciones.editar
      consultar(tarea)
    })

    onConsultado(async () => {
      tareaStore.tarea.hydrate(tarea)
    })

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

    // Informacion de ubicacion
    const clienteFinal = reactive(new ClienteFinal())

    watch(computed(() => tarea.destino), (valor) => {
      if (accion.value !== acciones.editar) {
        tarea.hydrate(new Tarea())
        clienteFinal.hydrate(new ClienteFinal())
        tarea.destino = valor
      }
    })

    async function setCliente() {
      if (tarea.proyecto) {
        const proyectoController = new ProyectoController()
        const { result } = await proyectoController.consultar(tarea.proyecto)
        tarea.cliente = result.cliente
      }
    }

    const mostrarLabelModal = computed(() => [acciones.nuevo, acciones.editar].includes(accion.value))

    const modales = new ComportamientoModalesGeneralContent()

    return {
      mixinSubtarea,
      clientesFinalesSource,
      v$,
      tarea,
      accion,
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
    }
  },
})
