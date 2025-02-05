import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { Acreditacion } from './Acreditacion';

export const configuracionColumnasAcreditacion: ColumnConfig<Acreditacion>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha Fondo',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion_acreditacion',
    field: 'descripcion_acreditacion',
    label: 'Descripcion',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true
  },{
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo Anulacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'monto',
    field: 'monto',
    label: 'Monto',
    align: 'left',
    sortable: true
  },

  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Usuario',
    align: 'left',
    sortable: true
  }


]
