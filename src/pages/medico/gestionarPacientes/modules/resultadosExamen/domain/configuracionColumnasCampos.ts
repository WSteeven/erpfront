import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ConfiguracionExamenCampo } from './ConfiguracionExamenCampo'

export const configuracionColumnasCampos: ColumnConfig<ConfiguracionExamenCampo>[] = [
  {
    name: 'campo',
    field: 'campo',
    label: 'Campo',
    align: 'left',
    sortable: true
  },
  {
    name: 'resultado',
    field: 'resultado',
    label: 'Resultado',
    type: 'number',
    align: 'left',
    sortable: true,
    editable: true,
  },
  {
    name: 'unidad_medida',
    field: 'unidad_medida',
    label: 'Unidad medida',
    align: 'left',
    sortable: true
  },
  {
    name: 'rango_inferior',
    field: 'rango_inferior',
    label: 'Rango inferior',
    align: 'left',
    sortable: true
  },
  {
    name: 'rango_superior',
    field: 'rango_superior',
    label: 'Rango superior',
    align: 'left',
    sortable: true
  },
]
