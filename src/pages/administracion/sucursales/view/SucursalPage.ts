// Dependencias
import { configuracionColumnasSucursales } from "../domain/configuracionColumnasSucursales";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core';
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { SucursalController } from "../infraestructure/SucursalController";
import { Sucursal } from "../domain/Sucursal";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Sucursal, new SucursalController())
        const {entidad: sucursal, disabled} = mixin.useReferencias()
        const {setValidador, listar} = mixin.useComportamiento()

        listar()
        //Reglas de validacion
        const reglas = {
            lugar: {required},
            telefono: {required},
            correo:{required}
        }

        const v$ = useVuelidate(reglas, sucursal)
        setValidador(v$.value)


        return {
            mixin, sucursal, v$, disabled,
            configuracionColumnas: configuracionColumnasSucursales,
        }
    }
})