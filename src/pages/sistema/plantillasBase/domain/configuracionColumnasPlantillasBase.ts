import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { PlantillaBase } from 'sistema/plantillasBase/domain/PlantillaBase'

export const configuracionColumnasPlantillasBase: ColumnConfig<PlantillaBase>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Nombre',
      align: 'left',
      sortable: true
    },
    {
      name: 'url',
      field: 'url',
      label: 'Url',
      align: 'left',
      sortable: true
    }
  ]
