// Dependencias
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificaciones } from 'shared/notificaciones'
import { useMedicoStore } from 'stores/medico'
import { acciones } from 'config/utils'
import { Ref, ref } from 'vue'

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
  const vacunasRealizadas: Ref<EsquemaVacuna[]> = ref([])
  const { notificarAdvertencia } = useNotificaciones()

  /*********
   * Header
   *********/
  const btnAgregarVacunaAplicada: CustomActionTable<EsquemaVacuna> = {
    titulo: 'Agregar vacuna aplicada',
    icono: 'bi-plus',
    color: 'blue-grey',
    accion: async () => {
      medicoStore.accion = acciones.nuevo
      medicoStore.esquemaVacuna
      medicoStore.tiposVacunasYaRealizadosPaciente = listadosAuxiliares.esquemasVacunas.map((esquema: EsquemaVacuna) => esquema.tipo_vacuna_id)
      modales.abrirModalEntidad('EsquemaVacunacionPage')
    }
  }

  /*******
   * Body
   *******/
  const btnEditarVacunaAplicada: CustomActionTable<EsquemaVacuna> = {
    titulo: 'Editar vacuna aplicada',
    icono: 'bi-pencil-square',
    color: 'blue-grey',
    accion: ({ entidad }) => {
      medicoStore.accion = acciones.editar
      medicoStore.esquemaVacuna = entidad
      modales.abrirModalEntidad('EsquemaVacunacionPage')
    }
  }

  return {
    btnAgregarVacunaAplicada,
    btnEditarVacunaAplicada,
  }
}
