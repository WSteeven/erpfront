import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { ContactoProveedor } from "./ContactoProveedor";
import { opciones_tipo_contacto } from "config/utils_compras_proveedores";

export const configuracionColumnasContactosProveedores: ColumnConfig<ContactoProveedor>[]=[
  {
    name: 'nombres',
    field: 'nombres',
    label: 'Nombres',
    align: 'left',
    sortable: true
},
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
    align: 'left',
    sortable: true
},
{
    name: 'proveedor',
    field: 'proveedor',
    label: 'Proveedor',
    align: 'left',
    sortable: true,
    editable:false,
},
{
    name: 'tipo_contacto',
    field: 'tipo_contacto',
    label: 'Tipo de Contacto',
    align: 'left',
    sortable: true
},
{
    name: 'celular',
    field: 'celular',
    label: 'Celular',
    align: 'left',
    sortable: true
},
{
    name: 'correo',
    field: 'correo',
    label: 'Correo',
    align: 'left',
    sortable: true
},
{
    name: 'ext',
    field: 'ext',
    label: 'Teléfono',
    align: 'left',
    sortable: true
}
]
