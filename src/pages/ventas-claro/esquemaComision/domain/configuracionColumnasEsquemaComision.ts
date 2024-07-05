import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { EsquemaComision } from './EsquemaComision';

export const configuracionColumnasEsquemaComision: ColumnConfig<EsquemaComision>[] = [
  {
    name: 'mes_liquidacion',
    field: 'mes_liquidacion',
    label: 'Mes de Liquidacion',
    align: 'left',
    sortable: true
  },
  {
    name: 'esquema_comision',
    field: 'esquema_comision',
    label: 'Esquema Comision',
    align: 'left',
    sortable: true
  },
  {
    name: 'tarifa_basica',
    field: 'tarifa_basica',
    label: 'Tarifa Basica',
    align: 'left',
    sortable: true
  },



]
