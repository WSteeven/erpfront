import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import Coordenada from './Coordenada'

export const configuracionColumnasCoordenadas: ColumnConfig<Coordenada>[] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: false,
    visible: false, visibleModal:false
  },
  {
    name: 'tipo',
    label: 'Tipo',
    field: 'tipo',
    align: 'left',
    type: 'select',
    sortable: false,
    visible: true,
    requerido: true
  },

  {
    name: 'nombre',
    label: 'Nombre',
    field: 'nombre',
    align: 'left',
    requerido: true,
    sortable: false,
    visible: true
  },
  {
    name: 'latitud',
    label: 'Latitud',
    field: 'latitud',
    align: 'left',
    type: 'number',
    sortable: false,
    visible: true
  },
  {
    name: 'longitud',
    label: 'Longitud',
    field: 'longitud',
    align: 'left',
    type: 'number',
    sortable: false,
    visible: true
  },
  {
    name: 'direccion',
    label: 'Dirección',
    field: 'direccion',
    align: 'left',
    sortable: false,
    visible: true
  },
  {
    name: 'observacion',
    label: 'Observación',
    field: 'observacion',
    align: 'left',
    sortable: false,
    visible: true
  }
]
