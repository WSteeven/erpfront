import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Modalidad } from "./Modalidad";

export const configuracionColumnasModalidad: ColumnConfig<Modalidad>[] = [
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'umbral_minimo',
    field: 'umbral_minimo',
    label: 'Umbral Minimo',
    align: 'left',
    sortable: true
  },



]
