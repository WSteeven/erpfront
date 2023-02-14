import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Saldo } from "./Saldo";

export const configuracionColumnasSaldo: ColumnConfig<Saldo>[] = [
  {
    name: 'id_saldo',
    field: 'id_saldo',
    label: 'Id Cash',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_saldo_info',
    field: 'tipo_saldo_info',
    label: 'Tipo Saldo',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_fondo_info',
    field: 'tipo_fondo_info',
    label: 'Tipo Fondo',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion_saldo',
    field: 'descripcion_saldo',
    label: 'Descripción',
    align: 'left',
    sortable: true
  },
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
  },
  {
    name: 'estatus_info',
    field: 'estatus_info',
    label: 'Estatus',
    align: 'left',
    sortable: true
  },


]
