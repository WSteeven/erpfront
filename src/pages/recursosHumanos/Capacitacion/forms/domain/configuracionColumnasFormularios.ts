import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Formulario } from 'capacitacion/forms/domain/Formulario'

export const configuracionColumnasFormularios: ColumnConfig<Formulario>[]=[
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Propietario',
    align: 'left',
    sortable: true
  },
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo',
    field: 'tipo',
    label: 'Tipo',
    align: 'left',
    sortable: true
  },
]
