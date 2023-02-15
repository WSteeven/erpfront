import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { GrupoSeleccionado } from './GrupoSeleccionado'

export const configuracionColumnasGrupoSeleccionado: ColumnConfig<GrupoSeleccionado>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
  },
  {
    name: 'responsable',
    field: 'responsable',
    label: 'Responsable',
    align: 'center',
  },
]
