import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Saldo } from "./Saldo";

export const configuracionColumnasSaldo: ColumnConfig<Saldo>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha Fondo',
    align: 'left',
    sortable: true
  },
  {
    name: 'saldo_anterior',
    field: 'saldo_anterior',
    label: 'Saldo Anterior',
    align: 'left',
    sortable: true
  },
  {
    name: 'saldo_depositado',
    field: 'saldo_depositado',
    label: 'Saldo Depositado',
    align: 'left',
    sortable: true
  },
  {
    name: 'gasto',
    field: 'gasto',
    label: 'Gasto',
    align: 'left',
    sortable: true
  },
  {
    name: 'saldo_actual',
    field: 'saldo_actual',
    label: 'Saldo Actual',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_inicio',
    field: 'fecha_inicio',
    label: 'Fecha Inicio',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_fin',
    field: 'fecha_fin',
    label: 'Fecha Fin',
    align: 'left',
    sortable: true
  },
  {
    name: 'usuario_info',
    field: 'usuario_info',
    label: 'Usuario',
    align: 'left',
    sortable: true
  }


]
