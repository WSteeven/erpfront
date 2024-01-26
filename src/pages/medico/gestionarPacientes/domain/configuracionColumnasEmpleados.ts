import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export const configuracionColumnasEmpleados: ColumnConfig<Empleado>[] = [
  {
    name: 'identificacion',
    field: 'identificacion',
    label: 'Identificación',
    align: 'left',
    sortable: true
  },
  {
    name: 'nombres',
    field: 'nombres',
    label: 'Nombres',
    align: 'left',
    sortable: true
  },
  {
    name: 'apellidos',
    field: 'apellidos',
    label: 'Apellidos',
    align: 'left',
    sortable: true
  },
  {
    name: 'telefono',
    field: 'telefono',
    label: 'Telefono',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_nacimiento',
    field: 'fecha_nacimiento',
    label: 'Fecha de nacimiento',
    align: 'left',
    sortable: true,
    style: 'width:100px'
  },
  {
    name: 'email',
    field: 'email',
    label: 'Correo',
    align: 'left',
    sortable: true
  },
  {
    name: 'canton',
    field: 'canton',
    label: 'Sede',
    align: 'left',
    sortable: true
  },
  {
    name: 'cargo',
    field: 'cargo',
    label: 'Cargo',
    align: 'left',
    sortable: true
  },
  {
    name: 'departamento',
    field: 'departamento',
    label: 'Departamento',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_ingreso',
    field: 'fecha_ingreso',
    label: 'Fecha de Ingreso',
    align: 'left',
    sortable: true
  },
  {
    name: 'fecha_vinculacion',
    field: 'fecha_vinculacion',
    label: 'Fecha de Vinculacion',
    align: 'left',
    sortable: true
  },
]
