import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Etapa } from './Etapa'


export const configuracionColumnasEtapa: ColumnConfig<Etapa>[] = [
  {
    name: 'codigo_proyecto',
    field: 'codigo_proyecto',
    label: 'Código proyecto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true,
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'left',
    sortable: true,
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Etapa activa',
    type: 'toggle',
    align: 'left',
    sortable: true,
  },
]
