import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RegistroProgresiva } from './RegistroProgresiva'

export const configuracionColumnasControlProgresivas: ColumnConfig<RegistroProgresiva>[] =
  [
    {
      name: 'numero_poste',
      field: 'numero_poste',
      label: 'Núm. Elem',
      align: 'left',
      sortable: true,
    },
    {
      name: 'tipo_elemento',
      field: 'tipo_elemento',
      label: 'Tipo elemento',
      align: 'left',
      sortable: true,
    },
    {
      name: 'propietario_elemento',
      field: 'propietario_elemento',
      label: 'Propietario',
      align: 'left',
      sortable: true,
    },
    {
      name: 'progresiva_entrada',
      field: 'progresiva_entrada',
      label: 'Progresiva entrada',
      align: 'left',
      sortable: true,
    },
    {
      name: 'progresiva_salida',
      field: 'progresiva_salida',
      label: 'Progresiva salida',
      align: 'left',
      sortable: true,
    },
    {
      name: 'reserva',
      field: 'reserva',
      label: 'Reserva',
      align: 'left',
      sortable: true,
    },
  ]
