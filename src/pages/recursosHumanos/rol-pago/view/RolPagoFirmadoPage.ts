// Dependencias
import { configuracionColumnasRolPago } from '../domain/configuracionColumnasRolPago'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { removeAccents } from 'shared/utils'
import { accionesTabla } from 'config/utils'
import { endpoints } from 'config/api'
import { configuracionColumnasRolPagoTabla } from '../domain/configuracionColumnasRolPagoTabla'
import { useCargandoStore } from 'stores/cargando'
import { useQuasar } from 'quasar'
// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorDocumentos from 'components/documentos/view/GestorDocumentos.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'

//Logica y controladores
import { RolPagoController } from '../infraestructure/RolPagoController'
import { RolPago } from '../domain/RolPago'
import { useRolPagoStore } from 'stores/rolPago'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { ArchivoRolPagoController } from '../infraestructure/ArchivoRolPagoController'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    EssentialTable,
    ButtonSubmits,
    GestorDocumentos,
  },
  emit: ['cerrar-modal', 'guardado'],

  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(RolPago, new RolPagoController())
    /*********
     * Stores
     *********/
    const rolPagoStore = useRolPagoStore()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    /********
     * Mixin
     *********/
    const {
      entidad: rolpago,
      accion,
      listado,
      disabled,
    } = mixin.useReferencias()
    const { consultar, guardar, editar, reestablecer, setValidador } =
      mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado } = mixin.useHooks()
    const mixinRolPago = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoRolPagoController()
    )

    /*******
     * Init
     *******/
    if (rolPagoStore.idRolPagoSeleccionada) {
      consultar({ id: rolPagoStore.idRolPagoSeleccionada })
    } else rolpago.hydrate(new RolPago())

    // rolpago.dias = rolPagoStore.dias
    accion.value = rolPagoStore.accion

    /************
     * Variables
     ************/
    const { notificarError, notificarCorrecto, notificarAdvertencia } =
      useNotificaciones()
    const es_consultado = ref(false)
    const refArchivoRolPago = ref()

    onConsultado(() => {
      es_consultado.value = true
    })
    rolpago.roles = ref([])
    rolpago.ingresos = ref([])
    rolpago.egresos = ref([])

    /********
     * Hooks
     *********/
    let idRolPago: any
    async function subirArchivos(id: number) {
      await refArchivoRolPago.value.subir({ rol_pago_id: id })
    }
    onBeforeGuardar(() => {
      rolpago.tieneDocumento =
        refArchivoRolPago.value.tamanioListado > 0 ? true : false
      if (!rolpago.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }
    })
    async function guardarDatos(rolpago: RolPago) {
      try {
        await editar(rolpago, false)
        const entidad = rolpago
        const rolpagoAux = new RolPago()
        rolpagoAux.hydrate(entidad)

        if (rolpagoAux.id) {
          listado.value = [rolpagoAux, ...listado.value]
          // Subir archivos
          idRolPago = rolpagoAux.id
          subirArchivos(idRolPago)

        }
        emit('cerrar-modal', false)
      } catch (e) {
        console.log(e)
      }
    }
    function reestablecerDatos() {
      reestablecer()
      emit('cerrar-modal')
    }

    /*************
     * Validaciones
     **************/
    const reglas = {
      empleado: { required },
      mes: { required },
    }
    const v$ = useVuelidate(reglas, rolpago)
    setValidador(v$.value)

    /************
     * Funciones
     *************/

    return {
      removeAccents,
      mixinRolPago,
      refArchivoRolPago,
      rolpago,
      guardarDatos,
      reestablecerDatos,
      guardar,
      editar,
      reestablecer,
      es_consultado,
      v$,
      disabled,
      configuracionColumnasRolPagoTabla,
      configuracionColumnas: configuracionColumnasRolPago,
      endpoint: endpoints.archivo_rol_pago,
      accion,
      accionesTabla,
    }
  },
})
