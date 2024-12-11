import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Familiar } from 'trabajoSocial/composicion_familiar/domain/Familiar'

export const configuracionColumnasFamiliares: ColumnConfig<Familiar>[] = [
  {
    name: 'nombres_apellidos',
    field: 'nombres_apellidos',
    label: 'Nombres y Apellidos',
    align: 'left',
    editable: true,
    sortable: true
  },
  {
    name: 'parentesco',
    field: 'parentesco',
    label: 'Parentesco',
    align: 'left',
    type:'select',
    sortable: true,
    editable: true
  },
  {
    name: 'edad',
    field: 'edad',
    label: 'Edad',
    align: 'left',
    type: 'number',
    min: 0,
    editable: true,
    sortable: true
  },
  {
    name: 'estado_civil',
    field: 'estado_civil',
    label: 'Estado Civil',
    align: 'left',
    type:'select',
    editable: true
  },
  {
    name: 'instruccion',
    field: 'instruccion',
    label: 'Instrucción',
    align: 'left',
    editable: true
  },
  {
    name: 'ocupacion',
    field: 'ocupacion',
    label: 'Ocupación',
    align: 'left',
    editable: true
  },
  {
    name: 'discapacidad',
    field: 'discapacidad',
    label: 'Discapacidad',
    align: 'left',
    sortable: true,
    editable: true
  },
  {
    name: 'ocupacion',
    field: 'ocupacion',
    label: 'Ingreso Mensual',
    align: 'left',
    type: 'number',
    default: 0,
    editable: true
  }
]
