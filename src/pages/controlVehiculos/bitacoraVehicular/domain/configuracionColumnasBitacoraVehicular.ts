import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { BitacoraVehicular } from "./BitacoraVehicular";

export const configuracionColumnasBitacoraVehicular: ColumnConfig<BitacoraVehicular>[] = [
    {
        name: 'id',
        field: 'id',
        label: 'N°',
        align: 'left',
        sortable: true,
    },
    {
        name: 'vehiculo',
        field: 'vehiculo',
        label: 'Placa',
        align: 'left',
        sortable: true,
    },
    {
        name: 'chofer',
        field: 'chofer',
        label: 'Chofer',
        align: 'left',
        sortable: true,
    },
    {
        name: 'fecha',
        field: 'fecha',
        label: 'fecha',
        align: 'left',
        sortable: true,
    },
    {
        name: 'km_final',
        field: 'km_final',
        label: 'Km Final',
        align: 'left',
        sortable: true,
    },
    {
        name: 'tanque_final',
        field: 'tanque_final',
        label: 'Tanque final',
        align: 'left',
        sortable: true,
    },
    {
        name: 'firmada',
        field: 'firmada',
        label: 'Firmada',
        align: 'left',
        sortable: true,
    },
]