import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Hijo } from 'trabajoSocial/fichaSocioeconomica/domain/Hijo'

export const configuracionColumnasHijos: ColumnConfig<Hijo>[]=[
  {
    name: 'nombres_apellidos',
    field:'nombres_apellidos',
    label:'Nombres y Apellidos',

    align: 'left',
    editable:true,
    sortable:true
  },
  {
    name: 'ocupacion',
    field:'ocupacion',
    label:'Ocupación',
    align: 'left',
    sortable:true,
    editable:true,
  },
  {
    name: 'edad',
    field:'edad',
    label:'Edad',
    align: 'left',
    type:'number',
    min:0,
    editable:true,
    sortable:true
  },
]
