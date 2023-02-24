import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Acreditacion } from "./Acreditacion";

export const configuracionColumnasAcreditacion: ColumnConfig<Acreditacion>[] = [
  {
    name: 'fecha',
    field: 'fecha',
    label: 'Fecha Fondo',
    align: 'left',
    sortable: true
  },
  {
    name: 'acreditacion_anterior',
    field: 'acreditacion_anterior',
    label: 'Acreditacion Anterior',
    align: 'left',
    sortable: true
  },
  {
    name: 'acreditacion_depositado',
    field: 'acreditacion_depositado',
    label: 'Acreditacion Depositado',
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
    name: 'acreditacion_actual',
    field: 'acreditacion_actual',
    label: 'Acreditacion Actual',
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
