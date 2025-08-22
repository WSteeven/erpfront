// Dependencias
import { configuracionColumnasCie } from '../domain/configuracionColumnasCie'
import { useVuelidate } from '@vuelidate/core'
import { computed, defineComponent, ref, watchEffect } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Cie } from '../domain/Cie'
import { removeAccents } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { endpoints } from 'config/api'
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { CieController } from '../infraestructure/CieController'
import { ArchivoCieController } from '../infraestructure/ArchivoCieController'
import ArchivoSeguimiento from 'gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/view/ArchivoSeguimiento.vue'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ArchivoSeguimiento },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const mixin = new ContenedorSimpleMixin(Cie, new CieController())
    const mixinCie = new ContenedorSimpleMixin(
      Archivo,
      new ArchivoCieController()
    )

    const { entidad: cie, disabled, accion } = mixin.useReferencias()
    const { setValidador, consultar, listar } = mixin.useComportamiento()
    const { onBeforeGuardar, onGuardado, onBeforeModificar, onReestablecer } =
      mixin.useHooks()
    const store = useAuthenticationStore()
    const { notificarAdvertencia } = useNotificaciones()
    const refArchivoCie = ref()
    const esRecursosHumanos = store.esRecursosHumanos
    const esAutorizador = ref(false)
    const esNuevo = computed(() => {
      return accion.value === 'NUEVO'
    })
    const auxmes = ref()
    onBeforeGuardar(() => {
      /* cie.tieneDocumento =
        refArchivoCie.value.tamanioListado > 0 ? true : false*/
      /*if (!cie.tieneDocumento) {
        notificarAdvertencia('Debe seleccionar al menos un archivo.')
      }*/
    })
    onBeforeModificar(() => {
      cie.tieneDocumento = true
    })
    onGuardado(() => {
      subirArchivos()
      listar()
      // emit('cerrar-modal')
    })
    async function subirArchivos() {
      await refArchivoCie.value.subir()
    }

    const limpiarArchivoCie = () => {
      const archivoCie = refArchivoCie.value
      archivoCie.limpiarListado()
      archivoCie.quiero_subir_archivos = false
      archivoCie.esConsultado = false
      // Realizar cambios en la interfaz de usuario en el siguiente ciclo de renderizado
      requestAnimationFrame(() => {
        archivoCie.quiero_subir_archivos = true
      })
    }

    onReestablecer(() => {
      setTimeout(limpiarArchivoCie, 50)
    })
    //Reglas de validacion
    const reglas = {
      codigo: { required },
      nombre: { required },
    }
    const v$ = useVuelidate(reglas, cie)
    setValidador(v$.value)

    const editarPermiso: CustomActionTable = {
      titulo: ' ',
      icono: 'bi-pencil-square',
      color: 'secondary',
      visible: ({ entidad }) =>
        entidad.empleado !== store.user.id && !esRecursosHumanos,
      accion: ({ entidad }) => {
        accion.value = 'EDITAR'
        consultar(entidad)
      },
    }
    const enviar_masivo = computed(() => {
      return refArchivoCie.value?.quiero_subir_archivos
    })

    return {
      removeAccents,
      mixin,
      cie,
      watchEffect,
      editarPermiso,
      esAutorizador,
      esRecursosHumanos,
      esNuevo,
      refArchivoCie,
      mixinCie,
      endpoint: endpoints.archivo_cie,
      accion,
      maskFecha,
      v$,
      disabled,
      subirArchivos,
      enviar_masivo,
      mostrarBotonSubir: computed(
        () => refArchivoCie.value?.quiero_subir_archivos
      ),
      configuracionColumnas: configuracionColumnasCie,
    }
  },
})
