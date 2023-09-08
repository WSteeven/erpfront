//Dependencias
import { configuracionColumnasDatosBancariosProveedor } from "../domain/configuracionColumnasDatosBancariosProveedor";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";

//Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import { defineComponent, ref } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { DatoBancario } from "../domain/DatoBancario";
import { DatoBancarioController } from "../infraestructure/DatoBancarioController";
import { BancoController } from "pages/recursosHumanos/banco/infrestruture/BancoController";
import { EmpresaController } from "pages/administracion/empresas/infraestructure/EmpresaController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";

//Logica y controladores

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(DatoBancario, new DatoBancarioController())
        const { entidad: dato, disabled, accion, listadosAuxiliares, listadoArchivos } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado, onReestablecer, onGuardado } = mixin.useHooks()

        //stores


        //variables
        const bancos = ref([])
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
            numero_cuenta: { required },
        }

        const v$ = useVuelidate(reglas, dato)
        setValidador(v$.value)

        /**************************************************************
         * Funciones
         **************************************************************/
        const { empresas, filtrarEmpresas } = useFiltrosListadosSelects(listadosAuxiliares)

        //llenar listados
        empresas.value = listadosAuxiliares.empresas
        bancos.value = listadosAuxiliares.bancos

        return {
            mixin, dato, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasDatosBancariosProveedor,

            //listados
            bancos,
            empresas, filtrarEmpresas,

            //funciones
            

        }
    }
})