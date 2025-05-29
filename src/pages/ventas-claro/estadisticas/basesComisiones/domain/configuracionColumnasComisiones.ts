import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Comision } from 'pages/ventas-claro/estadisticas/basesComisiones/domain/Comision'

export const configuracionColumnasComisiones: ColumnConfig<Comision>[] = [
  {
    name: 'desde',
    field: 'desde',
    label: 'Desde',
    align: 'left',
    type: 'number',
    editable: true
  },
  {
    name: 'hasta',
    field: 'hasta',
    label: 'Hasta',
    align: 'left',
    type: 'number',
    editable: true
  },
  {
    name: 'comision',
    field: 'comision',
    label: 'Comisión (% TB)',
    type: 'number',
    align: 'left',
    editable: true
  }
]
