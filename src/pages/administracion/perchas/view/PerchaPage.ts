//Dependencias
import { configuracionColumnasPerchas } from "../domain/configuracionColumnasPerchas";
import { configuracionColumnasSucursales } from "pages/administracion/sucursales/domain/configuracionColumnasSucursales";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

// Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useOrquestadorSelectorSucursales } from "../application/OrquestadorSelectorSucursales";
import { PerchaController } from "../infraestructure/PerchaController";
import { Percha } from "../domain/Percha";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

export default defineComponent({
    components: {TabLayout, EssentialSelectableTable},
    setup(){
        const mixin = new ContenedorSimpleMixin(
            Percha, 
            new PerchaController())
        const {entidad: percha, disabled, accion}=mixin.useReferencias()
        const {onConsultado, onReestablecer} = mixin.useHooks()
        const {setValidador} = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: {required},
            sucursal: {required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, percha)
        setValidador(v$.value)

        const {
            refListadoSeleccionable: refListadoSeleccionableSucursales,
            criterioBusqueda: criterioBusquedaSucursal,
            listado: listadoSucursales,
            listar: listarSucursales,
            limpiar: limpiarSucursal,
            seleccionar: seleccionarSucursal,
        } = useOrquestadorSelectorSucursales(percha, 'sucursales')

        onReestablecer(()=>(criterioBusquedaSucursal.value =null))
        onConsultado(()=>seleccionarSucursal(percha.sucursal))

        return {
            mixin, 
            percha, 
            disabled, 
            accion, 
            v$,
            configuracionColumnas: configuracionColumnasPerchas,
            //Selector
            refListadoSeleccionableSucursales,
            criterioBusquedaSucursal,
            listadoSucursales,
            listarSucursales,
            limpiarSucursal,
            seleccionarSucursal,
            configuracionColumnasSucursales,
        }
    }
})