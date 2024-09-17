import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Vacante } from './Vacante';

export const configuracionColumnasVacante: ColumnConfig<Vacante>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre de Puesto',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_puesto',
    field: 'tipo_puesto',
    label: 'Tipo de Puesto',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_caducidad',
    field: 'fecha_caducidad',
    label: 'F. Caducidad de Publicación',
    align: 'left',
    sortable: true
  },
  {
    name: 'numero_postulantes',
    field: 'numero_postulantes',
    label: 'Cant. Postulantes',
    align: 'center',
    sortable: true
  },
  {
    name: 'postulantes_preseleccionados',
    field: 'postulantes_preseleccionados',
    label: 'Preseleccionados',
    align: 'center',
    sortable: true
  },
]
