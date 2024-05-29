import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PublicacionPuestoTrabajo } from './PublicacionPuestoTrabajo'

export const configuracionColumnasPublicacionPuestoTrabajo: ColumnConfig<PublicacionPuestoTrabajo>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre de Puesto',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_puesto',
        field: 'tipo_puesto',
        label: 'Tipo de Puesto',
        align: 'left',
        sortable: true
    },
    {
        name: 'imagen_referencia',
        field: 'imagen_referencia',
        label: 'Imagen de Referencia',
        align: 'left',
        sortable: true
    },
    {
        name: 'publicidad',
        field: 'publicidad',
        label: 'Publicidad',
        align: 'left',
        sortable: true
    },    {
        name: 'fecha_caducidad',
        field: 'fecha_caducidad',
        label: 'Fecha de Caducidad de Publicación',
        align: 'left',
        sortable: true
    },
    {
        name: 'descripcion_vacante',
        field: 'descripcion_vacante',
        label: 'Descripcion de Vacante',
        align: 'left',
        sortable: true
    },    {
        name: 'descripcion_vacante',
        field: 'descripcion_vacante',
        label: 'Descripcion de Vacante',
        align: 'left',
        sortable: true
    },
]
