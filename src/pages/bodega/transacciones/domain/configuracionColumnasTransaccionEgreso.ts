import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Transaccion } from "./Transaccion";

export const configuracionColumnasTransaccionEgreso: ColumnConfig<Transaccion>[] = [
    {
        name: 'solicitante',
        field: 'solicitante',
        label: 'Solicitante',
        align: 'left',
        sortable: true,
    },
    {
        name: 'justificacion',
        field: 'justificacion',
        label: 'Justificación',
        align: 'left',
        sortable: true,
    },
    {
        name: 'comprobante',
        field: 'comprobante',
        label: 'Factura',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha_limite',
        field: 'fecha_limite',
        label: 'Fecha límite',
        align: 'left',
        sortable: true,
    },
    {
        name: 'subtipo',
        field: 'subtipo',
        label: 'Tipo',
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
        name: 'autoriza',
        field: 'autoriza',
        label: 'Autoriza',
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
    {
        name: 'subtarea',
        field: 'subtarea',
        label: 'Subtarea',
        align: 'left',
        sortable: true,
    },
    {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true,
    }
]
