import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PagoComision } from './PagoComision'

export const configuracionColumnasPagoComision: ColumnConfig<PagoComision>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Corte',
    align: 'left',
    sortable: false
  },
  {
    name: 'fecha_inicio',
    field: 'fecha_inicio',
    label: 'Fecha de Inicio',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_fin',
    field: 'fecha_fin',
    label: 'Fecha de Inicio',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
]
