import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { FichaSocioeconomica } from 'trabajoSocial/fichaSocioeconomica/domain/FichaSocioeconomica'

export const configuracionColumnasFichaSocioeconomica:ColumnConfig<FichaSocioeconomica>[]=[
  {
    name: 'empleado',
    field:'empleado',
    label:'Colaborador',
    align: 'left',
    sortable:true
  },

]
