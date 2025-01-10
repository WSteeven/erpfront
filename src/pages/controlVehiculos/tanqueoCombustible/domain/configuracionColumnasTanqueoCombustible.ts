import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Tanqueo } from 'vehiculos/tanqueoCombustible/domain/Tanqueo'

export const configuracionColumnasTanqueoCombustible: ColumnConfig<Tanqueo>[] =
  [
    {
      name: 'fecha_hora',
      field: 'fecha_hora',
      label: 'Fecha',
      align: 'left',
      sortable: true,
      visible: true
    },
    {
      name: 'vehiculo',
      field: 'vehiculo',
      label: 'Vehiculo',
      align: 'left',
      sortable: true,
      visible: true
    },
    {
      name: 'solicitante',
      field: 'solicitante',
      label: 'Solicitante',
      align: 'left',
      sortable: true,
      visible: true
    },
    {
      name: 'km_tanqueo',
      field: 'km_tanqueo',
      label: 'Kilometraje',
      align: 'left',
      sortable: true,
      visible: true
    },
    {
      name: 'monto',
      field: 'monto',
      label: 'Monto ($)',
      align: 'left',
      sortable: true,
      visible: true
    },
    {
      name: 'bitacora',
      field: 'bitacora',
      label: 'Bitácora N°',
      align: 'left',
      sortable: true,
      visible: true
    }
  ]
