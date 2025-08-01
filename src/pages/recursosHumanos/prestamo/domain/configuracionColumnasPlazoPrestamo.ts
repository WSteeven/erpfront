import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PlazoPrestamo } from './PlazoPrestamo'

export const configuracionColumnasPlazoPrestamo: ColumnConfig<PlazoPrestamo>[] = [
    {
        name: 'num_cuota',
        field: 'num_cuota',
        label: 'Número de Cuota',
        align: 'left',
        sortable: true
    },
    {
      name: 'fecha_vencimiento',
      field: 'fecha_vencimiento',
      label: 'Fecha de Vencimiento',
      align: 'left',
      sortable: true
  },
    {
      name: 'fecha_pago',
      field: 'fecha_pago',
      label: 'Fecha de Pago',
      align: 'left',
      sortable: true
  },
  {
    name: 'valor_cuota',
    field: 'valor_cuota',
    label: 'Valor Cuota',
    align: 'left',
    sortable: true
},
{
  name: 'valor_pagado',
  field: 'valor_pagado',
  label: 'Valor Pagado',
  align: 'left',
  sortable: true
},
  {
    name: 'valor_a_pagar',
    field: 'valor_a_pagar',
    label: 'Valor a Pagar',
    align: 'left',
    sortable: true
},
{
  name: 'comentario',
  field: 'comentario',
  label: 'Comentario',
  align: 'left',
  sortable: true
},
  {
  name: 'pago_cuota',
  field: 'pago_cuota',
  label: 'Pago',
  align: 'left',
  sortable: true
},


]
