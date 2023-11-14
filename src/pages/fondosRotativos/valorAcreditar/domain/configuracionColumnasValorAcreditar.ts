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
    name: 'umbral_empleado',
    field: 'umbral_empleado',
    label: 'Umbral Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'saldo_empleado',
    field: 'saldo_empleado',
    label: 'Saldo Empleado',
    align: 'left',
    sortable: true
  },

  {
    name: 'monto_generado',
    field: 'monto_generado',
    label: 'Monto Generado',
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
