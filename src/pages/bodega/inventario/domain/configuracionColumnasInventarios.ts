import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { Inventario } from './Inventario'
import { LocalStorage } from 'quasar'
import { Condicion } from 'pages/administracion/condiciones/domain/Condicion'

export const configuracionColumnasInventarios: ColumnConfig<Inventario>[] = [
    {
        name: 'producto',
        field: 'producto',
        label: 'Producto',
        style: 'max-width: 300px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'detalle_id',
        field: 'detalle_id',
        label: 'Descripción',
        // style: 'max-width: 500px;',
        style: 'max-width: 500px; overflow: auto;',
        align: 'left',
        sortable: true
    },
    {
        name: 'cliente_id',
        field: 'cliente_id',
        label: 'Propietario',
        align: 'left',
        sortable: true
    },
    {
        name: 'sucursal_id',
        field: 'sucursal_id',
        label: 'Sucursal',
        align: 'left',
        sortable: true
    },
    // {
    //     name: 'por_recibir',
    //     field: 'por_recibir',
    //     label: 'Por recibir',
    //     align: 'center',
    //     sortable: true
    // },
    {
        name: 'cantidad',
        field: 'cantidad',
        label: 'Cantidad',
        align: 'center',
        sortable: true
    },
    // {
    //     name: 'por_entregar',
    //     field: 'por_entregar',
    //     label: 'Por entregar',
    //     align: 'center',
    //     sortable: true
    // },
    {
        name: 'condiciones',
        field: 'condiciones',
        label: 'Condicion',
        align: 'center',
        type:'select',
        options: JSON.parse(LocalStorage.getItem('condiciones')!.toString()).map((v:Condicion)=>{return {label:v.nombre}}),
        sortable: true
    },
    /* {
        name: 'estado',
        field: 'estado',
        label: 'Estado',
        align: 'left',
        sortable: true
    }, */
]