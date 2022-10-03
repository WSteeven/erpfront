// Dependencias
import { configuracionColumnasCategorias } from "../domain/configuracionColumnasCategorias";
import { required, minLength, maxLength } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core';
import { defineComponent } from "vue";

// Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { CategoriaController } from "../infraestructure/CategoriaController";
import { Categoria } from "../domain/Categoria";

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Categoria, new CategoriaController())
        const { entidad: categoria, disabled } = mixin.useReferencias()
        const { setValidador, listar, consultar } = mixin.useComportamiento()

        listar();
        //Reglas de validacion
        const reglas = {
            nombre: { required }
        }

        const v$ = useVuelidate(reglas, categoria)
        setValidador(v$.value)


        window.Echo.channel('prueba1').listen('PruebaEvent', (e) => {
            console.log(e)
        })


        return {
            mixin,
            categoria,
            v$,
            disabled,
            configuracionColumnas: configuracionColumnasCategorias,
        }
    }
})