// Dependencias
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { computed, defineComponent, ref, watch, watchEffect } from 'vue'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'

// Componentes
import SimpleLayout from 'src/shared/contenedor/modules/simple/view/SimpleLayout.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoVacunaController } from '../../tiposVacunas/infraestructure/TipoVacunaController'
import { EsquemaVacunaController } from '../infraestructure/EsquemaVacunaController'
import { TipoVacuna } from '../../tiposVacunas/domain/TipoVacuna'
import { EsquemaVacuna } from '../domain/EsquemaVacuna'

export default defineComponent({
  name: 'esquemas_vacunas',
  components: {
    SimpleLayout,
    GestorArchivos,
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
    const { entidad: esquema, listadosAuxiliares, accion, disabled } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar, consultar } = mixin.useComportamiento()
    const { onReestablecer, onModificado, onGuardado, onConsultado } = mixin.useHooks()

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

    /************
     * Funciones
     ************/
    const { tiposVacunas, filtrarTiposVacunas } = useFiltrosListadosSelects(listadosAuxiliares)

    const seleccionarTipoVacuna = (idTipoVacuna: number) => {
      const tipoVacuna = listadosAuxiliares.tiposVacunas.find((tipo: TipoVacuna) => tipo.id === idTipoVacuna)
      console.log(tipoVacuna)
      totalDosis.value = tipoVacuna.dosis_totales ?? 0
      console.log(totalDosis.value)
      console.log(tipoVacuna.dosis_totales)
    }

    const quitarTiposVacunasYaRealizados = () => {
      if (habilitarTipoVacuna.value) {
        let indicesAEliminar = listadosAuxiliares.tiposVacunas
          .map((tipoVacuna: TipoVacuna, index) => (tipoVacuna.id && medicoStore.tiposVacunasYaRealizadosPaciente.includes(tipoVacuna.id) ? index : -1))
          .filter((index) => index !== -1)

        const array = listadosAuxiliares.tiposVacunas.filter((_, index) => !indicesAEliminar.includes(index))
        listadosAuxiliares.tiposVacunas = array
      }
    }

    async function subirArchivos() {
      await refArchivo.value.subir()
      archivoSubido.value = true
    }

    /********
     * Hooks
     ********/
    onReestablecer(() => {
      refArchivo.value.limpiarListado()
      const stop = watch(archivoSubido, () => {
        stop()
        emit('cerrar-modal')
      })
    })

    onGuardado(async (id, responseData) => {
      console.log('guardado...')
      idEsquema.value = id
      setTimeout(async () => {
        await subirArchivos()
      }, 1)

      emit('guardado', { esquemaVacuna: responseData.modelo, page: 'EsquemaVacunaPage' })

      // await refArchivo.value.limpiarListado()
      // emit('cerrar-modal')
    })

    onModificado(async (id, responseData) => {
      console.log('modificado...')
      idEsquema.value = id
      setTimeout(async () => {
        await subirArchivos()
      }, 1)

      emit('modificado', { esquemaVacuna: responseData.modelo, page: 'EsquemaVacunaPage' })
      // await refArchivo.value.limpiarListado()
      // emit('cerrar-modal')
    })

    /*******
     * Init
     *******/
    if (medicoStore.esquemaVacuna) {
      esquema.hydrate(medicoStore.esquemaVacuna)
      esquema.tipo_vacuna = esquema.tipo_vacuna_id

      setTimeout(() => {
        refArchivo.value.listarArchivosAlmacenados(esquema.id)
      }, 1);
    }

    const stop = watchEffect(() => {
      if (esquema.tipo_vacuna_id && listadosAuxiliares.tiposVacunas.length) {
        seleccionarTipoVacuna(esquema.tipo_vacuna_id)
        quitarTiposVacunasYaRealizados()
        stop()
      }
    })

    const stopTipoVacuna = watchEffect(() => {
      if (listadosAuxiliares.tiposVacunas.length) {
        quitarTiposVacunasYaRealizados()
        stopTipoVacuna()
      }
    })

    esquema.paciente = medicoStore.empleado?.id ?? null
    accion.value = medicoStore.accion
    habilitarTipoVacuna.value = medicoStore.accion === acciones.nuevo


    return {
      mixin,
      esquema,
      totalDosis,
      seleccionarTipoVacuna,
      tiposVacunas,
      filtrarTiposVacunas,
      accion,
      habilitarTipoVacuna,
      refArchivo,
      idEsquema,
      disabled,
      acciones,
      subirArchivos,
    }
  }
})
