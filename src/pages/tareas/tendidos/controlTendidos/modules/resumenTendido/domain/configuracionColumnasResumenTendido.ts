import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ResumenTendido } from './ResumenTendido'

export const configuracionColumnasResumenTendido: ColumnConfig<ResumenTendido>[] = [
  {
    name: 'numero_elemento',
    field: 'numero_elemento',
    label: 'N°',
    sortable: true,
  },
  {
    name: 'tipo_elemento',
    field: 'tipo_elemento',
    label: 'Tipo elemento',
    align: 'left',
  },
  {
    name: 'propietario_elemento',
    field: 'propietario_elemento',
    label: 'Propietario',
    align: 'left',
  },
  {
    name: 'codigo_elemento',
    field: 'codigo_elemento',
    label: 'Código del elemento',
    align: 'left',
  },
  {
    name: 'estado_elemento',
    field: 'estado_elemento',
    label: 'Estado del elemento',
    align: 'left',
  },
  {
    name: 'coordenada_del_elemento_latitud',
    field: 'coordenada_del_elemento_latitud',
    label: 'Coordenada del elemento (latitud)',
    align: 'left',
  },
  {
    name: 'coordenada_del_elemento_longitud',
    field: 'coordenada_del_elemento_longitud',
    label: 'Coordenada del elemento (longitud)',
    align: 'left',
  },
  {
    name: 'progresiva_entrada',
    field: 'progresiva_entrada',
    label: 'Progresiva de entrada',
    align: 'left',
  },
  {
    name: 'progresiva_salida',
    field: 'progresiva_salida',
    label: 'Progresiva de salida',
    align: 'left',
  },
  {
    name: 'cantidad_reserva',
    field: 'cantidad_reserva',
    label: 'Reserva (m)',
    align: 'left',
  },
  {
    name: 'cantidad_transformadores',
    field: 'cantidad_transformadores',
    label: 'Cantidad transformadores',
    align: 'left',
  },
  {
    name: 'cantidad_retenidas',
    field: 'cantidad_retenidas',
    label: 'Cantidad retenidas',
    align: 'left',
  },
  {
    name: 'instalo_manga',
    field: 'instalo_manga',
    label: 'Instaló manga',
    align: 'left',
  },
  {
    name: 'observaciones',
    field: 'observaciones',
    label: 'Observaciones',
    align: 'left',
  },
  {
    name: 'tension',
    field: 'tension',
    label: 'Tensión',
    align: 'left',
  },
  {
    name: 'coordenada_cruce_americano_longitud',
    field: 'coordenada_cruce_americano_longitud',
    label: 'Coordenada cruce americano (longitud)',
    align: 'left',
  },
  {
    name: 'coordenada_cruce_americano_latitud',
    field: 'coordenada_cruce_americano_latitud',
    label: 'Coordenada cruce americano (latitud)',
    align: 'left',
  },
  // ---
  {
    name: 'coordenada_poste_anclaje1_longitud',
    field: 'coordenada_poste_anclaje1_longitud',
    label: 'Coordenada poste anclaje1 (longitud)',
    align: 'left',
  },
  {
    name: 'coordenada_poste_anclaje1_latitud',
    field: 'coordenada_poste_anclaje1_latitud',
    label: 'Coordenada poste anclaje1 (latitud)',
    align: 'left',
  },
  // ---
  {
    name: 'coordenada_poste_anclaje2_longitud',
    field: 'coordenada_poste_anclaje2_longitud',
    label: 'Coordenada poste anclaje2 (longitud)',
    align: 'left',
  },
  {
    name: 'coordenada_poste_anclaje2_latitud',
    field: 'coordenada_poste_anclaje2_latitud',
    label: 'Coordenada poste anclaje2 (latitud)',
    align: 'left',
  },
  // ---
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha y hora',
    align: 'left',
  },
]

