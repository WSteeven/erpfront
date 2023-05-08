import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { RolPago } from './RolPago'

export const configuracionColumnasRolPago: ColumnConfig<RolPago>[] = [
    {
      name: 'empleado_info',
      field: 'empleado_info',
      label: 'Empleado',
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
  name: 'dias',
  field: 'dias',
  label: 'Días',
  align: 'left',
  sortable: true
},
{
  name: 'sueldo',
  field: 'sueldo',
  label: 'Sueldo',
  align: 'left',
  sortable: true
},
{
  name: 'decimo_tercero',
  field: 'decimo_tercero',
  label: 'Décimo Tercero',
  align: 'left',
  sortable: true
},

{
  name: 'decimo_cuarto',
  field: 'decimo_cuarto',
  label: 'Décimo Cuarto',
  align: 'left',
  sortable: true
},
{
  name: 'fondos_reserva',
  field: 'fondos_reserva',
  label: 'Fondos de Reserva',
  align: 'left',
  sortable: true
},
{
  name: 'alimentacion',
  field: 'alimentacion',
  label: 'Alimentación',
  align: 'left',
  sortable: true
},
{
  name: 'horas_extras',
  field: 'horas_extras',
  label: 'Horas Extras',
  align: 'left',
  sortable: true
},
{
  name: 'total_ingreso',
  field: 'total_ingreso',
  label: 'Total Ingreso',
  align: 'left',
  sortable: true
},
{
  name: 'comisiones',
  field: 'comisiones',
  label: 'Comisiones',
  align: 'left',
  sortable: true
},
{
  name: 'iess',
  field: 'iess',
  label: 'IESS',
  align: 'left',
  sortable: true
},
{
  name: 'anticipo',
  field: 'anticipo',
  label: 'Anticipo',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_quirorafario',
  field: 'prestamo_quirorafario',
  label: 'Préstamo Quirografario',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_hipotecario',
  field: 'prestamo_hipotecario',
  label: 'Préstamo Hipotecario',
  align: 'left',
  sortable: true
},
{
  name: 'extension_conyugal',
  field: 'extension_conyugal',
  label: 'Extensión Conyugal',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_empresarial',
  field: 'prestamo_empresarial',
  label: 'Préstamo Empresarial',
  align: 'left',
  sortable: true
},
{
  name: 'sancion_pecuniaria',
  field: 'sancion_pecuniaria',
  label: 'Sanción Pecuniaria',
  align: 'left',
  sortable: true
},
{
  name: 'total_egreso',
  field: 'total_egreso',
  label: 'Total Egreso',
  align: 'left',
  sortable: true
},

]
