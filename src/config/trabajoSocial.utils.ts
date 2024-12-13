import { OptionGroup } from 'components/optionGroup/domain/OptionGroup'
import {  parentezcos  } from 'config/recursosHumanos.utils'

export const tipos_viviendas = [
  'PROPIA',
  'ALQUILADA',
  'ALOJADA/PRESTADA',
  'GUARDIANIA',
  'DE LOS PADRES O FAMILIARES',
  'INVADIDA',
]


export const tipos_predominantes = {
  PAREDES: 'PAREDES',
  TECHO: 'TECHO',
  PISO: 'PISO'
}


export const materiales_predominantes = [
  { label: 'BLOQUE', value: 'BLOQUE', tipo: tipos_predominantes.PAREDES },
  { label: 'LADRILLO', value: 'LADRILLO', tipo: tipos_predominantes.PAREDES },
  { label: 'MADERA', value: 'MADERA', tipo: tipos_predominantes.PAREDES },
  { label: 'CAÑA', value: 'CAÑA', tipo: tipos_predominantes.PAREDES },
  { label: 'CARTON PRENSADO', value: 'CARTON PRENSADO', tipo: tipos_predominantes.PAREDES },
  { label: 'PLASTICO', value: 'PLASTICO', tipo: tipos_predominantes.PAREDES },

  { label: 'ZINC', value: 'ZINC', tipo: tipos_predominantes.TECHO },
  { label: 'CONCRETO ARMADO', value: 'CONCRETO ARMADO', tipo: tipos_predominantes.TECHO},
  { label: 'MADERA', value: 'MADERA', tipo: tipos_predominantes.TECHO },
  { label: 'TEJA', value: 'TEJA', tipo: tipos_predominantes.TECHO },
  { label: 'ETERNIT', value: 'ETERNIT', tipo: tipos_predominantes.TECHO },
  { label: 'PLASTICO', value: 'ETERNIT', tipo: tipos_predominantes.TECHO },

  { label: 'CERAMICO', value: 'CERAMICO', tipo: tipos_predominantes.PISO },
  { label: 'CEMENTO', value: 'CEMENTO', tipo: tipos_predominantes.PISO },
  { label: 'MADERA', value: 'MADERA', tipo: tipos_predominantes.PISO },
  { label: 'CAÑA', value: 'CAÑA', tipo: tipos_predominantes.PISO },
  { label: 'TIERRA', value: 'TIERRA', tipo: tipos_predominantes.PISO },
  { label: 'TAPETE', value: 'TAPETE', tipo: tipos_predominantes.PISO },
]

export const opcionesDistribucion = [
  { label: 'SALA', value: 'SALA'},
  { label: 'COCINA', value: 'COCINA'},
  { label: 'COMEDOR', value: 'COMEDOR'},
  { label: 'BAÑO', value: 'BAÑO'},
  { label: 'DORMITORIOS', value: 'DORMITORIOS'},
  { label: 'GARAGE O PATIO', value: 'GARAGE O PATIO'},

]


export const likertEspaciosFamiliares = [
  'MUY COMODO',
  'COMODO',
  'INCOMODO',
  'MUY INCOMODO'
]


export const vehiculos = [
  'NINGUNO',
  'AUTOMOVIL',
  'BICICLETA',
  'CAMIONETA',
  'MOTOCICLETA'
]


export const optionsServiciosBasicos: OptionGroup[] = [
  {
    label: 'FORMAL',
    value: 'FORMAL',
    color: 'green',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  },
  {
    label: 'INFORMAL',
    value: 'INFORMAL',
    color: 'orange',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  },
  {
    label: 'NO TIENE',
    value: 'NO TIENE',
    color: 'red',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  }
]
export const optionsLugaresAtencion: OptionGroup[] = [
  {
    label: 'IESS',
    value: 'IESS',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  },
  {
    label: 'MSP',
    value: 'MSP',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  },
  {
    label: 'PRIVADO',
    value: 'PRIVADO',
    checkedIcon: 'bi-check-circle-fill',
    uncheckedIcon: 'panorama_fish_eye'
  }
]

export const optionsProblemasSociales: OptionGroup[] = [
  {
    label: 'VIOLENCIA FAMILIAR',
    value: 'VIOLENCIA FAMILIAR',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'DISCAPACIDAD',
    value: 'DISCAPACIDAD',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'ANTECEDENTES PENALES',
    value: 'ANTECEDENTES PENALES',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'ABANDONO PARCIAL',
    value: 'ABANDONO PARCIAL',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'ABANDONO TOTAL',
    value: 'ABANDONO TOTAL',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  },
  {
    label: 'PROBLEMAS DE ADICCION (Drogas, alcohol, otros)',
    value: 'PROBLEMAS DE ADICCION',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  }
]

export const optionsConocimientos: OptionGroup[] = [
  {
    label: 'PRIMEROS AUXILIOS',
    value: 'PRIMEROS AUXILIOS',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'MANEJO DE EXTINTORES',
    value: 'MANEJO DE EXTINTORES',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'REGLAMENTOS DE TRABAJO',
    value: 'REGLAMENTOS DE TRABAJO',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'PRESTACIONES DE SERVICIOS DEL IESS',
    value: 'PRESTACIONES DE SERVICIOS DEL IESS',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'ACCIDENTES/INCIDENTES DEL TRABAJADOR',
    value: 'ACCIDENTES/INCIDENTES DEL TRABAJADOR',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  },
  {
    label: 'SALUD OCUPACIONAL',
    value: 'SALUD OCUPACIONAL',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  },
  {
    label: 'SIMULACROS DE EVACUACION',
    value: 'SIMULACROS DE EVACUACION',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  },
  {
    label: 'CAMPAÑA DE SALUD',
    value: 'CAMPAÑA DE SALUD',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  }
]

export const optionsCapacitaciones: OptionGroup[] = [
  {
    label: 'CUERPO DE BOMBEROS',
    value: 'CUERPO DE BOMBEROS',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'MINISTERIO DE TRABAJO',
    value: 'MINISTERIO DE TRABAJO',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    // label: 'INSTITUTO ECUATORIANO DE SEGURIDAD SOCIAL',
    // value: 'INSTITUTO ECUATORIANO DE SEGURIDAD SOCIAL',
    label: 'IESS',
    value: 'IESS',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'RIESGO DEL TRABAJO SEGURIDAD SOCIAL',
    value: 'RIESGO DEL TRABAJO SEGURIDAD SOCIAL',
    checkedIcon: 'bi-check-square-fill',
    uncheckedIcon: 'bi-square'
  },
  {
    label: 'CRUZ ROJA ECUATORIANA',
    value: 'CRUZ ROJA ECUATORIANA',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  },
  {
    label: 'POLICIA',
    value: 'POLICIA',
    checkedIcon:'bi-check-square-fill',
    uncheckedIcon:'bi-square'
  }
]


export const parentescos = [
  ...parentezcos,
  { nombre: 'PAPÁ', value: 'PAPA' },
  { nombre: 'MAMÁ', value: 'MAMA' },
  { nombre: 'HERMANO', value: 'HERMANO' },
  { nombre: 'HERMANA', value: 'HERMANA' },
  { nombre: 'TIO', value: 'TIO' },
  { nombre: 'TIA', value: 'TIA' },
  { nombre: 'PRIMO', value: 'PRIMO' },
  { nombre: 'PRIMA', value: 'PRIMA' },
  { nombre: 'ABUELO', value: 'ABUELO' },
  { nombre: 'ABUELA', value: 'ABUELA' },
]
