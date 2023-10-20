import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PreingresoMaterial } from './PreingresoMaterial'

export const configuracionColumnasPreingresosMateriales: ColumnConfig<PreingresoMaterial>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'Fecha',
        align: 'left',
        sortable: true,
        style: 'width:100px'
    },
    {
        name: 'num_guia',
        field: 'num_guia',
        label: 'N° Guía',
        align: 'left',
        sortable: true,
        style: 'max-width:300px; overflow: auto;'
    },
    {
        name: 'responsable',
        field: 'responsable',
        label: 'Responsable',
        style: 'max-width:250px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'autorizador',
        field: 'autorizador',
        label: 'Autoriza',
        align: 'left',
        sortable: true
    },
    {
        name: 'coordinador',
        field: 'coordinador',
        label: 'Coordinador',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente',
        field: 'cliente',
        label: 'Cliente',
        style: 'max-width:250px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'tarea',
        field: 'tarea',
        label: 'Tarea',
        align: 'left',
        sortable: true
    },
    {
        name: 'autorizacion',
        field: 'autorizacion',
        label: 'Estado',
        align: 'left',
        sortable: true
    },
]