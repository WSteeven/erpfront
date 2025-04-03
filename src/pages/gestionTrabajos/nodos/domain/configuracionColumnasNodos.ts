import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Nodo } from 'gestionTrabajos/nodos/domain/Nodo'

export const configuracionColumnasNodos: ColumnConfig<Nodo>[]=[
  {
    name: 'nombre',
    field:'nombre',
    label:'Nombre',
    align: 'left',
    sortable:true
  },
  {
    name: 'coordinador',
    field:'coordinador',
    label:'Coordinador',
    align: 'left',
    sortable:true
  },
  {
    name: 'grupos',
    field:'grupos',
    label:'Grupo/s',
    align: 'left',
    sortable:true
  },
  {
    name: 'activo',
    field:'activo',
    label:'Estado',
    align: 'left',
    sortable:true
  },
]
