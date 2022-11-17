// Dependencias
import { configuracionColumnasClientes } from 'sistema/clientes/domain/configuracionColumnasClientes'
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue'
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
// import { Canton } from 'pages/sistema/ciudad/domain/Canton'
import { UbicacionTarea } from 'pages/tareas/controlTareas/domain/UbicacionTarea'

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

    const { entidad: tarea, listadosAuxiliares, accion } = props.mixin.useReferencias()
    const { guardar, editar, eliminar, reestablecer, setValidador, obtenerListados, cargarVista } =
      props.mixin.useComportamiento()
    const { onGuardado, onConsultado } = props.mixin.useHooks()

    const opcionesUbicacion = { manual: 'ubicacion_manual', cliente: 'cliente_final' }
    const tipoUbicacionTrabajo = ref(opcionesUbicacion.manual)

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        clientesFinales: new ContactoController(),
        provincias: new ProvinciaController(),
        cantones: new CantonController(),
        supervisores: {
          controller: new EmpleadoController(),
          params: { rol: 'COORDINADOR' },
        }
      })
      clientes.value = listadosAuxiliares.clientes
      clientesFinales.value = listadosAuxiliares.clientesFinales
      supervisores.value = listadosAuxiliares.supervisores
      provincias.value = listadosAuxiliares.provincias
      cantones.value = listadosAuxiliares.cantones
      // tarea.hydrate(tareaStore.tarea)
    })

    // Validaciones
    const rules = {
      cliente: { required },
      detalle: { required },
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

    // Informacion de ubicacion
    const clienteFinal = reactive(new ClienteFinal())
    const ubicacionManual = reactive(new UbicacionTarea())

    async function obtenerClienteFinal(clienteFinalId: number) {
      const clienteFinalController = new ContactoController()
      const { result } = await clienteFinalController.consultar(clienteFinalId)
      clienteFinal.hydrate(result)
    }

    const cantonesPorProvincia = computed(() => cantones.value.filter((canton: any) => canton.provincia_id === tarea.ubicacion_tarea.provincia))

    function establecerCliente() {
      tareaStore.tarea.cliente = tarea.cliente
    }

    // Hooks
    // onGuardado(() => tareaStore.tarea.hydrate(tarea))
    /* onConsultado(() => {
      console.log('dgffdg fdgfdg df')
      // tareaStore.tarea.hydrate(tarea)
      //tarea.hydrate(tareaStore.tarea)
      if (tarea.cliente_final) {
        obtenerClienteFinal(tarea.cliente_final)
        tipoUbicacionTrabajo.value = opcionesUbicacion.cliente
      }
      else {
        clienteFinal.hydrate(new ClienteFinal())
        tipoUbicacionTrabajo.value = opcionesUbicacion.manual
      }
    }) */

    watchEffect(() => {
      if (tarea.cliente_final) {
        obtenerClienteFinal(tarea.cliente_final)
        tipoUbicacionTrabajo.value = opcionesUbicacion.cliente
      } else {
        tipoUbicacionTrabajo.value = opcionesUbicacion.manual
      }
    })

    onConsultado(() => {
      if (!tarea.ubicacion_tarea) tarea.ubicacion_tarea = new UbicacionTarea()
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
      obtenerClienteFinal,
      supervisores,
      filtrarSupervisores,
      clienteFinal,
      ubicacionManual,
      // ubicacionManual,
      listadosAuxiliares,
      establecerCliente,
      // Selector
      configuracionColumnasClientes,
      tipoUbicacionTrabajo,
    }
  },
})
