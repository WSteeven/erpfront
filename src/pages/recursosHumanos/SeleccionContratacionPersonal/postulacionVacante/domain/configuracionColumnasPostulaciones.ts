import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Postulacion } from "./Postulacion";

export const configuracionColumnasPostulaciones: ColumnConfig<Postulacion>[]=[
  {
    name: "nombre",
    field: "nombre",
    label: "Vacante",
    align: "left",
    sortable: true
  },
  {
    name: "nombres",
    field: "nombres",
    label: "Nombre",
    align: "left",
    sortable: true
  },
  {
    name: "apellidos",
    field: "apellidos",
    label: "Apellido",
    align: "left",
    sortable: true
  },

]
