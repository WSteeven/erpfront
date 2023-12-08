import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { ExtensionConyugal } from './ExtensionConyugal'

export const configuracionColumnasExtensionConyugal: ColumnConfig<ExtensionConyugal>[] = [

{
  name: 'empleado_info',
  field: 'empleado_info',
  label: 'Empleado',
  align: 'left',
  sortable: true
},
{
  name: 'mes',
  field: 'mes',
  label: 'Mes',
  align: 'left',
  sortable: true
},
{
  name: 'dependiente_info',
  field: 'dependiente_info',
  label: 'Dependiente',
  align: 'left',
  sortable: true
},
{
  name: 'origen',
  field: 'origen',
  label: 'Origen',
  align: 'left',
  sortable: true
},
{
  name: 'materia_grabada',
  field: 'materia_grabada',
  label: 'Materia Grabada',
  align: 'left',
  sortable: true
},
{
  name: 'aporte',
  field: 'aporte',
  label: 'Aporte',
  align: 'left',
  sortable: true
},
{
  name: 'aporte_porcentaje',
  field: 'aporte_porcentaje',
  label: 'Aporte %',
  align: 'left',
  sortable: true
},
{
  name: 'aprobado',
  field: 'aprobado',
  label: 'Aprobado',
  align: 'left',
  sortable: true
},

]
