import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

export const configuracionColumnasSeleccionEmpleados: ColumnConfig<Empleado>[] = [

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
        name: 'canton',
        field: 'canton',
        label: 'Sede',
        align: 'left',
        sortable: true
    },
    {
        name: 'grupo',
        field: 'grupo',
        label: 'Grupo',
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


]
