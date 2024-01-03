import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { AsignarAlimentacion } from "./AsignarAlimentacion";

export const configuracionColumnasAsignarAlimentacion: ColumnConfig<AsignarAlimentacion>[] = [
  {
    name: 'empleados_info',
    field: 'empleados_info',
    label: 'Empleados',
    align: 'left',
    sortable: true
  },
  {
    name: 'valor_minimo',
    field: 'valor_minimo',
    label: 'Valor Minimo',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_corte',
    field: 'fecha_corte',
    label: 'Fecha de Corte',
    align: 'left',
    sortable: true
  },



]
