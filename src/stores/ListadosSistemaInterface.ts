import { TipoEvaluacionMedicaRetiro } from 'medico/gestionarPacientes/modules/fichaAptitud/domain/TipoEvaluacionMedicaRetiro'
import { TipoAptitudMedicaLaboral } from 'medico/gestionarPacientes/modules/fichaAptitud/domain/TipoAptitudMedicaLaboral'

export interface ListadosSistema {
  tiposEvaluacionesMedicasRetiros: TipoEvaluacionMedicaRetiro[],
  tiposAptitudesMedicasLaborales: TipoAptitudMedicaLaboral[],
}
