import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Proyecto } from './Proyecto'

export const configuracionColumnasProyecto: ColumnConfig<Proyecto>[] = [
  {
    name: 'codigo_proyecto',
    field: 'codigo_proyecto',
    label: 'Código proyecto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente corporativo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre de proyecto',
    align: 'left',
    sortable: true,
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Cantón',
    align: 'left',
    sortable: true,
  },
  {
    name: 'coordinador',
    field: 'coordinador',
    label: 'Coordinador',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_inicio',
    field: 'fecha_inicio',
    label: 'Fecha inicio',
    align: 'left',
    sortable: true,
  },
  {
    name: 'fecha_fin',
    field: 'fecha_fin',
    label: 'Fecha fin',
    align: 'left',
    sortable: true,
  },
  {
    name: 'demora',
    field: 'demora',
    label: 'Demora',
    align: 'left',
  },
  {
    name: 'finalizado',
    field: 'finalizado',
    label: 'Finalizado',
    align: 'left',
  },
]
