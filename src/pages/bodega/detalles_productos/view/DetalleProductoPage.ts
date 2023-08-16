//Dependencias
import { configuracionColumnasDetallesProductos } from '../domain/configuracionColumnasDetallesProductos'
import { configuracionColumnasSerialesDetalles } from '../domain/configuracionColumnasSerialesDetalles'
import { required, requiredIf, numeric } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref, watch } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DetalleProductoController } from '../infraestructure/DetalleProductoController'
import { DetalleProducto } from '../domain/DetalleProducto'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores para los selects
import { ProductoController } from 'pages/bodega/productos/infraestructure/ProductoController'
import { MarcaController } from 'pages/bodega/marcas/infraestructure/MarcaController'
import { ModeloController } from 'pages/bodega/modelos/infraestructure/ModeloController'
import { TipoFibraController } from 'pages/administracion/tipos_fibras/infraestructure/TipoFibraController'
import { HiloController } from 'pages/administracion/hilos/infraestructure/HiloController'
import { SpanController } from 'pages/administracion/span/infraestructure/SpanController'
import { RamController } from '../modules/computadoras/modules/ram/infraestructure/RamController'
import { DiscoController } from '../modules/computadoras/modules/disco/infraestructure/DiscoController'
import { ProcesadorController } from '../modules/computadoras/modules/procesador/infraestructure/ProcesadorController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { ValidarListadoSeriales } from '../application/validaciones/ValidarListadoSeriales'

