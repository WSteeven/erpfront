//Dependencias
import { configuracionColumnasUnidadesMedidas } from "../domain/configuracionColumnasUnidadesMedidas";
import { required } from "shared/i18n-validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent, DefineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { UnidadMedida } from "../domain/UnidadMedida";
import { UnidadMedidaController } from "../infraestructure/UnidadMedidaController";

export default defineComponent({
  components:{TabLayout},
  setup(){
    const mixin = new ContenedorSimpleMixin(UnidadMedida, new UnidadMedidaController())
    const  {entidad:unidad_medida, disabled, accion}=mixin.useReferencias()
    const {setValidador} = mixin.useComportamiento()

    const reglas = {
      nombre: {required},
      simbolo: {required},
    }

    const v$ = useVuelidate(reglas, unidad_medida)
    setValidador(v$.value)

    return {
      mixin, unidad_medida, disabled, accion, v$,
      configuracionColumnas: configuracionColumnasUnidadesMedidas

    }
  }
})
