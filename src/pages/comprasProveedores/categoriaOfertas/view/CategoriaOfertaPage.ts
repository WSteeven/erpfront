//Dependencias
import { configuracionColumnasCategoriasOfertasProveedores } from "../domain/configuracionColumnasCategoriasOfertasProveedores";
import { required } from "shared/i18n-validators";
import useVuelidate from "@vuelidate/core";
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue"
import EssentialTable from "components/tables/view/EssentialTable.vue"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CategoriaOferta } from "../domain/CategoriaOferta";
import { CategoriaOfertaController } from "../infraestructure/CategoriaOfertaController";
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController";

//Logica y controladores

export default defineComponent({
    components: { TabLayout, EssentialTable },
    setup(props, { emit }) {
        const mixin = new ContenedorSimpleMixin(CategoriaOferta, new CategoriaOfertaController())
        const { entidad: categoria, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onGuardado } = mixin.useHooks()

        //variables
        cargarVista(async () => {
            obtenerListados({
                tipos_ofertas: new OfertaProveedorController()
            })

        })

        const reglas = {
            nombre: { required },
            tipo_oferta: { required }
        }

        const v$ = useVuelidate(reglas, categoria)
        setValidador(v$.value)

        /**************************************************************
         * Hooks
         **************************************************************/
        onGuardado(() => {
            emit('cerrar-modal', false)
            emit('guardado', 'CategoriaOfertaPage')
        })


        return {
            mixin, v$, categoria, disabled, accion,
            configuracionColumnas: configuracionColumnasCategoriasOfertasProveedores,

            tipos_ofertas: listadosAuxiliares.tipos_ofertas,
        }
    }
})