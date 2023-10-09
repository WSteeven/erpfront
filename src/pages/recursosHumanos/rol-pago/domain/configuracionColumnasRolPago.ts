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
  name: 'sueldo',
  field: 'sueldo',
  label: 'Sueldo',
  align: 'left',
  sortable: true
},
{
  name: 'dias',
  field: 'dias',
  label: 'Días Laborados',
  align: 'left',
  sortable: true
},
{
  name: 'decimo_tercero',
  field: 'decimo_tercero',
  label: 'Decimo Tercero',
  align: 'left',
  sortable: true
},
{
  name: 'decimo_cuarto',
  field: 'decimo_cuarto',
  label: 'Decimo Cuarto',
  align: 'left',
  sortable: true
},
{
  name: 'fondos_reserva',
  field: 'fondos_reserva',
  label: 'Fondo de Reserva',
  align: 'left',
  sortable: true
},

{
  name: 'concepto_ingreso_info',
  field: 'concepto_ingreso_info',
  label: 'Concepto',
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
  name: 'anticipo',
  field: 'anticipo',
  label: 'Anticipo',
  align: 'left',
  sortable: true
},
{
  name: 'supa',
  field: 'supa',
  label: 'SUPA',
  align: 'left',
  sortable: true
},
{
  name: 'extension_cobertura_salud',
  field: 'extension_cobertura_salud',
  label: 'Extension Cobertura de salud',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_hipotecario',
  field: 'prestamo_hipotecario',
  label: 'Prestamo Hipotecario',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_quirorafario',
  field: 'prestamo_quirorafario',
  label: 'Prestamo Quirorafario',
  align: 'left',
  sortable: true
},
{
  name: 'prestamo_empresarial',
  field: 'prestamo_empresarial',
  label: 'Prestamo Empresarial',
  align: 'left',
  sortable: true
},
{
  name: 'iess',
  field: 'iess',
  label: 'Aporte IESS',
  align: 'left',
  sortable: true
},
{
  name: 'descuento_general_info',
  field: 'descuento_general_info',
  label: 'Descuentos Generales',
  align: 'left',
  sortable: true
},
{
  name: 'multa_info',
  field: 'multa_info',
  label: 'Multas',
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
{
  name: 'total',
  field: 'total',
  label: 'Total',
  align: 'left',
  sortable: true
},

]
