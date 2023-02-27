import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Notificacion } from "./Notificacion";

export const configuracionColumnasNotificaciones: ColumnConfig<any>[] = [
  {
    name: 'mensaje',
    field: 'mensaje',
    label: 'Notificación',
    align: 'left',
    sortable: true
  },
  {
    name: 'leida',
    field: 'leida',
    label: 'Estado',
    align: 'left',
    sortable: true
  },
  {
    name: 'acciones',
    field: 'acciones',
    label: 'Acciones',
    align: 'left',
    sortable: true
  },

]
