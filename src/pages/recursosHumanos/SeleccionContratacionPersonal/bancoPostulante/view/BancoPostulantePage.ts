import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import { defineComponent } from "vue";
import { BancoPostulante } from "../domain/BancoPostulante";
import { BancoPostulanteController } from "../infraestructure/BancoPostulanteController";
import useVuelidate from "@vuelidate/core";
import { acciones } from "config/utils";
import { required } from "shared/i18n-validators";
import { configuracionColumnasBancoPostulante } from "../domain/configuracionColumnasBancoPostulante";

export default defineComponent({
  components: { TabLayoutFilterTabs2 },
  setup() {
    const mixin = new ContenedorSimpleMixin(BancoPostulante, new BancoPostulanteController())
    const { entidad: banco, disabled, listadosAuxiliares, tabs, accion } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, consultar, listar } = mixin.useComportamiento()
    const { onConsultado, onGuardado, onBeforeModificar, onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({

      })
      //more code on initialization time

    })

    const reglas = {
      cargo: { required },
      puntuacion: { required },
      // observacion: (v: string) => v.length <= 250,
    }
    const v$ = useVuelidate(reglas, banco)

    return {
      mixin, v$, accion, acciones,
      configuracionColumnas: configuracionColumnasBancoPostulante,
      banco,
      disabled,
    }
  }
})
