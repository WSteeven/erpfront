// Dependencias
import { configuracionColumnasBanco } from './../domain/configuracionColumnasBanco';
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { BancoController } from '../infrestruture/BancoController';
import { Banco } from './../domain/Banco';


export default defineComponent({
  components: { TabLayout },
  setup() {
    const mixin = new ContenedorSimpleMixin(Banco, new BancoController())
    const { entidad: banco, disabled } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()

    //Reglas de validacion
    const reglas = {
      nombre: { required }
    }

    const v$ = useVuelidate(reglas,banco)
    setValidador(v$.value)



    return {
      mixin,
      banco,
      v$,
      disabled,
      configuracionColumnas: configuracionColumnasBanco,
    }
  }
})
