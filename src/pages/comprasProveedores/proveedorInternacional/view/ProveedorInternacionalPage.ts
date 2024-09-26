import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import { defineComponent, watchEffect } from "vue";
import { ProveedorInternacional } from "../domain/ProveedorInternacional";
import { ProveedorInternacionalController } from "../infraestructure/ProveedorInternacionalController";
import { ArchivoController } from "pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController";
import { useNotificaciones } from "shared/notificaciones";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { PaisController } from "sistema/pais/infraestructure/PaisController";
import { ref } from "vue";
import { opcionesTipoContribuyente, tabOptionsProveedoresInternacionales } from "config/utils_compras_proveedores";
import { configuracionColumnasProveedoresInternacionales } from "../domain/configuracionColumnasProveedoresInternacionales";
import useVuelidate from "@vuelidate/core";
import { email, required } from "shared/i18n-validators";


export default defineComponent({
  components: { TabLayoutFilterTabs2, GestorArchivos },
  setup() {
    const mixin = new ContenedorSimpleMixin(ProveedorInternacional, new ProveedorInternacionalController, new ArchivoController())
    const { entidad: proveedor, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar } = mixin.useComportamiento()
    const { onConsultado, onReestablecer, onGuardado, onModificado, onBeforeGuardar, onBeforeModificar } = mixin.useHooks()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

    const refArchivo = ref()
    const mostrarSegundaFilaCuentaBancaria = ref(false)
    const tabDefecto = ref('1')
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
      tipo: { required },
      pais: { required },
      direccion: { required },
      correo: {required, email}
    }

    const v$ = useVuelidate(reglas, proveedor)
    setValidador(v$.value)

    /*******************************************************************************************
     * Eventos
     ******************************************************************************************/
    watchEffect(() => {
      if (!mostrarSegundaFilaCuentaBancaria.value) {
        proveedor.banco2 = null
        proveedor.numero_cuenta2 = null
        proveedor.codigo_swift2 = null
        proveedor.moneda2 = null
      }
    })

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
      v$,
      mixin, proveedor, disabled, accion,
      tabDefecto,
      configuracionColumnas: configuracionColumnasProveedoresInternacionales,
      mostrarSegundaFilaCuentaBancaria,


      // listados
      tabOptions: tabOptionsProveedoresInternacionales,
      paises, filtrarPaises,
      opcionesTipoContribuyente,

      // funciones
      filtrarProveedores,

    }
  }
})
