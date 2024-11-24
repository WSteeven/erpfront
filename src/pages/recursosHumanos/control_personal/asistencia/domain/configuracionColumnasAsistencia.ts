import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Asistencia } from './Asistencia'

export const configuracionColumnasAsistencia: ColumnConfig<Asistencia>[] = [
    {
        name: 'empleado',
        field: 'empleado',
        label: 'Empleado',
        align: 'left',
        sortable: true
    },
    {
        name: 'horaIngreso',
        field: 'horaIngreso',
        label: 'Ingreso',
        align: 'center',
        sortable: true
    },
    {
        name: 'horaSalida',
        field: 'horaSalida',
        label: 'Salida',
        align: 'center',
        sortable: true
    },
    {
        name: 'horaSalidaAlmuerzo',
        field: 'horaSalidaAlmuerzo',
        label: 'Salida Almuerzo',
        align: 'center',
        sortable: true
    },
    {
        name: 'horaEntradaAlmuerzo',
        field: 'horaEntradaAlmuerzo',
        label: 'Entrada Almuerzo',
        align: 'center',
        sortable: true
    },
]
