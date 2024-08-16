//Dependencias
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'

//Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DevolucionController } from '../infraestructure/DevolucionController'
import { Devolucion } from '../domain/Devolucion'

import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, accionesTabla, estadosTransacciones, rolesSistema, tabOptionsPedidos } from 'config/utils'
import { useDevolucionStore } from 'stores/devolucion'

import { useAuthenticationStore } from 'stores/authentication'
import { CambiarEstadoDevolucion } from '../application/CambiarEstadoDevolucion'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { LocalStorage, useQuasar } from 'quasar'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { MaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/MaterialEmpleadoTarea'
import { ValidarListadoProductos } from '../application/ValidarListadoProductos'
import { useCargandoStore } from 'stores/cargando'
import { useNotificacionStore } from 'stores/notificacion'
import { useRouter } from 'vue-router'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { filtrarEmpleadosPorRoles, ordenarLista } from 'shared/utils'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { CondicionController } from 'pages/administracion/condiciones/infraestructure/CondicionController'
import { Condicion } from 'pages/administracion/condiciones/domain/Condicion'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ComportamientoModalesDevolucion } from '../application/ComportamientoModalesDevolucion'


export default defineComponent({
  name: 'Devoluciones',
  components: { TabLayoutFilterTabs2, EssentialTable, ModalesEntidad, EssentialSelectableTable, GestorArchivos, },

  setup() {
    const mixin = new ContenedorSimpleMixin(Devolucion, new DevolucionController())
    const { entidad: devolucion, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
    const { onReestablecer, onGuardado, onConsultado } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError, notificarInformacion } = useNotificaciones()

    //stores
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const modales = new ComportamientoModalesDevolucion()
    const devolucionStore = useDevolucionStore()
    const store = useAuthenticationStore()
    const listadoMaterialesDevolucion = useListadoMaterialesDevolucionStore()
    const router = useRouter()
    const cargando = new StatusEssentialLoading()
    const axios = AxiosHttpRepository.getInstance()

    //orquestador
    const {
      refListadoSeleccionable: refListado,
      criterioBusqueda: criterioBusquedaProducto,
      listado: listadoProductos,
      listar: listarProductos,
      limpiar: limpiarProducto,
      seleccionar: seleccionarProducto
    } = useOrquestadorSelectorDetalles(devolucion, 'materiales_empleado_consolidado')

    //variables
    const refArchivo = ref()
    const idDevolucion = ref()
    let tabSeleccionado = ref()
    let soloLectura = ref(false)
    let esVisibleTarea = ref(false)
    let puedeEditar = ref(false)
    const esCoordinador = store.esCoordinador
    const esActivosFijos = store.esActivosFijos
    const clientes = ref([])

    /************************
     * HOOKS
     ***********************/
    onReestablecer(() => {
      soloLectura.value = false
      refArchivo.value.limpiarListado()
      devolucion.solicitante = store.user.id
    })
    onConsultado(() => {
      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(devolucion.id)
      }, 1);
    })
    onGuardado((id: number) => {
      idDevolucion.value = id
      setTimeout(() => {
        subirArchivos()
      }, 1)

      devolucion.solicitante = store.user.id
    })

    const { empleados, filtrarEmpleados,
      sucursales, filtrarSucursales } = useFiltrosListadosSelects(listadosAuxiliares)

    const condiciones = ref([])
    const autorizaciones = ref([])
    //Obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            // campos: 'id,nombres,apellidos',
            estado: 1
          }
        },
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
        },
      })
      //Configurar los listados
      empleados.value = listadosAuxiliares.empleados
      autorizaciones.value = JSON.parse(LocalStorage.getItem('autorizaciones')!.toString())
      sucursales.value = listadosAuxiliares.sucursales
      tareas.value = listadosAuxiliares.tareas
      listadosAuxiliares.condiciones = JSON.parse(LocalStorage.getItem('condiciones')!.toString())
      condiciones.value = listadosAuxiliares.condiciones

      // en la carga inicial se coloca el solicitante
      devolucion.solicitante = store.user.id

      //logica para autocompletar el formulario de devolucion
      if (listadoMaterialesDevolucion.listadoMateriales.length) {
        devolucion.devolver_materiales_tecnicos = listadoMaterialesDevolucion.empleado_id !== store.user.id
        devolucion.tarea = listadoMaterialesDevolucion.tareaId ? listadoMaterialesDevolucion.tareaId : null
        devolucion.solicitante = listadoMaterialesDevolucion.empleado_id
        devolucion.cliente = listadoMaterialesDevolucion.cliente_id
        filtrarCliente(devolucion.cliente)
        devolucion.es_tarea = !!devolucion.tarea
        devolucion.es_para_stock = listadoMaterialesDevolucion.devolverAlStock
        devolucion.listadoProductos = listadoMaterialesDevolucion.listadoMateriales.map((material: MaterialEmpleadoTarea) => {
          return {
            producto: material.producto,
            categoria: material.categoria,
            descripcion: material.detalle_producto,
            cantidad: material.stock_actual,
            medida: material.medida,
            id: material.detalle_producto_id,
            serial: material.serial,
          }
        })
      }
      listadosAuxiliares.sucursales = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
      sucursales.value = listadosAuxiliares.sucursales
    })

    //reglas de validacion
    const reglas = {
      justificacion: { required },
      observacion_aut: { requiredIfCoordinador: requiredIf(() => devolucion.tiene_observacion_aut!) },
      // canton: { required },
      sucursal: { required },
      tarea: { requiredIfTarea: requiredIf(devolucion.es_tarea!) },
      condicion: { requiredIf: requiredIf(() => devolucion.misma_condicion) }
    }

    const v$ = useVuelidate(reglas, devolucion)
    setValidador(v$.value)

    const validarListadoProductos = new ValidarListadoProductos(devolucion)
    mixin.agregarValidaciones(validarListadoProductos)

    /************
     * Observers
     ************/
    watchEffect(() => {
      if (devolucion.es_tarea) obtenerClientesMaterialesTarea()
      else obtenerClientesMaterialesEmpleado()
    })

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    const { tareas, filtrarTareas } = useFiltrosListadosSelects(listadosAuxiliares)

    async function obtenerClientesMaterialesEmpleado() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_empleado)
        const response: AxiosResponse = await axios.get(ruta, { params: { empleado_id: devolucion.solicitante } })
        clientes.value = response.data.results
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function obtenerClientesMaterialesTarea() {
      try {
        cargando.activar()
        const ruta = axios.getEndpoint(endpoints.obtener_clientes_materiales_tarea)
        const response: AxiosResponse = await axios.get(ruta, { params: { empleado_id: devolucion.solicitante } })
        clientes.value = response.data.results
      } catch (e) {
        console.log(e)
      } finally {
        cargando.desactivar()
      }
    }

    async function filtrarCliente(value: number | null) {
      devolucion.listadoProductos = []
      devolucion.sucursal = null
      devolucion.sucursal_id = null
      if (value == null)
        listadosAuxiliares.sucursales = JSON.parse(LocalStorage.getItem('sucursales')!.toString())
      else
        listadosAuxiliares.sucursales = JSON.parse(LocalStorage.getItem('sucursales')!.toString()).filter((v) => v.cliente_id == value)

    }

    async function subirArchivos() {
      await refArchivo.value.subir()
    }

    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?',
        () => devolucion.listadoProductos.splice(posicion, 1))
    }

    function actualizarElemento(posicion: number, entidad: any): void {
      if (posicion >= 0) {
        listado.value.splice(posicion, 1, entidad)
        listado.value = [...listado.value]
      }
    }

    function filtrarDevoluciones(tab: string) {
      tabSeleccionado.value = tab
      puedeEditar.value = (esCoordinador || esActivosFijos || store.esJefeTecnico || store.esGerente || store.esRecursosHumanos || store.can('puede.autorizar.devoluciones')) && tabSeleccionado.value === estadosTransacciones.pendiente ? true : false
      if (tab == 'PENDIENTE') puedeEditar.value = true
      else puedeEditar.value = false
      listar({ estado: tab })
    }

    async function recargarSucursales() {
      const sucursales = (await new SucursalController().listar({ campos: 'id,lugar' })).result
      LocalStorage.set('sucursales', JSON.stringify(sucursales))
    }
    function comunicarComportamiento(value) {
      if (value) notificarInformacion('Esta opción generará un pedido automáticamente con los mismos items de la devolución, cuando la devolución sea aprobada')
    }
    async function checkSolicitantes(val, evt) {

      if (val) {
        devolucion.per_autoriza = store.user.id
        devolucion.autorizacion = 2
        if (!(store.esCoordinadorBodega || store.esBodeguero)) {
          listadosAuxiliares.empleados = await filtrarEmpleadosPorRoles(listadosAuxiliares.empleados, [rolesSistema.tecnico, rolesSistema.tecnico_lider, rolesSistema.secretario])
        }
      } else {
        devolucion.solicitante = store.user.id
        devolucion.per_autoriza = null
        devolucion.autorizacion = null
      }
    }

    async function obtenerDatosEmpleadoSeleccionado() {
      //obtener los clientes

      // obtener los materiales 
    }


    /*******************************************************************************************
     * Botones de tabla
     ******************************************************************************************/
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        eliminar({ entidad, posicion })
      },
      visible: () => {
        return accion.value == acciones.consultar ? false : true
      }
    }
    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ entidad, posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: devolucion.listadoProductos[posicion].cantidad,
          accion: (data) => devolucion.listadoProductos[posicion].cantidad = data,
        }
        prompt(data)
      },
      visible: () => {
        return (accion.value == acciones.nuevo && devolucion.misma_condicion) || (accion.value == acciones.editar && devolucion.misma_condicion)
      }
    }
    const botonAnular: CustomActionTable = {
      titulo: 'Anular',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => {
        confirmar('¿Está seguro de anular la devolución?', () => {
          const data: CustomActionPrompt = {
            titulo: 'Motivo',
            mensaje: 'Ingresa el motivo de la anulación',
            accion: async (data) => {
              try {
                const { result } = await new CambiarEstadoDevolucion().anular(entidad.id, data)
                notificarCorrecto('Devolución anulada exitosamente!')
                if (posicion >= 0) {
                  listado.value.splice(posicion, 1,)
                  listado.value = [...listado.value]
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
        return entidad.estado_bodega == 'PENDIENTE' && (entidad.solicitante_id == store.user.id || entidad.per_autoriza_id == store.user.id || store.esBodeguero || store.esAdministrador)
        // return tabSeleccionado.value == 'PARCIAL' || tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PENDIENTE' && store.user.id == entidad.solicitante_id && (entidad.estado_bodega === estadosTransacciones.pendiente || entidad.estado_bodega === estadosTransacciones.parcial) ? true : false
      }
    }
    const botonImprimir: CustomActionTable = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad, posicion }) => {
        devolucionStore.idDevolucion = entidad.id
        await devolucionStore.imprimirPdf()
      },
      visible: () => true //tabSeleccionado.value == 'CREADA' ? true : false
    }

    const botonDespachar: CustomActionTable = {
      titulo: 'Gestionar',
      color: 'primary',
      icono: 'bi-pencil-square',
      accion: ({ entidad, posicion }) => {
        devolucionStore.devolucion = entidad
        console.log('Devolución a ingresar a bodega es: ', devolucionStore.devolucion)
        router.push('transacciones-ingresos')
      },
      visible: ({ entidad }) => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && store.can('puede.gestionar.devoluciones') ? true : false
    }
    const botonCorregir: CustomActionTable = {
      titulo: 'Corregir devolución',
      color: 'amber-3',
      icono: 'bi-gear',
      accion: ({ entidad, posicion }) => {
        devolucionStore.devolucion = entidad
        modales.abrirModalEntidad('CorregirDevolucionPage')
      },
      // visible: ({ entidad }) =>true
      visible: ({ entidad }) => (tabSeleccionado.value == 'APROBADO' || tabSeleccionado.value == 'PARCIAL') && (store.esBodeguero || entidad.per_autoriza_id == store.user.id) && entidad.estado_bodega == estadosTransacciones.parcial ? true : false
    }




    const configuracionColumnasProductosSeleccionadosAccion = computed(() => [...configuracionColumnasProductosSeleccionados,
    {
      name: 'condiciones',
      field: 'condiciones',
      label: 'Estado del producto',
      align: 'left',
      sortable: false,
      visible: true,
      type: 'select',
      options: condiciones.value.map((v: Condicion) => { return { label: v.nombre } })
    },
    {
      name: 'observacion',
      field: 'observacion',
      label: 'Observación',
      align: 'left',
      type: 'string',
      sortable: false,
    },
      // {
      //   name: 'acciones',
      //   field: 'acciones',
      //   label: 'Acciones',
      //   align: 'center'
      // },
    ])

    return {
      mixin, devolucion, disabled, accion, v$, acciones, accionesTabla,
      configuracionColumnas: configuracionColumnasDevoluciones,
      //listados
      empleados, filtrarEmpleados,
      clientes,
      tareas,
      filtrarTareas,
      autorizaciones,
      sucursales, filtrarSucursales,
      condiciones,
      store,
      refArchivo,
      idDevolucion,
      modales,

      //selector
      refListado,
      criterioBusquedaProducto,
      listadoProductos,
      listarProductos,
      limpiarProducto,
      seleccionarProducto,
      configuracionColumnasDetallesModal,


      //tabla
      configuracionColumnasProductosSeleccionadosAccion,
      configuracionColumnasProductosSeleccionados,
      botonEditarCantidad,
      botonEliminar,
      botonCorregir,
      botonAnular,
      botonImprimir,
      botonDespachar,

      //flags
      soloLectura,
      esVisibleTarea,
      esCoordinador,
      esActivosFijos,

      //Tabs
      tabOptionsPedidos,
      tabSeleccionado,
      puedeEditar,


      //funciones
      filtrarDevoluciones,
      filtrarCliente,
      checkMismaCondicion(val, evt) {
        if (!val) devolucion.condicion = null
      },
      onRowClick: (row) => alert(`${row.name} clicked`),
      recargarSucursales,
      ordenarLista,
      comunicarComportamiento,
      checkSolicitantes,
      obtenerDatosEmpleadoSeleccionado,
    }
  }
})
