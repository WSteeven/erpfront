import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RegistroTendido } from '../modules/registrosTendidos/domain/RegistroTendido'

export const configuracionColumnasControlTendido: ColumnConfig<RegistroTendido>[] =
  [
    {
      name: 'numero_elemento',
      field: 'numero_elemento',
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
      name: 'cantidad_reserva',
      field: 'cantidad_reserva',
      label: 'Reserva (m)',
      align: 'left',
      sortable: true,
    },
  ]
