import { ColumnConfig } from 'components/tables/domain/ColumnConfig'
import { HorarioLaboral } from './HorarioLaboral'

export const configuracionColumnasHorarioLaboral: ColumnConfig<HorarioLaboral>[] =
  [
    {
      name: 'nombre',
      field: 'nombre',
      label: 'Tipo de Horario',
      align: 'left',
      sortable: true
    },
    {
      name: 'dia',
      field: 'dia',
      label: 'Día',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_entrada',
      field: 'hora_entrada',
      label: 'Hora de Entrada',
      align: 'left',
      sortable: true
    },
    {
      name: 'hora_salida',
      field: 'hora_salida',
      label: 'Hora de Salida',
      align: 'left',
      sortable: true
    },
    {
      name: 'inicio_pausa',
      field: 'inicio_pausa',
      label: 'Inicio Pausa',
      align: 'left',
      sortable: true
    },
    {
      name: 'fin_pausa',
      field: 'fin_pausa',
      label: 'Fin Pausa',
      align: 'left',
      sortable: true
    },
    {
      name: 'activo',
      field: 'activo',
      label: '¿Activo?',
      align: 'left',
      sortable: true
    }
  ]
