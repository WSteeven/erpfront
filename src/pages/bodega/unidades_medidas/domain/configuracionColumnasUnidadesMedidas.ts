import { ColumnConfig } from "components/tables/domain/ColumnConfig";
import { UnidadMedida } from "./UnidadMedida";

export const configuracionColumnasUnidadesMedidas: ColumnConfig<UnidadMedida>[]=[
  {
    name:'nombre',
    field:'nombre',
    label:'Nombre',
    align: 'left',
    sortable:true,
  },
  {
    name:'simbolo',
    field:'simbolo',
    label:'Símbolo',
    align: 'left',
    sortable:true,
  },
]

