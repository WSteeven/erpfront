import { TabOption } from 'src/components/tables/domain/TabOption'

export const aniosExperiencia = [
  '3 meses',
  '6 meses',
  '1 año',
  '2 años',
  '3 años',
  '4 años',
  '5 años',
  '10 años',
  '15 años',
]


export const tabOptionsSolicitudesPersonal: TabOption[] = [
  { value: '1', label: 'PENDIENTES', },
  { value: '2', label: 'APROBADAS', },
  { value: '3', label: 'CANCELADAS', },
  { value: '4', label: 'PUBLICADAS', },
]


export const opcionesTablaVacantes = {
  inactivas: 'INACTIVAS',
  publicadas: 'PUBLICADAS',
  vigentes: 'VIGENTES',
  expiradas: 'EXPIRADAS',
}

export const tabOptionsVacantes: TabOption[] = [
  { value: opcionesTablaVacantes.publicadas, label: opcionesTablaVacantes.publicadas },
  { value: opcionesTablaVacantes.inactivas, label: opcionesTablaVacantes.inactivas },
  { value: opcionesTablaVacantes.vigentes, label:  opcionesTablaVacantes.vigentes },
  { value: opcionesTablaVacantes.expiradas, label: opcionesTablaVacantes.expiradas },
]
