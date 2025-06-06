import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Valija } from 'pages/fondosRotativos/gasto/domain/Valija'

export const configuracionColumnasValijas: ColumnConfig<Valija>[] = [
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado Envía',
    align: 'left',
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    editable: true,
    type:'textarea',
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
    editable: true,
    type: 'select',
  },
  {
    name: 'imagen_evidencia',
    field: 'imagen_evidencia',
    label: 'Imagen',
    align: 'left',
    requerido: true,
    editable: true,
    type:'imagen',
    accept:'.png, .jpg, .jpeg',

  }
]
