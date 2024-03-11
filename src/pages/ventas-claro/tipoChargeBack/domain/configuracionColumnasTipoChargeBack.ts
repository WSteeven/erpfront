import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { TipoChargeBack } from "./TipoChargeBack";

export const configuracionColumnasTipoChargeBack: ColumnConfig<TipoChargeBack>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },



]
