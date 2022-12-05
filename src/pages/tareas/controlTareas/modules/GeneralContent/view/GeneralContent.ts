// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
import { acciones, rolesAdmitidos } from 'config/utils'
import { required } from '@vuelidate/validators'
import { useTareaStore } from 'stores/tarea'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ProvinciaController } from 'pages/sistema/provincia/infraestructure/ProvinciaController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { ContactoController } from 'pages/tareas/contactos/infraestructure/ContactoController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { ComportamientoModalesTarea } from '../application/ComportamientoModalesTarea'
import { UbicacionTarea } from 'pages/tareas/controlTareas/domain/UbicacionTarea'
import { ClienteFinal } from 'pages/tareas/contactos/domain/ClienteFinal'
import { Tarea } from 'pages/tareas/controlTareas/domain/Tarea'
import { ProyectoController } from 'pages/tareas/proyectos/infraestructure/ProyectoController'

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
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      props.mixin.useComportamiento()
    const { onGuardado, onBeforeModificar, onReestablecer, onConsultado } = props.mixin.useHooks()

    const opcionesUbicacion = { manual: 'ubicacion_manual', cliente: 'cliente_final' }
    const tipoUbicacionTrabajo = ref()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        clientesFinales: new ContactoController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
        proyectos: new ProyectoController(),
        supervisores: {
          controller: new EmpleadoController(),
          params: { rol: rolesAdmitidos.fiscalizador },
        }
      })
      clientes.value = listadosAuxiliares.clientes
      supervisores.value = listadosAuxiliares.supervisores
      clientesFinales.value = listadosAuxiliares.clientesFinales
      provincias.value = listadosAuxiliares.provincias
      cantones.value = listadosAuxiliares.cantones
      proyectos.value = listadosAuxiliares.proyectos
    })

    // Validaciones
    const rules = {
      cliente: { required },
      detalle: { required },
      codigo_tarea_cliente: { required },
    }

    const v$ = useVuelidate(rules, tarea)
    setValidador(v$.value)

    // Modales
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

    // Informacion de ubicacion
    const clienteFinal = reactive(new ClienteFinal())

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ContactoController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      //clienteFinal.hydrate(result)
      return result
    }

    const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === tarea.ubicacion_tarea.provincia))

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
    }

    watchEffect(async () => {
      if (tarea.cliente_final) {
        tipoUbicacionTrabajo.value = 'cliente_final'
        const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
      }
      else
        tipoUbicacionTrabajo.value = opcionesUbicacion.manual
      /*if (tarea.cliente_final) {
        obtenerClienteFinal(tarea.cliente_final)
        tipoUbicacionTrabajo.value = opcionesUbicacion.cliente
      } else {
        tipoUbicacionTrabajo.value = opcionesUbicacion.manual
      }*/
    })

    onGuardado(() => {
      //accion.value = acciones.editar
      //tareaStore.tarea.hydrate(tarea)
    })

    onConsultado(async () => {
      //tipoUbicacionTrabajo.value = 'hfhffhjhgfjh' //opcionesUbicacion.cliente
      //console.log(tipoUbicacionTrabajo.value)
      if (tarea.cliente_final) {
        /*const res = await obtenerClienteFinal(tarea.cliente_final)
        clienteFinal.hydrate(res)
        console.log(res)*/

        tarea.ubicacion_tarea = new UbicacionTarea()
        console.log('Tiene cliente final')
      } /*else {
        tipoUbicacionTrabajo.value = opcionesUbicacion.manual
      }*/
    })

    onBeforeModificar(() => {
      if (tipoUbicacionTrabajo.value === 'ubicacion_manual') {
        tarea.cliente_final = null
        clienteFinal.hydrate(new ClienteFinal())
      } else {
        tarea.ubicacion_tarea = new UbicacionTarea()
      }
    })

    onReestablecer(() => {
      clienteFinal.hydrate(new ClienteFinal())
      tarea.cliente_final = null
      tarea.ubicacion_tarea = new UbicacionTarea()
      // tareaStore.tarea.hydrate(new Tarea())
    })

    return {
      v$,
      tarea,
      accion,
      // listados
      provincias,
      cantones,
      cantonesPorProvincia,
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
      filtrarProvincias,
      filtrarCantones,
      filtrarSupervisores,
      filtrarProyectos,
      obtenerClienteFinal,
      supervisores,
      proyectos,
      clienteFinal,
      // ubicacionManual,
      listadosAuxiliares,
      establecerCliente,
      // Selector
      configuracionColumnasClientes,
      tipoUbicacionTrabajo,
    }
  },
})
