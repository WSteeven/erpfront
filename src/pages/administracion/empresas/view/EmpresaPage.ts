//Dependencias
import { configuracionColumnasEmpresas } from "../domain/configuracionColumnasEmpresas";
import { required } from "shared/i18n-validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Empresa } from "../domain/Empresa";
import { EmpresaController } from "../infraestructure/EmpresaController";
import { opcionesTipoContribuyente } from "config/utils";



export default defineComponent({
  components: { TabLayout },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Empresa, new EmpresaController())
    const { entidad: empresa, disabled, accion } = mixin.useReferencias()
    const { setValidador } = mixin.useComportamiento()
    const { onGuardado } = mixin.useHooks()

    onGuardado(() => {
      emit('cerrar-modal')
      emit('guardado')
    })

    /**************************************************************
     * Validaciones
     **************************************************************/
    const reglas = {
      identificacion: { required },
      tipo_contribuyente: { required },
      razon_social: { required },
    }
    const v$ = useVuelidate(reglas, empresa)
    setValidador(v$.value)

    return {
      mixin, empresa, disabled, v$, accion,
      configuracionColumnas: configuracionColumnasEmpresas,

      //listado tipos_contribuyentes
      opcionesTipoContribuyente,
    }

  }
})

