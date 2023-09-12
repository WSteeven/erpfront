//Dependencias
import { configuracionColumnasCategoriasOfertasProveedores } from "../domain/configuracionColumnasCategoriasOfertasProveedores";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { computed, defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue"
import EssentialTable from "components/tables/view/EssentialTable.vue"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CategoriaOferta } from "../domain/CategoriaOferta";
import { CategoriaOfertaController } from "../infraestructure/CategoriaOfertaController";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";
import { DepartamentoController } from "sistema/proveedores/modules/departamentos/infraestructure/DepartamentoController";
import { Departamento } from "sistema/proveedores/modules/departamentos/domain/Departamento";

//Logica y controladores

export default defineComponent({
    components: { TabLayout, EssentialTable },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(CategoriaOferta, new CategoriaOfertaController())
        const { entidad: categoria, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onGuardado, onReestablecer } = mixin.useHooks()

        //variables
        const departamentoFinanciero = computed(() => listadosAuxiliares.departamentos.length > 0 ? listadosAuxiliares.departamentos.filter((v: Departamento) => v.nombre == 'FINANCIERO')[0] : new Departamento())
        cargarVista(async () => {
            await obtenerListados({
                tipos_ofertas: new OfertaProveedorController(),
                departamentos: new DepartamentoController(),
            })

            categoria.departamentos = [...categoria.departamentos, departamentoFinanciero.value.id]

        })

        const reglas = {
            nombre: { required },
            tipo_oferta: { required },
            departamentos: { required },
        }

        const v$ = useVuelidate(reglas, categoria)
        setValidador(v$.value)

        /**************************************************************
         * Hooks
         **************************************************************/
        onReestablecer(() => {
            categoria.departamentos = [...categoria.departamentos, departamentoFinanciero.value.id]
        })
        onGuardado(() => {
            emit('cerrar-modal', false)
            emit('guardado', 'CategoriaOfertaPage')
        })


        return {
            mixin, v$, categoria, disabled, accion,
            configuracionColumnas: configuracionColumnasCategoriasOfertasProveedores,

            tipos_ofertas: listadosAuxiliares.tipos_ofertas,
            departamentos: listadosAuxiliares.departamentos,
            departamentoFinanciero,
        }
    }
})