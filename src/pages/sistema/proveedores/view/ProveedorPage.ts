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
import { acciones, accionesTabla } from 'config/utils';
import { ComportamientoModalesProveedores } from '../application/ComportamientoModalesProveedores';
import { EmpresaController } from 'pages/administracion/empresas/infraestructure/EmpresaController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { Empresa } from 'pages/administracion/empresas/domain/Empresa';
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { opciones_tipo_contribuyente, opciones_tipo_negocio } from 'config/utils_compras_proveedores';
import { ParroquiaController } from 'sistema/parroquia/infraestructure/ParroquiaController';
import { OfertaProveedorController } from '../modules/ofertas_proveedores/infraestructure/OfertaProveedorController';
import { CategoriaController } from 'pages/bodega/categorias/infraestructure/CategoriaController';
import { DepartamentoController } from '../modules/departamentos/infraestructure/DepartamentoController';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { ContactoProveedor } from 'pages/comprasProveedores/contactosProveedor/domain/ContactoProveedor';
import { useNotificaciones } from 'shared/notificaciones';
import { ContactoProveedorController } from 'pages/comprasProveedores/contactosProveedor/infraestructure/ContactoProveedorController';


export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad, TablaDevolucionProducto, EssentialTable },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { confirmar } = useNotificaciones()
    const refContactos = ref()
    const contactosProveedor: Ref<ContactoProveedor[]> = ref(proveedor.contactos)
    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo)
    const modales = new ComportamientoModalesProveedores()
    const StatusLoading = new StatusEssentialLoading()
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
      empresa: { required },
      sucursal: { required },
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
      console.log('accion', accion.value)
      if (accion.value === acciones.editar)
        consultarContactosProveedor()

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
      opciones_tipo_contribuyente,
      opciones_tipo_negocio,
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

    }

  }
})

