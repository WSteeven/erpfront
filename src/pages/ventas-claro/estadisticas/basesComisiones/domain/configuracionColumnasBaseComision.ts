import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { BaseComision } from 'pages/ventas-claro/estadisticas/basesComisiones/domain/BaseComision'

export const configuracionColumnasBaseComision: ColumnConfig<BaseComision>[] = [
  {
    name: 'modalidad',
    field: 'modalidad',
    label: 'Modalidad',
    align: 'left',
    sortable: true
  },
  {
    name: 'presupuesto_ventas',
    field: 'presupuesto_ventas',
    label: 'Presup. Ventas',
    align: 'left',
    sortable: true
  },
  {
    name: 'bono_comision_semanal',
    field: 'bono_comision_semanal',
    label: 'Bono Comisión Semanal $',
    align: 'left',
    sortable: true
  },
  {
    name: 'comisiones',
    field: 'comisiones',
    label: 'Comisiones',
    align: 'left',
    sortable: true
  }
]
