//Dependencias
import { configuracionColumnasPedidos } from '../domain/configuracionColumnasPedidos'
import { helpers, required, requiredIf } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useOrquestadorSelectorDetalles } from 'pages/bodega/pedidos/application/OrquestadorSelectorDetalles'

//Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { PedidoController } from '../infraestructura/PedidoController'
import { Pedido } from '../domain/Pedido'

import { configuracionColumnasProductosSeleccionadosDespachado } from '../domain/configuracionColumnasProductosSeleccionadosDespachado'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { acciones, autorizaciones, autorizacionesTransacciones, estados, estadosTransacciones, tabOptionsPedidos } from 'config/utils'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'

import { fechaMayorActual } from 'shared/validadores/validaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { usePedidoStore } from 'stores/pedido'
import { useRouter } from 'vue-router'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { LocalStorage, useQuasar } from 'quasar'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { CambiarEstadoPedido } from '../application/CambiarEstadoPedido'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { ordenarLista } from 'shared/utils'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { ComportamientoModalesPedido } from '../application/ComportamientoModalesPedido'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { EtapaController } from 'pages/gestionTrabajos/proyectos/modules/etapas/infraestructure/EtapaController'
import { Tarea } from 'pages/gestionTrabajos/tareas/domain/Tarea'


