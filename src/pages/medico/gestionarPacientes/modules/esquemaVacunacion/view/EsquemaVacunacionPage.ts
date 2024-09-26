// Dependencias
import { configuracionColumnasEsquemaVacunacionDetallado } from 'medico/gestionarPacientes/domain/configuracionColumnasEsquemaVacunacionDetallado'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { computed, defineComponent, ref, watch } from 'vue'
import { acciones, maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import { useMedicoStore } from 'stores/medico'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoVacunaController } from '../../tiposVacunas/infraestructure/TipoVacunaController'
import { EsquemaVacunaController } from '../infraestructure/EsquemaVacunaController'
import { EsquemaVacuna } from '../domain/EsquemaVacuna'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  name: 'esquemas_vacunas',
  components: {
    SimpleLayout,
    GestorArchivos,
    EssentialTable,
  },
  emit: ['cerrar-modal', 'modificado'],
  setup(props, { emit }) {
    /**********
     * Stores
     **********/
    const medicoStore = useMedicoStore()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(EsquemaVacuna, new EsquemaVacunaController())
    const { entidad: esquema, listadosAuxiliares, accion, disabled, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar, setValidador } = mixin.useComportamiento()
    const { onReestablecer, onGuardado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        tiposVacunas: new TipoVacunaController()
      })
    })

    /************
     * Variables
     ************/
    const totalDosis = ref(0)
    const habilitarTipoVacuna = ref(true)
    const refArchivo = ref()
    const idEsquema = ref()
    const archivoSubido = ref(false)
    const mostrarEsquema = computed(() => !!listado.value.length && accion.value === acciones.consultar)

    /************
     * Funciones
     ************/
    const { tiposVacunas, filtrarTiposVacunas } = useFiltrosListadosSelects(listadosAuxiliares)

    async function subirArchivos() {
      await refArchivo.value.subir()
      archivoSubido.value = true
    }

    /********
     * Hooks
     ********/
    onReestablecer(() => {
      console.log(mostrarEsquema.value)
      if (mostrarEsquema.value) emit('cerrar-modal')
      refArchivo.value.limpiarListado()
      const stop = watch(archivoSubido, () => {
        stop()
        emit('cerrar-modal')
      })
    })

    onGuardado(async (id, responseData) => {
      idEsquema.value = id

      setTimeout(async () => {
        await subirArchivos()
      }, 1)

      emit('guardado', { esquemaVacuna: responseData.modelo, page: 'EsquemaVacunaPage' })
    })

    /*********
     * Reglas
     *********/
    const reglas = {
      tipo_vacuna: { required },
      fecha: { required },
      responsable_vacunacion: { required },
      establecimiento_salud: { required },
    }

    const v$ = useVuelidate(reglas, esquema)
    setValidador(v$.value)

    /* onModificado(async (id, responseData) => {
      console.log('modificado...')
      idEsquema.value = id
      setTimeout(async () => {
        await subirArchivos()
      }, 1)

      emit('modificado', { esquemaVacuna: responseData.modelo, page: 'EsquemaVacunaPage' })
      // await refArchivo.value.limpiarListado()
      // emit('cerrar-modal')
    }) */

    /*******
     * Init
     *******/
    if (medicoStore.esquemaVacuna) {
      esquema.hydrate(medicoStore.esquemaVacuna)
      esquema.tipo_vacuna = esquema.tipo_vacuna_id

      setTimeout(() => {
        if (esquema.id) refArchivo.value.listarArchivosAlmacenados(esquema.id)
      }, 1);
    }

    esquema.paciente = medicoStore.empleado?.id ?? null
    accion.value = medicoStore.accion
    habilitarTipoVacuna.value = medicoStore.accion === acciones.nuevo

    if (accion.value === acciones.consultar) listar({ paciente_id: medicoStore.empleado?.id, tipo_vacuna_id: medicoStore.idTipoVacuna })
    else listado.value = []

    return {
      v$,
      mixin,
      esquema,
      totalDosis,
      listado,
      tiposVacunas,
      filtrarTiposVacunas,
      accion,
      habilitarTipoVacuna,
      refArchivo,
      idEsquema,
      disabled,
      acciones,
      subirArchivos,
      maskFecha,
      configuracionColumnasEsquemaVacunacionDetallado,
      mostrarEsquema,
    }
  }
})
