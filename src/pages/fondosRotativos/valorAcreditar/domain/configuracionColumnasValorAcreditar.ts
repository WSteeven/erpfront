import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ValorAcreditar } from "./ValorAcreditar";

export const configuracionColumnasValorAcreditar: ColumnConfig<ValorAcreditar>[] = [
  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'monto_generado',
    field: 'monto_generado',
    label: 'Monto Generad',
    align: 'left',
    sortable: true
  },
  {
    name: 'monto_modificado',
    field: 'monto_modificado',
    label: 'Monto Modificado',
    align: 'left',
    sortable: true
  },



]
