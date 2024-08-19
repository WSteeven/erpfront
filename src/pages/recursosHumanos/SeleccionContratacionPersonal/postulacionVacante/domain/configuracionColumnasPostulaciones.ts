import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Postulacion } from "./Postulacion";

export const configuracionColumnasPostulaciones: ColumnConfig<Postulacion>[]=[
  {
    name: "created_at",
    field: "created_at",
    label: "F. Postulación",
    align: "left",
    sortable: true
  },
  {
    name: "nombre",
    field: "nombre",
    label: "Vacante",
    align: "left",
    sortable: true
  },
  {
    name: "nombres_apellidos",
    field: "nombres_apellidos",
    label: "Nombres y Apellidos",
    align: "left",
    sortable: true
  },
  {
    name: "tengo_conocimientos_requeridos",
    field: "tengo_conocimientos_requeridos",
    label: "Conocimientos",
    align: "left",
    sortable: true
  },
  {
    name: "tengo_experiencia_requerida",
    field: "tengo_experiencia_requerida",
    label: "Experiencia",
    align: "left",
    sortable: true
  },
  {
    name: "tengo_licencia_conducir",
    field: "tengo_licencia_conducir",
    label: "Licencia Conducir",
    align: "left",
    sortable: true
  },
  {
    name: "estado",
    field: "estado",
    label: "Estado",
    align: "left",
    sortable: true
  },

]
