import { ColumnConfig } from "components/tables/domain/ColumnConfig"
import { Proveedor } from "./Proveedor"

export const configuracionColumnasProveedores: ColumnConfig<Proveedor>[]=[
  {
    name: 'razon_social',
    field: 'razon_social',
    label: 'Razón Social',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sucursal',
    field: 'sucursal',
    label: 'Sucursal',
    align: 'left',
    sortable: true,
  },
  {
    name: 'ubicacion',
    field: 'ubicacion',
    label: 'Ubicación física',
    align: 'left',
    sortable: true,
  },
  {
    name: 'direccion',
    field: 'direccion',
    label: 'Direccion',
    align: 'left',
    sortable: true,
  },
  {
    name: 'estado',
    field: 'estado',
    label: 'Activo',
    align: 'left',
    sortable: true,
  },
]
