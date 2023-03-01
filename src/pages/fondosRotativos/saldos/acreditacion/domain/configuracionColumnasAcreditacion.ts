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
    name: 'descripcion_acreditacion',
    field: 'descripcion_acreditacion',
    label: 'Descripcion',
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
    name: 'monto',
    field: 'monto',
    label: 'Monto',
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
