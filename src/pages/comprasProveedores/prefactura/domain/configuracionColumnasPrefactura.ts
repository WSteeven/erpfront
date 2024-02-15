import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Prefactura } from "./Prefactura";

export const configuracionColumnasPrefactura: ColumnConfig<Prefactura>[] = [
  {
    name: 'id',
    field: 'id',
    label: 'N°',
    align: 'left',
    sortable: true,
  },
  {
    name: 'codigo',
    field: 'codigo',
    label: 'Codigo',
    align: 'left',
    sortable: true,
  },
  {
    name: 'created_at',
    field: 'created_at',
    label: 'Fecha',
    align: 'left',
    sortable: true,
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    style: 'max-width: 300px; overflow: auto;',
    align: 'left',
    sortable: true,
  },
  {
    name: 'solicitante',
    field: 'solicitante',
    label: 'Solicitante',
    align: 'left',
    sortable: true,
  },
  {
    name: 'cliente',
    field: 'cliente',
    label: 'Cliente',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Estado',
    align: 'left',
    sortable: true,
  },
  
]
