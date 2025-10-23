import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { TipoActividad } from 'pages/conecel/GestionTareas/tiposActividades/domain/TipoActividad'

export const configuracionColumnasTiposActividades: ColumnConfig<TipoActividad>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Actividad',
      align: 'left',
      sortable: true
    },{
      name: 'activo',
      field: 'activo',
      label: '¿Activo?',
      align: 'left',
      sortable: true
    }
  ]
