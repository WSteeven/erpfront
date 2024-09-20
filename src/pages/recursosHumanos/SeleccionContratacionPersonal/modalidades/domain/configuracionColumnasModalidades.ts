import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Modalidad } from "./Modalidad";

export const configuracionColumnasModalidades: ColumnConfig<Modalidad>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'activo',
    field: 'activo',
    label: '¿Activo?',
    align: 'left',
    sortable: true
  },
]
