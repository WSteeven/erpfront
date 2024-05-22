import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { FormacionAcademica } from './FormacionAcademica'

export const configuracionColumnasFormacionAcademicaReactive: ColumnConfig<FormacionAcademica>[] = [
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Titulos',
        align: 'left',
        editable: true,
        sortable: true
    },
]
