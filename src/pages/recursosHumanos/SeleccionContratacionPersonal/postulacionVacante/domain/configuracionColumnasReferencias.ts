import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ReferenciaPersonal } from "./ReferenciaPersonal";

export const configuracionColumnasReferencias: ColumnConfig<ReferenciaPersonal>[] = [
  {
    name: "nombres_apellidos",
    field: "nombres_apellidos",
    label: "Nombres y Apellidos",
    align: "left",
    editable: true,
    sortable: true
  },
  {
    name: "cargo",
    field: "cargo",
    label: "Cargo o Rol",
    align: "left",
    editable: true,
    sortable: true,
  },
  {
    name: "telefono",
    field: "telefono",
    label: "telefono",
    align: "left",
    sortable: true,
    editable: true,
  },
  {
    name: "correo",
    field: "correo",
    label: "Correo",
    align: "left",
    sortable: true,
    editable: true
  },
  // {
  //   name: "archivo_adjunto",
  //   field: "archivo_adjunto",
  //   label: "Archivo Adjunto",
  //   align: "left",
  //   sortable: true,
  //   editable: true,
  //   type: "file",
  //   placeholder: 'Opcional',
  //   accept: ".pdf",
  //   style:"max-width:300px"
  // },
]
