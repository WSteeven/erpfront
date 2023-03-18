import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { GastoCoordinadores } from "./GastoCoordinadores";

export const configuracionColumnasGasto: ColumnConfig<GastoCoordinadores>[] = [
  {
    name: 'fecha_gasto',
    field: 'fecha_gasto',
    label: 'Fecha',
    align: 'left',
    sortable: true
  },
  {
    name: 'aut_especial_user',
    field: 'aut_especial_user',
    label: 'Autorización Especial',
    align: 'left',
    sortable: true
  },
  {
    name: 'motivo',
    field: 'motivo',
    label: 'Motivo',
    align: 'left',
    sortable: true
  },

  {
    name: 'estado_info',
    field: 'estado_info',
    label: 'Estado	',
    align: 'left',
    sortable: true
  },
  {
    name: 'detalle_estado',
    field: 'detalle_estado',
    label: 'Detalle Estado',
    align: 'left',
    sortable: true
  },

]
