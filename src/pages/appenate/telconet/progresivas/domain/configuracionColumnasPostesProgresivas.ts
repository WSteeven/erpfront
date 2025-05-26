import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RegistroProgresiva } from 'pages/appenate/telconet/progresivas/domain/RegistroProgresiva'

export const configuracionColumnasPostesProgresivas: ColumnConfig<RegistroProgresiva>[] =
  [
    {
      name: 'num_elemento',
      field: 'num_elemento',
      label: 'N° Elemento',
      align: 'left',
      sortable: true
    },
    {
      name: 'propietario',
      field: 'propietario',
      label: 'Propietario',
      align: 'left',
      sortable: true
    },
    {
      name: 'tipo_poste',
      field: 'tipo_poste',
      label: 'T. Poste',
      align: 'left',
      sortable: true
    },
    {
      name: 'material_poste',
      field: 'material_poste',
      label: 'Material',
      align: 'left',
      sortable: true
    },
    {
      name: 'ubicacion_gps',
      field: 'ubicacion_gps',
      label: 'Coordenadas',
      align: 'left',
      sortable: true
    },
    {
      name: 'materiales',
      field: 'materiales',
      label: 'Materiales',
      align: 'left',
      sortable: true
    }
  ]