export default defineComponent({
  components: { TabLayout, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(DetalleProducto, new DetalleProductoController())
    const { entidad: detalle, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
    const { onGuardado, onReestablecer } = mixin.useHooks()
    const { confirmar } = useNotificaciones()

    //variable aux
    const descripcion = ref()
    const refSeriesModalEditable = ref()
    const serial = ''

    //listas
    const opciones_productos = ref([])
    const opciones_marcas = ref([])
    const opciones_modelos = ref([])
    const opciones_spans = ref([])
    const opciones_fibras = ref([])
    const opciones_hilos = ref([])
    const opciones_rams = ref([])
    const opciones_discos = ref([])
    const opciones_procesadores = ref([])
    const listadoBackup = ref<any[]>([])

    //Obtener los listados
    cargarVista(async () => {
      await obtenerListados({
        productos: {
          controller: new ProductoController(),
          params: { campos: 'id,nombre,categoria_id' }
        },
        marcas: {
          controller: new MarcaController(),
          params: { campos: 'id,nombre' }
        },
        modelos: {
          controller: new ModeloController(),
          params: { campos: 'id,nombre,marca_id' }
        },
        spans: {
          controller: new SpanController(),
          params: { campos: 'id,nombre' }
        },
        fibras: {
          controller: new TipoFibraController(),
          params: { campos: 'id,nombre' }
        },
        hilos: {
          controller: new HiloController(),
          params: { campos: 'id,nombre' }
        },
        rams: {
          controller: new RamController(),
          params: { campos: 'id,nombre' }
        },
        discos: {
          controller: new DiscoController(),
          params: { campos: 'id,nombre' }
        },
        procesadores: {
          controller: new ProcesadorController(),
          params: { campos: 'id,nombre' }
        },
      })
    })

    //Hooks
    onGuardado(() => descripcion.value = null)
    onReestablecer(() => descripcion.value = null)

    //Reglas de validacion
    const reglas = {
      producto: { required },
      descripcion: { required },
      marca: { required },
      modelo: { required },
      serial: {
        requiredIfSerial: requiredIf(function () { return detalle.tiene_serial ? detalle.tiene_serial : false }),
        requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false })
      },
      span: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? true : false }) },
      tipo_fibra: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }) },
      hilos: { requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }) },
      punta_inicial: {
        requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }),
        numerico: numeric
      },
      punta_final: {
        requiredIfFibra: requiredIf(function () { return detalle.es_fibra ? detalle.es_fibra : false }),
        numerico: numeric
      },
      punta_corte: { numeric },
      procesador: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },
      ram: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },
      disco: { requiredIfInformatica: requiredIf(function () { return detalle.categoria == 'INFORMATICA' ? true : false }) },
    }

    function limpiarCamposInformatica() {
      detalle.procesador = ''
      detalle.ram = ''
      detalle.disco = ''
      detalle.imei = ''
    }
    function limpiarCamposAdicionales() {
      detalle.tiene_adicionales = false
      detalle.color = ''
      detalle.talla = ''
      detalle.tipo = ''
    }
    function limpiarCamposFibra() {
      detalle.serial = null
      detalle.span = null
      detalle.tipo_fibra = null
      detalle.hilos = null
      detalle.punta_inicial = null
      detalle.punta_final = null
      detalle.punta_corte = null
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(reglas, detalle)
    setValidador(v$.value)

    const validarListadoSeriales = new ValidarListadoSeriales(detalle)
    mixin.agregarValidaciones(validarListadoSeriales)

    //Configurar los listados
    opciones_hilos.value = listadosAuxiliares.hilos
    opciones_marcas.value = listadosAuxiliares.marcas
    opciones_marcas.value = listadosAuxiliares.marcas
    opciones_modelos.value = listadosAuxiliares.modelos
    opciones_modelos.value = listadosAuxiliares.modelos
    opciones_hilos.value = listadosAuxiliares.hilos
    opciones_spans.value = listadosAuxiliares.spans
    opciones_fibras.value = listadosAuxiliares.fibras
    opciones_productos.value = listadosAuxiliares.productos
    opciones_discos.value = listadosAuxiliares.discos
    opciones_procesadores.value = listadosAuxiliares.procesadores
    opciones_rams.value = listadosAuxiliares.rams

    //paginacion
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 2,
      rowsPerPage: 10
      // rowsNumber: xx if getting data from a server
    })
    const opciones_tipos = ['HOMBRE', 'MUJER']

    const categoria_var = ref('')

    watch(categoria_var, () => {
      listadoBackup.value = listado.value
      limpiarCamposInformatica()
      limpiarCamposAdicionales()
      if (detalle.categoria === 'EPP') {
        detalle.tiene_adicionales = true
      }

    })


    async function cargarDetalle(id) {
      const { result } = await new DetalleProductoController().consultar(id)
      detalle.producto = result.producto
      detalle.producto_id = result.producto_id
      detalle.descripcion = result.descripcion //posiblemente no util esta linea
      detalle.marca = result.marca
      detalle.modelo = result.modelo
      detalle.modelo_id = result.modelo_id
      detalle.serial = result.serial
      detalle.precio_compra = result.precio_compra
      detalle.ram = result.ram
      detalle.disco = result.disco
      detalle.procesador = result.procesador
      detalle.imei = result.imei
      detalle.computadora = result.computadora
      detalle.fibra = result.fibra
      detalle.span = result.span
      detalle.tipo_fibra = result.tipo_fibra
      detalle.categoria = result.categoria
      detalle.codigo = result.codigo
      detalle.hilos = result.hilos
      detalle.punta_inicial = result.punta_inicial
      detalle.punta_final = result.punta_final
      detalle.punta_corte = result.punta_corte
      detalle.custodia = result.custodia
      detalle.puntas = result.puntas
      detalle.talla = result.talla
      detalle.tipo = result.tipo
      detalle.es_computadora = result.es_computadora
      detalle.es_fibra = result.es_fibra
      detalle.tiene_serial = result.tiene_serial
      detalle.tiene_precio_compra = result.tiene_precio_compra
      detalle.tiene_adicionales = result.tiene_adicionales
    }

    const addRow: CustomActionTable = {
      titulo: 'Agregar ítem',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      accion: () => {
        detalle.seriales.push('')
        refSeriesModalEditable.value.abrirModalEntidad(serial, detalle.seriales.length - 1)
      }
    }
    function eliminar({ posicion }) {
      confirmar('¿Está seguro de continuar?', () => detalle.seriales.splice(posicion, 1))
    }

    return {
      mixin, detalle, disabled, accion, v$, listado, listadoBackup,
      configuracionColumnas: configuracionColumnasDetallesProductos,
      //listados
      opciones_hilos,
      opciones_marcas,
      opciones_spans,
      opciones_fibras,
      opciones_modelos,
      opciones_productos,
      opciones_discos,
      opciones_procesadores,
      opciones_rams,
      opciones_tipos,
      useVuelidate,

      //variables auxiliares
      descripcion,
      //pagination
      pagination,

      //filtros
      seleccionarModelo(val) {
        // console.log('seleccionar modelo: ', val)
        opciones_modelos.value = listadosAuxiliares.modelos.filter((v) => v.marca_id === val)
        // console.log(opciones_modelos.value)
        detalle.modelo = ''
        if (opciones_modelos.value.length < 1) {
          detalle.modelo = ''
        }
        if (opciones_modelos.value.length === 1) {
          detalle.modelo = opciones_modelos.value[0]['id']
        }
      },
      filtroModelos(val, update) {
        if (val === '') {
          update(() => {
            // opciones_modelos.modelos = listadosAuxiliares.modelos
            // console.log('modelos recibidos', opciones_modelos.value)
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_modelos.value = listadosAuxiliares.modelos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
          // console.log(listadosAuxiliares.modelos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1))
        })
      },

      seleccionarMarca(val) {
        // console.log('seleccionar marca: ', val)
        const encontrado = listadosAuxiliares.modelos.filter((v) => v.id === val)
        if (encontrado.length > 0) {
          opciones_marcas.value = listadosAuxiliares.marcas.filter((v) => v.id === encontrado[0]['marca_id'])
          detalle.marca = encontrado[0]['marca_id']
        }
        // })
      },
      filtroMarcas(val, update) {
        if (val === '') {
          update(() => {
            opciones_marcas.value = listadosAuxiliares.marcas
            opciones_modelos.value = listadosAuxiliares.modelos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_marcas.value = listadosAuxiliares.marcas.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filtroProcesadores(val, update) {
        if (val === '') {
          update(() => {
            opciones_procesadores.value = listadosAuxiliares.procesadores
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_procesadores.value = listadosAuxiliares.procesadores.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filtroRams(val, update) {
        if (val === '') {
          update(() => {
            opciones_rams.value = listadosAuxiliares.rams
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_rams.value = listadosAuxiliares.rams.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      filtroDiscos(val, update) {
        if (val === '') {
          update(() => {
            opciones_discos.value = listadosAuxiliares.discos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_discos.value = listadosAuxiliares.discos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },

      filtroProductos(val, update) {
        if (val === '') {
          update(() => {
            opciones_productos.value = listadosAuxiliares.productos
          })
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
        })
      },
      checkFibra(val) {
        if (!val) {
          limpiarCamposFibra()
        }
      },

      actualizarCategoria(val) {
        const producto = listadosAuxiliares.productos.filter((v) => v.id === val)
        // console.log(producto[0])
        categoria_var.value = producto[0]['categoria']
        detalle.categoria = producto[0]['categoria']
        if (detalle.calco) {
          listadoBackup.value = listadoBackup.value.filter((v) => v.producto_id === producto[0]['id'])
        }
        /* if (producto[0]['categoria'] === 'INFORMATICA') {
            limpiarCamposInformatica()
        }
        if (producto[0]['categoria'] === 'EPP') {
            limpiarCamposInformatica()
        } */
      },
      filtroDetalles(val, update) {

        // console.log('valor tipeado', val)
        if (val === '') {
          update(() => {
            listadoBackup.value = listado.value
          })
          return
        }
        update(() => {
          listadoBackup.value = listadoBackup.value.filter((v) => v.descripcion.toLowerCase().indexOf(val) > -1)
        })
      },
      actualizarDetalle(val) {
        cargarDetalle(val)
      },
      /**
       * Función para calcular la diferencia entre la punta inicial y la punta final, cuyo resultado se asigna al valor de custodia.
       */
      calcularMetraje() {
        detalle.custodia = Math.abs((parseInt(detalle.punta_final!) - parseInt(detalle.punta_inicial!))).toString()
      },

      /* Filas y columnas de ingresar varios seriales */
      refSeriesModalEditable,
      columnas: configuracionColumnasSerialesDetalles,
      addRow,
      eliminar,
    }
  }
})