import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { VisitaDomiciliaria } from 'trabajoSocial/visitaDomiciliaria/domain/VisitaDomiciliaria'

export const configuracionColumnasVisitaDomiciliaria: ColumnConfig<VisitaDomiciliaria>[]=[
  {
    name: 'empleado',
    field:'empleado',
    label:'Colaborador',
    align: 'left',
    sortable:true
  },

]
