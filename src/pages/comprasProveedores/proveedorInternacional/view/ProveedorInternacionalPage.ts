import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import { defineComponent } from "vue";
import { ProveedorInternacional } from "../domain/ProveedorInternacional";
import { ProveedorInternacionalController } from "../infraestructure/ProveedorInternacionalController";
import { ArchivoController } from "pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController";
import { useNotificaciones } from "shared/notificaciones";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { PaisController } from "sistema/pais/infraestructure/PaisController";
import { ref } from "vue";
import { tabOptionsProveedoresInternacionales } from "config/utils_compras_proveedores";
import { configuracionColumnasProveedoresInternacionales } from "../domain/configuracionColumnasProveedoresInternacionales";
import useVuelidate from "@vuelidate/core";
import { required } from "shared/i18n-validators";

export default defineComponent({
  components: { TabLayoutFilterTabs2, GestorArchivos },
  setup() {
    const mixin = new ContenedorSimpleMixin(ProveedorInternacional, new ProveedorInternacionalController, new ArchivoController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado, onModificado, onBeforeGuardar, onBeforeModificar } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

    const refArchivo = ref()
    const tabDefecto = ref()
    const { paises, filtrarPaises } = useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        paises: new PaisController()
      })

      paises.value = listadosAuxiliares.paises
    })
    /*******************************************************************************************
     * Validaciones
     ******************************************************************************************/
     const reglas = {
      nombre: { required },
      pais: { required },
      direccion: { required }
    }

    const v$ = useVuelidate(reglas, proveedor)

    /*******************************************************************************************
     * Funciones
     ******************************************************************************************/
    async function subirArchivos() {
      await refArchivo.value.subir()
    }
    function filtrarProveedores(tab: string) {
      tabDefecto.value = tab
      listar({ activo: tab })
    }

    return {
      mixin, proveedor, disabled, accion,
      tabDefecto,
      configuracionColumnas: configuracionColumnasProveedoresInternacionales,

      // listados
      tabOptions: tabOptionsProveedoresInternacionales,
      paises, filtrarPaises,

      // funciones
      filtrarProveedores,

    }
  }
})
