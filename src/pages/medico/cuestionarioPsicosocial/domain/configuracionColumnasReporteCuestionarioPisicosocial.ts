import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ReporteCuestionarioEmpleado } from "../../reportesCuestionarios/domain/ReporteCuestionarioEmpleado";

export const ConfiguracionColumnasReporteCuestionarioEmpleado: ColumnConfig<ReporteCuestionarioEmpleado>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'finalizado',
    field: 'finalizado',
    label: 'Finalizado',
    align: 'left',
    sortable: true
  },
]
