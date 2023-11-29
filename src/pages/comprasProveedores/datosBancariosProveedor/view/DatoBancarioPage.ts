//Dependencias
import { configuracionColumnasDatosBancariosProveedor } from "../domain/configuracionColumnasDatosBancariosProveedor";
import { required, minLength, minValue, numeric } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";

//Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import { defineComponent, reactive, ref } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { DatoBancario } from "../domain/DatoBancario";
import { DatoBancarioController } from "../infraestructure/DatoBancarioController";
import { BancoController } from "pages/recursosHumanos/banco/infrestruture/BancoController";
import { EmpresaController } from "pages/administracion/empresas/infraestructure/EmpresaController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import { Empresa } from "pages/administracion/empresas/domain/Empresa";
import { tiposCuentas } from "config/utils_compras_proveedores";

//Logica y controladores

export default defineComponent({
  components: { TabLayout },
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(DatoBancario, new DatoBancarioController())
    const { entidad: dato, disabled, accion, listadosAuxiliares, listadoArchivos } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

    //stores
    const statusLoading = new StatusEssentialLoading()


    //variables
    const empresa: Empresa = reactive(new Empresa())
    cargarVista(async () => {
      await obtenerListados({
        bancos: new BancoController(),
        empresas: new EmpresaController()
      })
    })

    const reglas = {
      banco: { required },
      empresa: { required },
      tipo_cuenta: { required },
      numero_cuenta: {
        required, numeric,
        minLength: minLength(6),
        noNegative(value) { return (value !== null && value < 0) ? false : true },
      },
      nombre_propietario: { required },
    }

    const v$ = useVuelidate(reglas, dato)
    setValidador(v$.value)

    /**************************************************************
     * Funciones
     **************************************************************/
    onConsultado(() => {
      obtenerEmpresa(dato.empresa)
    })
    onGuardado(() => {
      empresa.hydrate(new Empresa())
      emit('cerrar-modal', false)
      emit('guardado', 'DatoBancarioPage')
    })
    onReestablecer(() => empresa.hydrate(new Empresa()))

    /**************************************************************
     * Funciones
     **************************************************************/
    const {
      empresas, filtrarEmpresas,
      bancos, filtrarBancos,
    } = useFiltrosListadosSelects(listadosAuxiliares)

    async function obtenerEmpresa(empresaId: number | null) {
      if (empresaId !== null) {
        statusLoading.activar()
        const { result } = await new EmpresaController().consultar(empresaId)
        empresa.hydrate(result)
        statusLoading.desactivar()
      }
    }

    //llenar listados
    empresas.value = listadosAuxiliares.empresas
    bancos.value = listadosAuxiliares.bancos

    return {
      mixin, dato, disabled, v$, accion,
      configuracionColumnas: configuracionColumnasDatosBancariosProveedor,

      //variables
      empresa,

      //listados
      tiposCuentas,
      bancos, filtrarBancos,
      empresas, filtrarEmpresas,

      //funciones
      obtenerEmpresa,

    }
  }
})
