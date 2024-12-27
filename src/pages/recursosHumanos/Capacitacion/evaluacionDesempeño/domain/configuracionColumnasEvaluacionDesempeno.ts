import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { EvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/domain/EvaluacionDesempeno'

export const configuracionColumnasEvaluacionDesempeno: ColumnConfig<EvaluacionDesempeno>[] =
  [
    {
      name: 'evaluado',
      field: 'evaluado',
      label: 'Empleado Evaluado',
      align: 'left',
      sortable: true
    },
    {
      name: 'evaluador',
      field: 'evaluador',
      label: 'Empleado Evaluador',
      align: 'left',
      sortable: true
    },
    {
      name: 'formulario',
      field: 'formulario',
      label: 'Formulario',
      align: 'left',
      sortable: true
    },
    {
      name: 'calificacion',
      field: 'calificacion',
      label: 'Calificación',
      align: 'left',
      sortable: true
    }
  ]
