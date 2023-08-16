import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasSerialesDetalles: ColumnConfig<any>[] = [
    {
        name: 'serial',
        field: 'serial',
        label: 'Serial',
        align: 'center',
    },
    {
        name: 'acciones',
        field: 'acciones',
        label: 'Acciones',
        style: 'max-width: 50px; overflow: auto;',
        align: 'center',
      }
]