import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { SolicitudVacacion } from './SolicitudVacacion'

export const configuracionColumnasSolicitudVacacion: ColumnConfig<SolicitudVacacion>[] =
  [
    {
      name: 'empleado',
      field: 'empleado',
      label: 'Empleado',
      align: 'left',
      sortable: true
    },
    {
      name: 'periodo',
      field: 'periodo',
      label: 'Periodo',
      align: 'left',
      sortable: true
    },
    {
      name: 'autorizador',
      field: 'autorizador',
      label: 'Autoriza',
      align: 'left'
    },
    {
      name: 'fecha_inicio',
      field: 'fecha_inicio',
      label: 'Fecha Inicio',
      align: 'left',
      sortable: true
    },
    {
      name: 'fecha_fin',
      field: 'fecha_fin',
      label: 'Fecha Fin',
      align: 'left',
      sortable: true
    },
    {
      name: 'autorizacion',
      field: 'autorizacion',
      label: 'Estado',
      align: 'left',
      sortable: true
    }
  ]
