import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasReportesFondosRotativos: ColumnConfig<any>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true
    },
    {
        name: 'activo',
        field: 'activo',
        label: '¿Activo?',
        align: 'left',
        sortable: true
    },
    {
        name: 'saldo_inicial',
        field: 'saldo_inicial',
        label: 'Saldo Inicial',
        align: 'left',
        sortable: true
    },
    {
        name: 'acreditaciones',
        field: 'acreditaciones',
        label: 'Acreditaciones',
        align: 'left',
        sortable: true
    },
    {
        name: 'gastos',
        field: 'gastos',
        label: 'Gastos',
        align: 'left',
        sortable: true
    },
    {
        name: 'transferencias_enviadas',
        field: 'transferencias_enviadas',
        label: 'T. Enviadas',
        align: 'left',
        sortable: true
    },
    {
        name: 'transferencias_recibidas',
        field: 'transferencias_recibidas',
        label: 'T. Recibidas',
        align: 'left',
        sortable: true
    },
    {
        name: 'ajustes_saldos',
        field: 'ajustes_saldos',
        label: 'Ajuste de Saldos',
        align: 'left',
        sortable: true
    },
    {
        name: 'saldo_actual',
        field: 'saldo_actual',
        label: 'Saldo Actual',
        align: 'left',
        sortable: true
    },
    {
        name: 'diferencia',
        field: 'diferencia',
        label: 'Diferencial',
        align: 'left',
        sortable: true
    },
    {
        name: 'inconsistencia',
        field: 'inconsistencia',
        label: 'Inconsistencia',
        align: 'left',
        sortable: true
    },
]