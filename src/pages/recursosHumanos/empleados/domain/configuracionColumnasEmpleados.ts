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
        name: 'fecha_nacimiento',
        field: 'fecha_nacimiento',
        label: 'Fecha de nacimiento',
        align: 'left',
        sortable: true,
        style: 'width:100px'
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
        name: 'roles',
        field: 'roles',
        label: 'Roles',
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
        name: 'firma_url',
        field: 'firma_url',
        label: '¿Firma?',
        align: 'left',
        sortable: true
    },
]
