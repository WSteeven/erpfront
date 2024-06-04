import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { accionesTabla } from "config/utils";
import { Matricula } from "pages/controlVehiculos/matriculacion/domain/Matricula";

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
        name: 'matriculador',
        field: 'matriculador',
        label: 'Matriculado Por',
        align: 'left',
        sortable: true
    },
    {
        name: 'monto',
        field: 'monto',
        label: 'Valor Matricula',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha_pago',
        field: 'fecha_pago',
        label: 'Fecha Pago',
        align: 'left',
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        sortable: true
    },
    {
        name: 'estado',
        field: 'estado',
        label: '¿Matriculado?',
        align: 'left',
        sortable: true
    }
]