import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Comision } from "./Comision";

export const configuracionColumnasComision: ColumnConfig<Comision>[] = [
  {
    name: 'plan_info',
    field: 'plan_info',
    label: 'Plan',
    align: 'left',
    sortable: true
  },
  {
    name: 'forma_pago',
    field: 'forma_pago',
    label: 'Forma Pago',
    align: 'left',
    sortable: true
  },
  {
    name: 'comision',
    field: 'comision',
    label: 'Comision',
    align: 'left',
    sortable: true
  },



]
