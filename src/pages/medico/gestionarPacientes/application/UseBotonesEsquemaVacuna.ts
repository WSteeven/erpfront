// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'

// Logica y controladores
import { ComportamientoModalesGestionPaciente } from './ComportamientoModalesGestionPaciente'
import { EsquemaVacuna } from '../modules/esquemaVacunacion/domain/EsquemaVacuna'

export function useBotonesEsquemaVacuna(modales: ComportamientoModalesGestionPaciente, listadosAuxiliares) {
  /*********
   * Stores
   *********/
  const medicoStore = useMedicoStore()

  /**************
   * Referencias
   **************/
  // const vacunasRealizadas: Ref<EsquemaVacuna[]> = ref([])
  // const { notificarAdvertencia } = useNotificaciones()

  /*********
   * Header
   *********/
  const btnAgregarVacunaAplicada: CustomActionTable<EsquemaVacuna> = {
    titulo: 'Agregar vacuna aplicada',
    icono: 'bi-plus-circle',
    color: 'positive',
    accion: async () => {
      medicoStore.accion = acciones.nuevo
      medicoStore.esquemaVacuna = undefined
      medicoStore.tiposVacunasYaRealizadosPaciente = listadosAuxiliares.esquemasVacunas.map((esquema: EsquemaVacuna) => esquema.tipo_vacuna_id)
      modales.abrirModalEntidad('EsquemaVacunacionPage')
    }
  }

  /*******
   * Body
   *******/
  const btnEditarVacunaAplicada: CustomActionTable<EsquemaVacuna> = {
    titulo: 'Consultar dosis aplicadas',
    icono: 'bi-table',
    color: 'primary',
    accion: ({ entidad }) => {
      medicoStore.accion = acciones.consultar
      // medicoStore.esquemaVacuna = entidad
      medicoStore.idTipoVacuna = entidad.tipo_vacuna_id
      modales.abrirModalEntidad('EsquemaVacunacionPage')
    }
  }

  return {
    btnAgregarVacunaAplicada,
    btnEditarVacunaAplicada,
  }
}
