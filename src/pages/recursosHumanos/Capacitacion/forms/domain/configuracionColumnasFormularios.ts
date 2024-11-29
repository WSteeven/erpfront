import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Formulario } from 'capacitacion/forms/domain/Formulario'

export const configuracionColumnasFormularios: ColumnConfig<Formulario>[]=[
  {
    name: 'nombre',
    field: 'nombre',
    label: 'Nombre',
    align: 'left',
    sortable: true
  },
  {
    name: 'respuestas',
    field: 'respuestas',
    label: 'Respuestas',
    align: 'left',
    sortable: true
  },
]
