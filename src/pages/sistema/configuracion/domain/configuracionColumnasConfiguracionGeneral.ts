import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { ConfiguracionGeneral } from './Configuracion';

export const configuracionColumnasConfiguracionGeneral: ColumnConfig<ConfiguracionGeneral>[] = [
    {
        name: 'representante',
        field: 'representante',
        label: 'Representante',
        align: 'left',
        sortable: true
    },
    {
        name: 'razon_social',
        field: 'razon_social',
        label: 'Razon Social',
        align: 'left',
        sortable: true
    },
    {
        name: 'nombre_comercial',
        field: 'nombre_comercial',
        label: 'Nombre Comercial',
        align: 'left',
        sortable: true
    },
    {
        name: 'ruc',
        field: 'ruc',
        label: 'Nombre ruc',
        align: 'left',
        sortable: true
    }, {
        name: 'ciiu',
        field: 'ciiu',
        label: 'Ciiu',
        align: 'left',
        sortable: true
    },
    {
        name: 'direccion_principal',
        field: 'direccion_principal',
        label: 'Matriz',
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


]
