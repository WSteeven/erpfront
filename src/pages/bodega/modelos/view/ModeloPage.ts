//Dependencias
import { configuracionColumnasModelos } from "../domain/configuracionColumnasModelos";
import { configuracionColumnasMarcas } from "pages/bodega/marcas/domain/configuracionColumnasMarcas";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useOrquestadorSelectorMarcas } from "../application/OrquestadorSelectorMarcas";
import { ModeloController } from "../infraestructure/ModeloController";
import { Modelo } from "../domain/Modelo";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

export default defineComponent({
    components: {TabLayout, EssentialSelectableTable},
    setup(){
        const mixin = new ContenedorSimpleMixin(Modelo, new ModeloController())
        const {entidad: modelo, disabled, accion} = mixin.useReferencias()
        const {onConsultado, onReestablecer}=mixin.useHooks()
        const {setValidador} = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: {required},
            marca: {required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, modelo)
        setValidador(v$.value)

        const {
            refListadoSeleccionable: refListadoSeleccionableMarcas,
            criterioBusqueda: criterioBusquedaMarca,
            listado: listadoMarcas,
            listar: listarMarcas,
            limpiar: limpiarMarca,
            seleccionar: seleccionarMarca
        } = useOrquestadorSelectorMarcas(modelo, 'marcas')

        onReestablecer(()=>(criterioBusquedaMarca.value=null))
        onConsultado(()=>seleccionarMarca(modelo.marca))

        return {
            mixin, modelo, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasModelos,
            //selector
            refListadoSeleccionableMarcas,
            criterioBusquedaMarca,
            listadoMarcas,
            listarMarcas,
            limpiarMarca,
            seleccionarMarca,
            configuracionColumnasMarcas
        }
    }
})