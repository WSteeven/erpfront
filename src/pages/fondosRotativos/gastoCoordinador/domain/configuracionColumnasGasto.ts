import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { GastoCoordinadores } from './GastoCoordinadores';

export const configuracionColumnasGasto: ColumnConfig<GastoCoordinadores>[] = [
  {
    name: 'fecha_gasto',
    field: 'fecha_gasto',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'lugar_info',
    field: 'lugar_info',
    label: 'Lugar',
    align: 'left',
    sortable: true
  },
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
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
    name: 'motivo_info',
    field: 'motivo_info',
    label: 'Motivo',
    align: 'left',
    sortable: true
  },

  {
    name: 'observacion',
    field: 'observacion',
    label: 'Observacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'revisado',
    field: 'revisado',
    label: 'Revisado',
    align: 'left',
    sortable: true
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true
  },



]
