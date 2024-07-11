import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { FormacionAcademica } from './FormacionAcademica'

const optionsNiveles = [
    {value: 'BACHILLER', label:'BACHILLER'},
    {value: 'TERCER NIVEL', label:'TERCER NIVEL'},
    {value: 'CUARTO NIVEL', label:'CUARTO NIVEL'}
]
export const configuracionColumnasFormacionAcademicaReactive: ColumnConfig<FormacionAcademica>[] = [
    {
        name: 'nivel',
        field: 'nivel',
        label: 'Nivel',
        align: 'left',
        type: 'select',
        options: optionsNiveles,
        editable: true,
        sortable: true
    },
    // listadosAuxiliares.unidades_medidas.map((v: UnidadMedida) => { return { value: v.id, label: v.nombre } })
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Titulos',
        align: 'left',
        editable: true,
        sortable: true
    },
]
