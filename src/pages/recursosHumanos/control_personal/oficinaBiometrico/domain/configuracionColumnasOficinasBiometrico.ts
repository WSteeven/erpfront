import {ColumnConfig} from 'components/tables/domain/ColumnConfig';
import {OficinaBiometrico} from 'controlPersonal/oficinaBiometrico/domain/OficinaBiometrico';

export const configuracionColumnasOficinasBiometrico: ColumnConfig<OficinaBiometrico>[]=[
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true,
    },
    {
        name: 'nombre',
        field: 'nombre',
        label: 'Nombre',
        align: 'left',
        sortable: true,
    },
    {
        name: 'descripcion',
        field: 'descripcion',
        label: 'Descripción',
        align: 'left',
        sortable: true,
    },
    {
        name: 'direccion',
        field: 'direccion',
        label: 'Dirección',
        align: 'left',
        sortable: true,
    },
    {
        name: 'canton',
        field: 'canton',
        label: 'Cantón',
        align: 'left',
        sortable: true,
    },
    {
        name: 'direccion_ip',
        field: 'direccion_ip',
        label: 'Dirección IP',
        align: 'left',
        sortable: true,
    },
    {
        name: 'puerto',
        field: 'puerto',
        label: 'Puerto',
        align: 'left',
        sortable: true,
    },
    {
        name: 'latitud',
        field: 'latitud',
        label: 'Latitud (Opcional)',
        align: 'left',
        sortable: true,
    },
    {
        name: 'longitud',
        field: 'longitud',
        label: 'Longitud (Opcional)',
        align: 'left',
        sortable: true,
    },
    {
        name: 'activo',
        field: 'activo',
        label: '¿Activo?',
        align: 'left',
        sortable: true,
    },
]