import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { CuotaDescuento } from 'recursosHumanos/descuentos/domain/CuotaDescuento'

export const configuracionColumnasCuotasDescuento: ColumnConfig<CuotaDescuento>[]=[
  {
    name: 'num_cuota',
    field: 'num_cuota',
    label: 'Número de Cuota',
    align: 'left',
    sortable: true
  },
  {
    name: 'mes_vencimiento',
    field: 'mes_vencimiento',
    label: 'Mes de Vencimiento',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor_cuota',
    field: 'valor_cuota',
    label: 'Valor de Cuota',
    align: 'left',
    sortable: true
  },
  {
    name: 'pagada',
    field: 'pagada',
    label: 'pagada',
    align: 'center',
    sortable: true
  },
  {
    name: 'comentario',
    field: 'comentario',
    label: 'Comentario',
    align: 'left',
    sortable: true
  },
]
