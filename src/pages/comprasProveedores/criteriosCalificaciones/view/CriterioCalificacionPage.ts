//Dependencias
import { configuracionColumnasCriteriosCalificaciones } from "../domain/configuracionColumnasCriteriosCalificaciones";
import { required } from "shared/i18n-validators";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import { Ref, defineComponent, ref } from "vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CriterioCalificacion } from "../domain/CriterioCalificacion";
import { CriterioCalificacionController } from "../infraestructure/CriterioCalificacionController";
import { useAuthenticationStore } from "stores/authentication";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";
import { DepartamentoController } from "pages/recursosHumanos/departamentos/infraestructure/DepartamentoController";
import { Departamento } from "pages/recursosHumanos/departamentos/domain/Departamento";
import useVuelidate from "@vuelidate/core";

//Logica y Controladores


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(CriterioCalificacion, new CriterioCalificacionController())
        const { entidad: criterio, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onConsultado } = mixin.useHooks()

        const departamento = ref()
        const store = useAuthenticationStore()
        const ofertas = ref([])

        cargarVista(async () => {
            obtenerListados({
                ofertas: new OfertaProveedorController(),
            })
            const {result} = await new DepartamentoController().listar({ responsable_id: store.user.id })
            departamento.value = result
        })
        /**************************************************************
        * Validaciones
        **************************************************************/
        const reglas = {
            nombre: {required},
            descripcion: {required},
            ponderacion_referencia: {required},
            oferta: {required},
        }
        const v$ = useVuelidate(reglas, criterio)
        setValidador(v$.value)

        //llenar listados
        ofertas.value = listadosAuxiliares.ofertas

        return {
            mixin, criterio, disabled, v$, accion,
            configuracionColumnas: configuracionColumnasCriteriosCalificaciones,

            store, //store de usuario autenticado
            //listados
            ofertas,
            departamento,

        }
    }
})

