//Dependencias
import { configuracionColumnasProveedores } from './../domain/configuracionColumnasProveedores'
import { configuracionColumnasContactosProveedores } from 'pages/comprasProveedores/contactosProveedor/domain/configuracionColumnasContactosProveedores';
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core';

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';
import TablaDevolucionProducto from 'components/tables/view/TablaDevolucionProducto.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Ref, computed, defineComponent, reactive, ref } from 'vue';
import { ProveedorController } from '../infraestructure/ProveedorController';
import { Proveedor } from '../domain/Proveedor';
import { acciones } from 'config/utils';
import { ComportamientoModalesProveedores } from '../application/ComportamientoModalesProveedores';
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { Empresa } from 'pages/administracion/empresas/domain/Empresa';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { estadosCalificacionProveedor, opcionesTipoContribuyente, opcionesTipoNegocio } from 'config/utils_compras_proveedores';
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController';
import { OfertaProveedorController } from '../modules/ofertas_proveedores/infraestructure/OfertaProveedorController';
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController';
import { DepartamentoController } from '../modules/departamentos/infraestructure/DepartamentoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { ContactoProveedor } from 'pages/comprasProveedores/contactosProveedor/domain/ContactoProveedor';
import { useNotificaciones } from 'shared/notificaciones';
import { ContactoProveedorController } from 'pages/comprasProveedores/contactosProveedor/infraestructure/ContactoProveedorController';
import { useProveedorStore } from 'stores/comprasProveedores/proveedor';
import { useAuthenticationStore } from 'stores/authentication';
import moment from 'moment';
import { useCalificacionProveedorStore } from 'stores/comprasProveedores/calificacionProveedor';
import { DetalleDepartamentoProveedorController } from 'pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController';


