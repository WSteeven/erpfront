import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { OrdenCompra } from "./OrdenCompra";

export const configuracionColumnasOrdenesCompras : ColumnConfig<OrdenCompra>[]=[
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fecha',
        field: 'fecha',
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
        name: 'proveedor',
        field: 'proveedor',
        label: 'Proveedor',
        align: 'left',
        sortable: true,
      },
      {
        name: 'autorizador',
        field: 'autorizador',
        label: 'Autorizador',
        align: 'left',
        sortable: true,
      },
      {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Autorización',
        align: 'left',
        sortable: true,
      },
] 