import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Vehiculo } from "./Vehiculo";

export const configuracionColumnasVehiculos: ColumnConfig<Vehiculo>[]=[
    {
        name: 'marca',
        field: 'marca',
        label: 'Marca',
        align: 'left',
        sortable:true,
    },
    {
        name: 'modelo',
        field: 'modelo',
        label: 'Modelo',
        align: 'left',
        sortable:true,
    },
    {
        name: 'placa',
        field: 'placa',
        label: 'Placa',
        align: 'left',
        sortable:true,
    },
    {
        name: 'placa',
        field: 'placa',
        label: 'Placa',
        align: 'left',
        sortable:true,
    },
    {
        name: 'anio_fabricacion',
        field: 'anio_fabricacion',
        label: 'Año Fabricación',
        align: 'left',
        sortable:true,
    },
    {
        name: 'cilindraje',
        field: 'cilindraje',
        label: 'Cilindraje',
        align: 'left',
        sortable:true,
    },
    {
        name: 'combustible',
        field: 'combustible',
        label: 'Combustible',
        align: 'left',
        sortable:true,
    },
    {
        name: 'rendimiento',
        field: 'rendimiento',
        label: 'Rendimiento km/gl',
        align: 'left',
        sortable:true,
    }
]