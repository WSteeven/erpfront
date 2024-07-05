import { ColumnConfig } from "components/tables/domain/ColumnConfig";

export const configuracionColumnasConductorLicencia: ColumnConfig<any>[] = [
    {
        name: 'conductor',
        field: 'conductor',
        label: 'Conductor',
        align: 'left',
        sortable: true
    },
    {
        name: 'puntos',
        field: 'puntos',
        label: 'Puntos',
        align: 'left',
        sortable: true
    },
    {
        name: 'tipo_licencia',
        field: 'tipo_licencia',
        label: 'Tipo Licencia',
        align: 'left',
        sortable: true
    },
    {
        name: 'inicio_vigencia',
        field: 'inicio_vigencia',
        label: 'Inicio Vigencia',
        align: 'left'
    },
    {
        name: 'fin_vigencia',
        field: 'fin_vigencia',
        label: 'Fin Vigencia',
        align: 'left'
    },
    {
        name: 'vence',
        field: 'vence',
        label: 'Vencimiento',
        align: 'left'
    },
]