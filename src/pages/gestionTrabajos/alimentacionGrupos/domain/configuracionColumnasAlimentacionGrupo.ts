import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { AlimentacionGrupo } from './AlimentacionGrupo'

export const configuracionColumnasAlimentacionGrupo: ColumnConfig<AlimentacionGrupo>[] = [
    {
        name: 'tarea',
        field: 'tarea',
        label: 'Tarea',
        align: 'left',
    },
    {
        name: 'coordinador',
        field: 'coordinador',
        label: 'Coordinador',
        align: 'left',
    },
    {
        name: 'observacion',
        field: 'observacion',
        label: 'Observación',
        align: 'left',
        operador: 'like',
    },
    {
        name: 'grupo',
        field: 'grupo',
        label: 'Grupo',
        align: 'left',
        operador: 'like',
    },
    {
        name: 'cantidad_personas',
        field: 'cantidad_personas',
        label: 'Cantidad personas',
        align: 'left',
        type: 'number',
    },
    {
        name: 'precio',
        field: 'precio',
        label: 'Precio',
        align: 'left',
        type: 'number',
    },
    {
        name: 'total',
        field: 'total',
        label: 'Total',
        align: 'left',
        type: 'number',
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        type: 'date',
    },
    {
        name: 'tipo_alimentacion',
        field: 'tipo_alimentacion',
        label: 'Tipo alimentación',
        align: 'left',
    }
]
