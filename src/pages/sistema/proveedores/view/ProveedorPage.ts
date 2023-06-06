//Dependencias
import { configuracionColumnasProveedores } from './../domain/configuracionColumnasProveedores'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core';

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue';
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue';

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { computed, defineComponent, reactive, ref } from 'vue';
import { ProveedorController } from '../infraestructure/ProveedorController';
import { Proveedor } from '../domain/Proveedor';
import { acciones } from 'config/utils';
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


export default defineComponent({
  components: { TabLayout, LabelAbrirModal, ModalesEntidad },
  setup() {
    const mixin = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onReestablecer } = mixin.useHooks()

    const mostrarLabelModal = computed(() => accion.value === acciones.nuevo)
    const modales = new ComportamientoModalesProveedores()
    const StatusLoading = new StatusEssentialLoading()
    const empresa: Empresa = reactive(new Empresa())
    const opciones_empresas = ref([])
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

    /**************************************************************
     * Funciones
     **************************************************************/
    async function obtenerEmpresa(empresaId: number | null) {
      if (empresaId !== null) {
        StatusLoading.activar()
        const { result } = await new EmpresaController().consultar(empresaId)
        empresa.hydrate(result)
        StatusLoading.desactivar()
      }
    }
    async function guardado() {
      const { result } = await new EmpresaController().listar()
      opciones_empresas.value = result
    }
    const {
      parroquias, filtrarParroquias,

    } = useFiltrosListadosSelects(listadosAuxiliares)

    //llenar listados
    opciones_empresas.value = listadosAuxiliares.empresas
    parroquias.value = listadosAuxiliares.parroquias
    categorias.value = listadosAuxiliares.categorias
    departamentos.value = listadosAuxiliares.departamentos
    ofertas.value = listadosAuxiliares.ofertas

    return {
      mixin, proveedor, disabled, v$, accion,
      configuracionColumnas: configuracionColumnasProveedores,

      empresa,
      //listados
      categorias,
      departamentos,
      ofertas,
      opciones_tipo_contribuyente,
      opciones_tipo_negocio,
      opciones_empresas,
      parroquias, filtrarParroquias,

      //modal
      modales,
      mostrarLabelModal,
      guardado,

      //funciones
      obtenerEmpresa,

    }

  }
})

