// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watch, watchEffect } from 'vue'
import { acciones, rolesAdmitidos, destinosTareas } from 'config/utils'
import { required, requiredIf } from '@vuelidate/validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ClienteFinalController } from 'pages/tareas/clientesFinales/infraestructure/ClienteFinalController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ProyectoController } from 'pages/tareas/proyectos/infraestructure/ProyectoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ClienteFinal } from 'pages/tareas/clientesFinales/domain/ClienteFinal'
import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'

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
  },
  setup(props) {
    const tareaStore = useTareaStore()

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
          params: { rol: rolesAdmitidos.fiscalizador },
        },
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesAdmitidos.coordinador },
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

    // Validaciones
    const rules = {
      cliente: { requiredIfCliente: requiredIf(function () { return paraClienteFinal.value ? true : false }) },
      detalle: { required },
      codigo_tarea_cliente: { requiredIfCodigoTarea: requiredIf(() => paraClienteFinal.value) },
    }

    const v$ = useVuelidate(rules, tarea)
    setValidador(v$.value)

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

    // Filtro coordinadores
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

    // Filtro provincias
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

    // Filtro cantones
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

    // Filtro proyectos
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

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ClienteFinalController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      return result
    }

    const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === tarea.ubicacion_tarea.provincia))

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
    }

    onBeforeModificar(() => {
      if (tarea.destino === destinosTareas.paraClienteFinal) {
        tarea.proyecto = null
      }

      if (tarea.destino === destinosTareas.paraProyecto) {
        const copiaTarea = Object.assign({}, tarea);
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

    const controller = new ClienteFinalController()

    watchEffect(async () => {
      clientesFinalesSource.value = (await controller.listar({ cliente: tarea.cliente })).result
      clientesFinales.value = clientesFinalesSource.value
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

    return {
      clientesFinalesSource,
      v$,
      tarea,
      accion,
      destinosTareas,
      provincias,
      cantones,
      cantonesPorProvincia,
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
    }
  },
})
