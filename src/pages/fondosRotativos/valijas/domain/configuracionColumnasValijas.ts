import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Valija } from 'pages/fondosRotativos/valijas/domain/Valija'
import { ref } from 'vue'

export const configuracionColumnasValijas = ref<ColumnConfig<Valija>[]>([
  {
    name: 'empleado',
    field: 'empleado',
    label: 'Empleado Envía',
    align: 'left',
    visibleModal: false,
    sortable: true
  },
  {
    name: 'descripcion',
    field: 'descripcion',
    label: 'Descripción',
    align: 'left',
    editable: true,
    type: 'textarea'
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
    editable: true,
    type: 'select',
    requerido: true,
  },
  {
    name: 'imagen_evidencia',
    field: 'imagen_evidencia',
    label: 'Imagen',
    align: 'left',
    requerido: true,
    editable: true,
    type: 'imagen',
    placeholder:'Obligatorio',
    accept: '.png, .jpg, .jpeg',
    height: '100px'
  }
])
