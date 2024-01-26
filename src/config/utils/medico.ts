import { TabOption } from "components/tables/domain/TabOption"

export const tiposProcesosExamenes = {
  INGRESO: 'INGRESO',
  OCUPACIONALES: 'OCUPACIONALES',
  REINGRESO: 'REINGRESO',
  SALIDA: 'SALIDA',
}

export const tabOptionsEstadosExamenes: TabOption[] = [
  { label: 'Pendientes de solicitar', value: '0' },
  { label: 'Solicitado', value: '1' },
  { label: 'Aprobado por compras', value: '2' },
  { label: 'Diagnóstico realizado', value: '3' },
  { label: 'Apertura de ficha médica', value: '4' },
]
