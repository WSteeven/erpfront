//Dependencias
import { configuracionColumnasCriteriosCalificaciones } from "../domain/configuracionColumnasCriteriosCalificaciones";
import { required } from "shared/i18n-validators";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";


//Logica y Controladores
import { Ref, defineComponent, ref } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CriterioCalificacion } from "../domain/CriterioCalificacion";
import { CriterioCalificacionController } from "../infraestructure/CriterioCalificacionController";
import { useAuthenticationStore } from "stores/authentication";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";
import { DepartamentoController } from "pages/recursosHumanos/departamentos/infraestructure/DepartamentoController";
import { Departamento } from "pages/recursosHumanos/departamentos/domain/Departamento";
import useVuelidate from "@vuelidate/core";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";



export default defineComponent({
  components: { TabLayout, TablaFilasDinamicas, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(CriterioCalificacion, new CriterioCalificacionController())
    const { entidad: criterio, disabled, accion, listadosAuxiliares, listado: criteriosRealizados } = mixin.useReferencias()
    const { guardar: guardarCriterio, setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado } = mixin.useHooks()

    const departamento = ref()
    const store = useAuthenticationStore()
    const ofertas = ref([])

    cargarVista(async () => {
      obtenerListados({
        ofertas: new OfertaProveedorController(),
      })
      const { result } = await new DepartamentoController().listar({ responsable_id: store.user.id })
      departamento.value = result
    })
    /**************************************************************
    * Validaciones
    **************************************************************/
    
    /**************************************************************
    * Funciones
    **************************************************************/
    const agregarCriterioBienes: CustomActionTable = {
      titulo: "Agregar Criterio para calificar Bienes",
      tooltip: "Agregar Criterio Bienes",
      icono: 'bi-person-fill-add',
      color: 'positive',
      accion: (param) => {
        console.log(param);
      }
    }
    function guardarFilaCriterio(data) {
      criterio.hydrate(data)
      guardarCriterio(data)
    }

    //llenar listados
    ofertas.value = listadosAuxiliares.ofertas

    const columnas = [...configuracionColumnasCriteriosCalificaciones]

    return {
      mixin, criterio, disabled, accion,
      configuracionColumnas: configuracionColumnasCriteriosCalificaciones,
      columnas,

      store, //store de usuario autenticado
      //listados
      ofertas,
      departamento,
      guardarFilaCriterio,
      criteriosRealizados,
      agregarCriterioBienes,
      CriterioCalificacion,

    }
  }
})