export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable, EssentialSelectableTable, ModalesEntidad, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(Pedido, new PedidoController())
    const { entidad: pedido, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onReestablecer, onBeforeConsultar, onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError, notificarAdvertencia } = useNotificaciones()

    // modales
    const modales = new ComportamientoModalesPedido()

    // Stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()
    const pedidoStore = usePedidoStore()
    const store = useAuthenticationStore()
    const router = useRouter()

    // Orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorDetalles(pedido, 'detalles')

    // Flags
    const tabSeleccionado = ref('PENDIENTE')
    const soloLectura = ref(false)
    const puedeEditar = ref(false)
    const tablaRefrescada = ref(true)

    const esCoordinador = store.esCoordinador
    const esBodeguero = store.esBodeguero
    const esTecnico = store.esTecnico
    const esActivosFijos = store.esActivosFijos
    const esRRHH = store.esRecursosHumanos
    const esGerente = store.esGerente

    onReestablecer(() => {
      soloLectura.value = false
      cargarDatosDefecto()
    })
    onBeforeConsultar(() =>tablaRefrescada.value = false)
    onConsultado(() => {
      tablaRefrescada.value=true
      empleados.value = listadosAuxiliares.empleados
      if (accion.value === acciones.editar && (esCoordinador || esActivosFijos || store.user.id === pedido.per_autoriza_id)) {
        soloLectura.value = true
      }
      obtenerProyectos()
      obtenerEtapasProyecto(pedido.proyecto, false)
    })
    //variables para cosultar los detalles
    const all = ref(true)
    const only_sucursal = ref(false)
    const only_cliente_tarea = ref(false)
    const etapasResponsable = ref([])
    const group = ref('only_sucursal')
    const options_groups = [
      {
        label: 'Solo bodega seleccionada',
        value: 'only_sucursal'
      },
      {
        label: 'Solo perteneciente al cliente de la tarea',
        value: 'only_cliente_tarea'
      },
      {
        label: 'Todos los elementos',
        value: 'todos'
      },
    ]


    const {
      empleados, filtrarEmpleados,
      clientes, filtrarClientes,
      proyectos, filtrarProyectos,
      etapas, filtrarEtapas,
      tareas, filtrarTareas,
      sucursales, filtrarSucursales,
    } = useFiltrosListadosSelects(listadosAuxiliares)

    //Obtener los listados
    cargarVista(async () => {
      cargarDatosDefecto()
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos,cargo_id',
            estado: 1,
          }
        },
        clientes: {
          controller: new ClienteController(),
          params: {
            campos: 'id,razon_social',
            requiere_bodega: 1,
            estado: 1,
          },
        },
        sucursales: JSON.parse(LocalStorage.getItem('sucursales')!.toString())
      })
      //Configurar los listados
      empleados.value = listadosAuxiliares.empleados
      tareas.value = listadosAuxiliares.tareas
      clientes.value = listadosAuxiliares.clientes
      sucursales.value = listadosAuxiliares.sucursales
    })


    /*****************************************************************************************
     * Validaciones
     ****************************************************************************************/
    const reglas = {
      justificacion: { required },
      observacion_aut: { requiredIfCoordinador: requiredIf(() => pedido.tiene_observacion_aut!) },
      sucursal: { required },
      per_retira: { requiredIfCheck: requiredIf(() => pedido.retira_tercero) },
      responsable: {
        requiredIfCoordinador: requiredIf(() => (esCoordinador || !esTecnico || esRRHH) && !pedido.para_cliente)
      },
      etapa: { requiredIf: requiredIf(() => { if (etapas.value) return etapas.value.length && pedido.proyecto }) },
      tarea: { requiredIfTarea: requiredIf(() => pedido.es_tarea!) },
      fecha_limite: {
        required: requiredIf(() => accion.value === acciones.nuevo),
        fechaMenor: helpers.withMessage('La fecha límite debe ser mayor a la fecha actual', (fechaMayorActual)) && accion.value === acciones.nuevo
      },
    }

    const v$ = useVuelidate(reglas, pedido)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(pedido)
    mixin.agregarValidaciones(validarListadoProductos)


    /*******************************************************************************************
     * Funciones
     *****************************************************************************************
     */
     async function filtrarPedidos(tab:string){
      tabSeleccionado.value = tab
      await listar({ estado: tab })
      puedeEditar.value = (esCoordinador || esActivosFijos || store.esJefeTecnico || esGerente || store.esCompras || store.can('puede.autorizar.pedidos')) && tabSeleccionado.value === estadosTransacciones.pendiente
     }

    function cargarDatosDefecto() {
      pedido.solicitante = store.user.id
      pedido.responsable = store.user.id

    }
    async function obtenerProyectos() {
      cargando.activar()
      const response = await new ProyectoController().listar({
        empleado_id: pedido.responsable,
        campos: 'id,nombre,codigo_proyecto',
        finalizado: 0,
      })
      listadosAuxiliares.proyectos = response.result
      proyectos.value = response.result
      if (accion.value == acciones.nuevo) await obtenerTareasEtapa(null)
      else await obtenerTareasEtapa(pedido.etapa, false)
      cargando.desactivar()
    }

    /**
     * La función 'limpiarCampos' borra los campos 'etapa' o 'tarea' si los parámetros correspondientes
     * son verdaderos.
     * @param [etapa=false] - Si se establece en verdadero, el campo 'etapa' se establecerá en nulo.
     * @param [tarea=false] - Si se establece en verdadero, la propiedad 'tarea' se establecerá en nula.
     */
    function limpiarCampos(etapa = false, tarea = false) {
      if (accion.value == acciones.nuevo) {
        if (etapa) pedido.etapa = null
        if (tarea) pedido.tarea = null
      }
    }
    async function obtenerEtapasProyecto(limpiarEtapa, limpiarTarea) {
      cargando.activar()
      if (pedido.proyecto) {
        limpiarCampos(limpiarEtapa, limpiarTarea)
        // const proyectoSeleccionado = listadosAuxiliares.proyectos.filter((proyecto) => proyecto.id === pedido.proyecto)[0]
        // if (proyectoSeleccionado) {
        //   console.log(proyectoSeleccionado)
        // }
        const response = await new EtapaController().listar({ etapas_empleado: 1, empleado_id: pedido.responsable, proyecto_id: pedido.proyecto })
        etapasResponsable.value = response.result
        if (response.result.length < 1) {
          await obtenerTareasEtapa(null, false)
        } else {
          const response = await new TareaController().listar({ activas_empleado: 1, empleado_id: pedido.responsable, proyecto_id: pedido.proyecto })
          listadosAuxiliares.tareas = response.result
          tareas.value = response.result
        }
        listadosAuxiliares.etapas = etapasResponsable.value
        etapas.value = etapasResponsable.value
      } else {
        etapas.value = []
        limpiarCampos(true, true)
        await obtenerTareasEtapa(null, false)
      }
      cargando.desactivar()
    }
    async function obtenerTareasEtapa(idEtapa: number | null, limpiarTarea = true) {
      cargando.activar()
      limpiarCampos(false, limpiarTarea)
      const response = await new TareaController().listar({ activas_empleado: 1, proyecto_id: pedido.proyecto, etapa_id: idEtapa, empleado_id: pedido.responsable, campos: 'id,codigo_tarea,titulo', finalizado: 0 })
      listadosAuxiliares.tareas = response.result
      tareas.value = response.result
      cargando.desactivar()
    }

    async function obtenerDatosTareaSeleccionada() {
      const tareaSeleccionada = listadosAuxiliares.tareas.filter((v: Tarea) => v.id == pedido.tarea)[0]
      if (tareaSeleccionada) {
        // console.log(tareaSeleccionada)
        pedido.cliente_id = tareaSeleccionada.cliente_id
        if (pedido.proyecto == null) {
          pedido.proyecto = tareaSeleccionada.proyecto_id
          await obtenerEtapasProyecto(true, true)
        }
        pedido.etapa = tareaSeleccionada.etapa_id
        pedido.tarea = tareaSeleccionada.id
      }
    }

    async function obtenerProyectosTareasTecnico(limpiarProyecto = true) {
      if (limpiarProyecto) pedido.proyecto = null
      limpiarCampos(true, true)
      cargando.activar()
      if (pedido.responsable) {
        const response = await new ProyectoController().listar({ empleado_id: pedido.responsable, finalizado: 0 })
        listadosAuxiliares.proyectos = response.result
        proyectos.value = response.result
        await obtenerEtapasProyecto(false, false)
        // await obtenerTareasTecnico()
      } else {
        pedido.es_tarea = false
      }
      cargando.desactivar()
    }

    /**
     * La función 'obtenerTareasTecnico' recupera una lista de tareas para un empleado, proyecto y
     * etapa específicos, y actualiza la variable 'tareas' con el resultado.
     */
    // async function obtenerTareasTecnico() {
    //   cargando.activar()
    //   if (pedido.responsable) {
    //     const response = await new TareaController().listar({ activas_empleado: 1, empleado_id: pedido.responsable, finalizado: 0, proyecto_id: pedido.proyecto, etapa_id: pedido.etapa })
    //     listadosAuxiliares.tareas = response.result
    //     tareas.value = response.result
    //   }
    //   cargando.desactivar()
    // }


    async function recargarSucursales() {
      const sucursales = (await new SucursalController().listar({ campos: 'id,lugar' })).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }
    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () => pedido.listadoProductos.splice(posicion, 1))
    }

    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ posicion }) => eliminar({ posicion }),
      visible: () => accion.value != acciones.consultar
    }
    const botonAnularAutorizacion: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de anular el pedido?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Causa de anulación',
            mensaje: 'Ingresa el motivo de la anulación',
            accion: async (data) => {
              try {
                const { result } = await new CambiarEstadoPedido().anular(entidad.id, data)
                if (result.autorizacion === autorizacionesTransacciones.cancelado) {
                  notificarCorrecto('Pedido anulado con éxito')
                  listado.value.splice(posicion, 1)
                }
              } catch (e: any) {
                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
              }
            }
          }
          prompt(data)
        })
      },
      visible: ({ entidad }) => {
        return (tabSeleccionado.value === autorizacionesTransacciones.aprobado || tabSeleccionado.value === estadosTransacciones.parcial) && ((entidad.per_autoriza_id === store.user.id || entidad.solicitante_id === store.user.id) && entidad.estado === estadosTransacciones.pendiente || store.esActivosFijos) || store.esAdministrador
      }
    }
    const botonMarcarComoCompletado: CustomActionTable = {
      titulo: 'Marcar Completado',
      color: 'green-6',
      icono: 'bi-check-circle-fill',
      tooltip: 'Marcar pedido como completado',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de marcar el pedido como completado?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Observación',
            mensaje: 'Ingresa el motivo de marcar como completo el pedido',
            accion: async (data) => {
              try {
                const { result } = await new CambiarEstadoPedido().marcarCompletado(entidad.id, data)
                if (result.estado === estadosTransacciones.completa) {
                  notificarCorrecto('Pedido marcado completado con éxito')
                  listado.value.splice(posicion, 1)
                }
              } catch (e: any) {
                notificarError('No se pudo completar el pedido, debes ingresar un motivo para la anulación')
              }
            }
          }
          prompt(data)
        })
      },
      visible: () => {
        return tabSeleccionado.value === estadosTransacciones.parcial && store.esBodeguero && store.esCoordinadorBodega
      }
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: pedido.listadoProductos[posicion].cantidad,
          accion: (data) => pedido.listadoProductos[posicion].cantidad = data,
        }
        prompt(data)
      },
      visible: () => {
        return accion.value != acciones.consultar
      }
    }
    const botonDespachar: CustomActionTable = {
      titulo: 'Despachar',
      color: 'primary',
      icono: 'bi-pencil-square',
      accion: ({ entidad }) => {
        pedidoStore.pedido = entidad
        router.push('transacciones-egresos')
      },
      visible: ({ entidad }) => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && (esBodeguero||store.esBodegueroTelconet) && entidad.estado != estadosTransacciones.completa
    }
    const botonCorregir: CustomActionTable = {
      titulo: 'Corregir pedido',
      color: 'amber-3',
      icono: 'bi-gear',
      accion: ({ entidad }) => {
        pedidoStore.pedido = entidad
        modales.abrirModalEntidad('CorregirPedidoPage')
      },
      visible: ({ entidad }) => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && (esBodeguero || entidad.per_autoriza_id == store.user.id) && entidad.estado != estadosTransacciones.completa
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        pedidoStore.idPedido = entidad.id
        await pedidoStore.imprimirPdf()
      },
      visible: () => tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL' || tabSeleccionado.value == 'COMPLETA'
    }



    return {
      mixin, pedido, disabled, accion, v$, acciones,
      configuracionColumnas: configuracionColumnasPedidos,
      tablaRefrescada,

      //listados y filtros
      clientes, filtrarClientes,
      proyectos, filtrarProyectos,
      etapas, filtrarEtapas,
      tareas, filtrarTareas,
      sucursales, filtrarSucursales,
      empleados, filtrarEmpleados,
      estados,
      autorizaciones,
      opciones_estados: estados,
      opciones_autorizaciones: autorizaciones,

      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasDetallesModal,


      //tabla
      configuracionColumnasProductosSeleccionados,
      configuracionColumnasProductosSeleccionadosDespachado,
      botonEditarCantidad,
      botonCorregir,
      botonEliminar,
      botonImprimir,
      botonDespachar,
      botonAnularAutorizacion,
      botonMarcarComoCompletado,

      //stores
      store,
      modales,

      //flags
      soloLectura,
      all, only_sucursal, only_cliente_tarea,
      group, options_groups,

      //Tabs
      tabOptionsPedidos,
      tabSeleccionado,
      puedeEditar,
      esCoordinador, esCoordinadorBackup: store.esCoordinadorBackup, esBodeguero, esTecnico, esActivosFijos, esRRHH,

      obtenerProyectosTareasTecnico,
      obtenerEtapasProyecto,
      obtenerTareasEtapa,
      checkEvidencia(val) {
        if (!val) {
          pedido.evidencia1 = ''
          pedido.evidencia2 = ''
        }
      },
      checkCliente(val) {
        if (val) {
          pedido.per_retira = null
          pedido.responsable = null
        } else pedido.cliente = null
      },
      checkRetiraTercero(val) {
        if (!val) pedido.per_retira = null
      },
      checkEsTarea(val) {
        if (val) {
          if (!pedido.responsable) {
            notificarAdvertencia('Debes seleccionar primero un empleado (técnico) responsable')
            pedido.es_tarea = false
          }
          else obtenerProyectos()
        } else {
          pedido.tarea = null
        }
      },

      //Filtros
      ordenarLista,

      onRowClick: (row) => alert(`${row.name} clicked`),
      obtenerDatosTareaSeleccionada,

      filtrarPedidos,
      recargarSucursales,

    }
  }
})
