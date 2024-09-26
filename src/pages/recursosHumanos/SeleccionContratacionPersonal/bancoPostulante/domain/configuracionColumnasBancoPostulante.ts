import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { BancoPostulante } from './BancoPostulante';

export const configuracionColumnasBancoPostulante: ColumnConfig<BancoPostulante>[] = [
  {
    name: 'created_at',
    field: 'created_at',
    label: 'F. Postulación',
    align: 'left',
    sortable: true
  },
  {
    name: 'nombres_apellidos',
    field: 'nombres_apellidos',
    label: 'Candidato',
    align: 'left',
    sortable: true
  },
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
    sortable: true
  },
  {
    name: 'puntuacion',
    field: 'puntuacion',
    label: 'Afinidad',
    align: 'left',
    sortable: true
  },
  {
    name: 'fue_contactado',
    field: 'fue_contactado',
    label: 'N° veces Contactado',
    align: 'center',
    sortable: true
  },
  // {
  //   name: 'descartado',
  //   field: 'descartado',
  //   label: 'Descartado',
  //   align: 'center',
  //   sortable: true
  // },

]