export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad, TablaDevolucionProducto, EssentialTable },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { confirmar } = useNotificaciones()
    const refContactos = ref()
    const contactosProveedor: Ref<ContactoProveedor[]> = ref(proveedor.contactos)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo)
    /**************************************************************
     * Stores
     **************************************************************/
    const modales = new ComportamientoModalesProveedores()
    const StatusLoading = new StatusEssentialLoading()
    const proveedorStore = useProveedorStore()
    const calificacionStore = useCalificacionProveedorStore()
    const store = useAuthenticationStore()

    //variables
    const detalleDepartamentoProveedor = ref()
    const empresa: Empresa = reactive(new Empresa())
    const categorias = ref([])
    const departamentos = ref([])
    const ofertas = ref([])
    cargarVista(async () => {
      obtenerListados({
        empresas: new EmpresaController(),
        parroquias: new ParroquiaController(),
        categorias: new CategoriaController(),
        departamentos: new DepartamentoController(),
        ofertas: new OfertaProveedorController(),
      })
    })

    /**************************************************************
     * Hooks
     **************************************************************/
    onConsultado(() => {
      obtenerEmpresa(proveedor.empresa)
    })
    onReestablecer(() => {
      empresa.hydrate(new Empresa())
    })
    /**************************************************************
     * Validaciones
     **************************************************************/
    const reglas = {
      parroquia: { required },
      empresa: { required },
      sucursal: { required },
      direccion: { required },
      tipos_ofrece: { required },
      categorias_ofrece: { required },
      departamentos: { required },
    }
    const v$ = useVuelidate(reglas, proveedor)
    setValidador(v$.value)

    /***************************
     * Configuracion de columnas
     ****************************/
    const columnasContactosProveedor: any = [
      ...configuracionColumnasContactosProveedores,
      // accionesTabla,
    ]
    columnasContactosProveedor.splice(2, 1)

    /**************************************************************
     * Funciones
     **************************************************************/
    const abrirModalContacto: CustomActionTable = {
      titulo: 'Agregar contacto',
      icono: 'bi-person-fill-add',
      color: 'positive',
      tooltip: 'Puede modificar o eliminar un contacto desde el panel contactos de proveedores',
      accion: () => {
        modales.abrirModalEntidad('ContactoProveedorPage')
      },
      visible: () => { return accion.value == acciones.nuevo || accion.value == acciones.editar }
    }

    const botonCalificarProveedor: CustomActionTable = {
      titulo: 'Calificar',
      icono: 'bi-stars',
      color: 'positive',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.idProveedor = entidad.id
        proveedorStore.proveedor = entidad
        consultarDetalleDepartamentoProveedor().then(() => {
          proveedorStore.idDetalleDepartamento = detalleDepartamentoProveedor.value.id
        })
        // proveedorStore.proveedor.hydrate(await new ProveedorController().consultar(entidad.id))
        modales.abrirModalEntidad('CalificacionProveedorPage')

      },
      visible: ({ posicion, entidad }) => {
        // console.log(posicion, entidad)
        const departamento_calificador = entidad.related_departamentos.filter((v) => v.id === store.user.departamento)[0]
        if (departamento_calificador) {
          if (departamento_calificador.pivot.fecha_calificacion) {
            const diasTranscurridos = moment().diff(moment(departamento_calificador?.pivot.fecha_calificacion), 'days')
            return diasTranscurridos > 365 && entidad.estado
          }
          return true && entidad.estado
        }
        return false

        // return true
      }
    }
    const botonVerMiCalificacionProveedor: CustomActionTable = {
      titulo: 'Ver mi calificación',
      icono: 'bi-eye',
      color: 'positive',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.proveedor = entidad
        calificacionStore.idDepartamento = proveedorStore.idDepartamento
        calificacionStore.verMiCalificacion = true
        modales.abrirModalEntidad('InfoCalificacionProveedorPage')
      },
      visible: ({ posicion, entidad }) => {
        const departamento_calificador = entidad.related_departamentos.filter((v) => v.id === store.user.departamento)[0]
        if (departamento_calificador) {
          return departamento_calificador.pivot.calificacion !== null
        }
        return false
      }
    }
    const botonVerCalificacionProveedor: CustomActionTable = {
      titulo: 'Todas las calificaciones',
      icono: 'bi-eye',
      color: 'info',
      accion: async ({ entidad, posicion }) => {
        proveedorStore.idDepartamento = store.user.departamento
        proveedorStore.proveedor = entidad
        modales.abrirModalEntidad('InfoCalificacionProveedorPage')
      },
      visible: ({ posicion, entidad }) => {
        console.log(entidad)
        // console.log(store.user.permisos)
        return entidad.estado_calificado === estadosCalificacionProveedor.calificado || (entidad.estado_calificado == estadosCalificacionProveedor.parcial)// || (store.esCompras && (entidad.estado_calificado !== estadosCalificacionProveedor.vacio || entidad.estado_calificado !== estadosCalificacionProveedor.parcial || entidad.estado_calificado !== estadosCalificacionProveedor.pendiente))
      }
    }

    async function obtenerEmpresa(empresaId: number | null) {
      if (empresaId !== null) {
        StatusLoading.activar()
        const { result } = await new EmpresaController().consultar(empresaId)
        empresa.hydrate(result)
        StatusLoading.desactivar()
      }
    }
    async function guardado() {
      consultarEmpresas()
      listar()
      console.log('accion', accion.value)
      if (accion.value === acciones.editar)
        consultarContactosProveedor()

    }
    // async function consultarDepartamento() {
    //   const { result } = await new DepartamentoController().listar({ responsable_id: store.user.id })
    //   departamento.value = result
    // }

    async function consultarDetalleDepartamentoProveedor() {
      const { result } = await new DetalleDepartamentoProveedorController().listar({ proveedor_id: proveedorStore.idProveedor, departamento_id: proveedorStore.idDepartamento })
      console.log('El detalle departamento proveedor es: ', result[0])
      if (result) detalleDepartamentoProveedor.value = result[0]

    }

    async function consultarEmpresas() {
      const { result } = await new EmpresaController().listar()
      listadosAuxiliares.empresas = result
      empresas.value = result
    }
    async function consultarContactosProveedor() {
      const { result } = await new ContactoProveedorController().listar({ proveedor_id: proveedor.id })
      proveedor.contactos = result
    }
    const {
      parroquias, filtrarParroquias,
      empresas, filtrarEmpresas

    } = useFiltrosListadosSelects(listadosAuxiliares)

    //llenar listados
    parroquias.value = listadosAuxiliares.parroquias
    categorias.value = listadosAuxiliares.categorias
    empresas.value = listadosAuxiliares.empresas
    departamentos.value = listadosAuxiliares.departamentos
    ofertas.value = listadosAuxiliares.ofertas

    return {
      mixin, proveedor, disabled, v$, accion, acciones,
      configuracionColumnas: configuracionColumnasProveedores,
      columnasContactosProveedor,

      empresa,
      //listados
      categorias,
      departamentos,
      ofertas,
      opcionesTipoContribuyente,
      opcionesTipoNegocio,
      parroquias, filtrarParroquias,
      empresas, filtrarEmpresas,

      //modal
      modales,
      mostrarLabelModal,
      guardado,
      abrirModalContacto,
      refContactos,

      //funciones
      obtenerEmpresa,

      //botones
      botonCalificarProveedor,
      botonVerCalificacionProveedor,
      botonVerMiCalificacionProveedor,
    }

  }
})

