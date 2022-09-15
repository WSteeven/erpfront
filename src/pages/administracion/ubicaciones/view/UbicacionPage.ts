//Dependencias
import { configuracionColumnasPerchas } from "pages/administracion/perchas/domain/configuracionColumnasPerchas";
import { configuracionColumnasPisos } from "pages/administracion/pisos/domain/configuracionColumnasPisos";
import { configuracionColumnasUbicaciones } from "../domain/configuracionColumnasUbicaciones";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useOrquestadorSelectorPisos } from "../application/OrquestadorSelectorPisos";
import { useOrquestadorSelectorPerchas } from "../application/OrquestadorSelectorPerchas";
import { UbicacionController } from "../infraestructure/UbicacionController";
import { Ubicacion } from "../domain/Ubicacion";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

export default defineComponent({
    components: {TabLayout, EssentialSelectableTable},
    setup(){
        const mixin = new ContenedorSimpleMixin(Ubicacion, new UbicacionController())
        const {entidad:ubicacion, disabled, accion}=mixin.useReferencias()
        const {onConsultado, onReestablecer}=mixin.useHooks()
        const {setValidador}=mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            codigo: {required},
            percha: {required},
            piso: {required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, ubicacion)
        setValidador(v$.value)

        //perchas
        const {
            refListadoSeleccionable: refListadoSeleccionablePerchas,
            criterioBusqueda: criterioBusquedaPercha,
            listado: listadoPerchas,
            listar: listarPerchas,
            limpiar: limpiarPercha,
            seleccionar: seleccionarPercha,
        } = useOrquestadorSelectorPerchas(ubicacion, 'perchas')

        onReestablecer(()=>(criterioBusquedaPercha.value=null))
        onConsultado(()=>seleccionarPercha(ubicacion.percha))
 
        //pisos
        const {
            refListadoSeleccionable: refListadoSeleccionablePisos,
            criterioBusqueda: criterioBusquedaPiso,
            listado: listadoPisos,
            listar: listarPisos,
            limpiar: limpiarPiso,
            seleccionar: seleccionarPiso,
        } = useOrquestadorSelectorPisos(ubicacion, 'pisos')

        onReestablecer(()=>(criterioBusquedaPiso.value=null))
        onConsultado(()=>seleccionarPiso(ubicacion.piso))

        return{
            mixin, 
            ubicacion, 
            disabled, 
            accion, 
            v$,
            configuracionColumnas: configuracionColumnasUbicaciones,

            //selector perchas
            refListadoSeleccionablePerchas,
            criterioBusquedaPercha,
            listadoPerchas,
            listarPerchas,
            limpiarPercha,
            seleccionarPercha,
            configuracionColumnasPerchas,
            
            //selector pisos
            refListadoSeleccionablePisos,
            criterioBusquedaPiso,
            listadoPisos,
            listarPisos,
            limpiarPiso,
            seleccionarPiso,
            configuracionColumnasPisos,
        }

    }
})