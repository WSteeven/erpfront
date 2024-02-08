import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { PagoComisionEmpleado } from "./PagoComisionEmpleado";

export const configuracionColumnasPagoComisionEmpleado: ColumnConfig<PagoComisionEmpleado>[] = [
    {
        name: 'vendedor_info',
        field: 'vendedor_info',
        label: 'Vendedor',
        align: 'left',
        sortable: false
    },
    {
        name: 'tipo_vendedor',
        field: 'tipo_vendedor',
        label: 'Modalidad',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_inicio',
        field: 'fecha_inicio',
        label: 'Fecha de Inicio',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_fin',
        field: 'fecha_fin',
        label: 'Fecha de Inicio',
        align: 'left',
        sortable: true
    },
    {
        name: 'ventas',
        field: 'ventas',
        label: 'Ventas',
        align: 'left',
        sortable: true
    },
    {
        name: 'chargeback',
        field: 'chargeback',
        label: 'Chargeback',
        align: 'left',
        sortable: true
    },
    {
        name: 'valor',
        field: 'valor',
        label: 'Valor Comisión',
        align: 'left',
        sortable: true
    },
    {
        name: 'pagado',
        field: 'pagado',
        label: 'Pagado',
        align: 'left',
        sortable: true
    },
]