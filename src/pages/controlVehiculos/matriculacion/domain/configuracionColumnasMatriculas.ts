import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Matricula } from "./Matricula";

export const configuracionColumnasMatriculas: ColumnConfig<Matricula>[] = [
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Vehículo',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_matricula',
        field: 'fecha_matricula',
        label: 'Fecha matrícula',
        align: 'left',
        sortable: true,
        editable: false,
    },
    {
        name: 'valor_estimado_pagar',
        field: 'valor_estimado_pagar',
        label: 'Valor a Pagar',
        align: 'left',
        sortable: true
    },
    {
        name: 'proxima_matricula',
        field: 'proxima_matricula',
        label: 'Próxima matrícula',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: '¿Matriculado?',
        align: 'left',
        sortable: true
    },
]