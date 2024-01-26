import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Empleado } from './Empleado'

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
        name: 'jefe',
        field: 'jefe',
        label: 'Jefe',
        align: 'left',
        sortable: true,
        style: 'width:150px'
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
{
  name: 'fecha_vinculacion',
  field: 'fecha_vinculacion',
  label: 'Fecha de Vinculacion',
  align: 'left',
  sortable: true
},
{
  name: 'num_cuenta',
  field: 'num_cuenta',
  label: 'Numero de Cuenta',
  align: 'left',
  sortable: true
},
{
  name: 'salario',
  field: 'salario',
  label: 'Salario',
  align: 'left',
  sortable: true
},
    {
        name: 'estado',
        field: 'estado',
        label: '¿Activo?',
        align: 'left',
        sortable: true
    },
    {
      name:'esta_en_rol_pago',
      field: 'esta_en_rol_pago',
      label: '¿Esta enrolado?',
      align: 'left',
      sortable: true
    },
    {
      name:'realiza_factura',
      field: 'realiza_factura',
      label: 'Factura',
      align: 'left',
      sortable: true
    },
    {
        name: 'firma_url',
        field: 'firma_url',
        label: '¿Firma?',
        align: 'left',
        sortable: true
    },
]
