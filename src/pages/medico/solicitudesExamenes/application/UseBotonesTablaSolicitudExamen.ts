import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { SolicitudExamen } from '../domain/SolicitudExamen'
import { Ref } from 'vue'
import { estadosSolicitudesExamenes } from 'config/utils/medico'

export function useBotoncesTablaSolicitudExamen(tabEstadoSolicitudExamen: Ref<string>) {

  const btnAprobar: CustomActionTable<SolicitudExamen> = {
    titulo: 'Aprobar',
    icono: 'bi-cash-coin',
    color: 'positive',
    visible: () => tabEstadoSolicitudExamen.value === estadosSolicitudesExamenes.SOLICITADO.value,
    accion: () => {
      /*medicoStore.accion = acciones.consultar
      const examenesSolicitados: ExamenSolicitado[] = mapearExamenesSolicitados(entidad.examenes_solicitados)

      const solicitudExamen = new SolicitudExamen()
      solicitudExamen.hydrate(entidad)
      solicitudExamen.examenes_solicitados = examenesSolicitados
      medicoStore.solicitudExamen = solicitudExamen
      console.log(examenesSolicitados)
      console.log(solicitudExamen)
      modales.abrirModalEntidad('SolicitudExamenSolicitarPage')*/
    }
  }

  return {
    btnAprobar,
  }
}
