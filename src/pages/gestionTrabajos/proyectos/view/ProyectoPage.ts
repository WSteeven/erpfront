// Dependencias
import { configuracionColumnasProyecto } from '../domain/configuracionColumnasProyectos'
import { required, requiredIf, maxLength, helpers } from 'shared/i18n-validators'
import { acciones, accionesTabla, maskFecha, rolesSistema } from 'config/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { defineComponent, ref, computed } from 'vue'
import { useEtapaStore } from 'stores/tareas/etapa'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { CantonController } from 'pages/sistema/ciudad/infraestructure/CantonControllerontroller'
import { configuracionColumnasEtapa } from '../modules/etapas/domain/configuracionColumnasEtapas'
import { ComportamientoModalesProyectos } from '../application/ComportamientoModalesProyectos'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { CambiarEstadoEtapa } from '../modules/etapas/application/CambiarEstadoEtapa'
import { EtapaController } from '../modules/etapas/infraestructure/EtapaController'
import { ProyectoController } from '../infraestructure/ProyectoController'
import { Proyecto } from '../domain/Proyecto'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
    ModalesEntidad,
  },
  emits: ['guardado', 'cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(
      Proyecto,
      new ProyectoController()
    )
    const { entidad: proyecto, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    const store = useAuthenticationStore()
    const etapaStore = useEtapaStore()
    const modales = new ComportamientoModalesProyectos()

    const tieneEtapa = ref(false)

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        cantones: new CantonController(),
        coordinadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.coordinador },
        },
        fiscalizadores: {
          controller: new EmpleadoController(),
          params: { rol: rolesSistema.fiscalizador },
        },
      })
      clientes.value = listadosAuxiliares.clientes
      cantones.value = listadosAuxiliares.cantones
      coordinadores.value = listadosAuxiliares.coordinadores
      fiscalizadores.value = listadosAuxiliares.fiscalizadores
    })

    /************
     * Variables
     ************/
    const authenticationStore = useAuthenticationStore()
    const mostrarCoordinador = computed(() => authenticationStore.esJefeTecnico)

    // Validaciones
    const fechaFinMayor = (valor: string) => valor > (proyecto.fecha_inicio ?? 0)
    const fechaInicioMenor = (valor: string) => valor < (proyecto.fecha_fin ?? 0)

    const rules = {
      cliente: { required },
      codigo_proyecto: { required, maxLength },
      fecha_inicio: { required, fechaMenor: helpers.withMessage('La fecha de inicio de proyecto no puede ser menor o igual que su fecha de fin', fechaInicioMenor) },
      fecha_fin: { required, fechaMayor: helpers.withMessage('La fecha de fin de proyecto no puede ser mayor o igual que su fecha de inicio', fechaFinMayor) },
      nombre: { required },
      canton: { required },
      coordinador: { required: requiredIf(() => mostrarCoordinador.value) },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, proyecto)
    setValidador(v$.value)
    /****************************
     * Funciones
     ***************************/
    async function guardado(data: string) {
      switch (data) {
        case 'Etapa':
          await consultarEtapasProyecto()
          break
        default:
      }
    }

    async function consultarEtapasProyecto() {
      const { result } = await new EtapaController().listar({ proyecto_id: proyecto.id })
      proyecto.etapas = result
    }

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

    // Filtro fiscalizadores
    const fiscalizadores = ref()
    function filtrarFiscalizadores(val, update) {
      if (val === '') update(() => fiscalizadores.value = listadosAuxiliares.fiscalizadores)
      update(() => {
        const needle = val.toLowerCase()
        fiscalizadores.value = listadosAuxiliares.fiscalizadores.filter(
          (v) => v.nombres.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    /****************************
     * Botones de tablas
     ***************************/
    const addNuevaEtapa: CustomActionTable = {
      titulo: 'Agregar',
      color: 'primary',
      icono: 'bi-plus',
      tooltip: 'Agrega una nueva etapa al proyecto',
      accion: () => {
        modales.abrirModalEntidad('EtapaPage')
      },
      visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
    }

    const btnEditar: CustomActionTable = {
      titulo: 'Editar',
      color: 'secondary',
      tooltip: 'Editar una etapa',
      icono: 'bi-pencil-square',
      accion: ({ entidad, posicion }) => {
        etapaStore.idEtapa = entidad.id
        modales.abrirModalEntidad('EditarEtapaPage')
      }

    }
    const btnDesactivar: CustomActionTable = {
      titulo: 'Desactivar',
      icono: 'bi-toggle2-off',
      color: 'pink-6',
      tooltip: 'Desactivar proveedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de desactivar la etapa?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Motivo',
            mensaje: 'Ingresa el motivo por que vas a desactivar la etapa',
            accion: async (data) => {
              try {
                const { result, } = await new CambiarEstadoEtapa().desactivar(entidad.id, data)
                notificarCorrecto('Etapa anulada exitosamente!')
                proyecto.etapas.splice(posicion, 1, result)
              } catch (error: any) {
                console.log(error + '')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) => entidad.activo
    }
    const btnActivar: CustomActionTable = {
      titulo: 'Activar',
      icono: 'bi-toggle2-off',
      color: 'positive',
      tooltip: 'Activar proveedor',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de activar la etapa?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Motivo',
            mensaje: 'Ingresa el motivo por que vas a activar la etapa',
            accion: async (data) => {
              try {
                const { result, } = await new CambiarEstadoEtapa().desactivar(entidad.id, data)
                notificarCorrecto('Etapa anulada exitosamente!')
                proyecto.etapas.splice(posicion, 1, result)
              } catch (error: any) {
                console.log(error + '')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) => !entidad.activo
    }



    onConsultado(() => {
      consultarEtapasProyecto()
    })

    return {
      mixin,
      proyecto,
      disabled,
      accion, acciones,
      v$,
      configuracionColumnasProyecto,
      columnasEtapas: configuracionColumnasEtapa,
      clientes,
      cantones,
      coordinadores,
      fiscalizadores,
      filtrarClientes,
      filtrarCantones,
      filtrarCoordinadores,
      filtrarFiscalizadores,
      guardado,
      mostrarCoordinador,
      tieneEtapa,
      accionesTabla,
      maskFecha,
      //modales
      modales,

      //botones de tabla
      addNuevaEtapa,
      btnEditar,
      // btnEliminar,
      btnDesactivar,
      btnActivar,
    }
  },
})
