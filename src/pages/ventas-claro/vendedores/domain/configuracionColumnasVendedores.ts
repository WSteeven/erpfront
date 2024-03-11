import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { Vendedor } from "./Vendedor";

export const configuracionColumnasVendedores: ColumnConfig<Vendedor>[] = [

  {
    name: 'empleado_info',
    field: 'empleado_info',
    label: 'Empleado',
    align: 'left',
    sortable: true
  },
  {
    name: 'modalidad_info',
    field: 'modalidad_info',
    label: 'Modalidad',
    align: 'left',
    sortable: true
  },
  {
    name: 'tipo_vendedor',
    field: 'tipo_vendedor',
    label: 'Tipo Vendedor',
    align: 'left',
    sortable: true
  },
  //jefe_inmediato_info
  {
    name: 'jefe_inmediato_info',
    field: 'jefe_inmediato_info',
    label: 'Jefe Inmediato',
    align: 'left',
    sortable: true
  },
  {
    name: 'activo',
    field: 'activo',
    label: 'Estado',
    align: 'left',
    sortable: true
  },


]
