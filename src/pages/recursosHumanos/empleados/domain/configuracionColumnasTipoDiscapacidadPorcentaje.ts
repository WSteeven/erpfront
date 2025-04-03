import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoDiscapacidadPorcentaje } from './TipoDiscapacidadPorcentaje'

export const configuracionColumnasTipoDiscapacidadPorcentaje: ColumnConfig<TipoDiscapacidadPorcentaje>[] = [
  {
    name: 'tipo_discapacidad',
    field: 'tipo_discapacidad',
    label: 'Tipo de discapacidad',
    align: 'left',
    sortable: true,
    editable: true,
    type: 'select',
  },
  {
    name: 'porcentaje',
    field: 'porcentaje',
    label: 'Porcentaje(100%)',
    align: 'left',
    min:0,
    max:100,
    sortable: true,
    editable: true,
    type: 'number',
  },
]
