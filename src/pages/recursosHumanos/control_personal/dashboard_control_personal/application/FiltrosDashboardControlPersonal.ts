export const filtroAsistencias = (label: string, asistencias: any) => {
  switch (label) {
      case 'PRESENTE':
          return asistencias.value.filter((objeto) => objeto.estado === 'PRESENTE');
      case 'TARDANZA':
          return asistencias.value.filter((objeto) => objeto.estado === 'TARDANZA');
      case 'AUSENTE':
          return asistencias.value.filter((objeto) => objeto.estado === 'AUSENTE');
      default:
          console.log('Filtro por defecto aplicado: ' + label);
          return asistencias.value;
  }
};

export const filtroAtrasos = (label: string, atrasos: any) => {
  switch (label) {
      case 'MENOR A 15 MIN':
          return atrasos.value.filter((objeto) => objeto.minutos < 15);
      case 'ENTRE 15 Y 30 MIN':
          return atrasos.value.filter((objeto) => objeto.minutos >= 15 && objeto.minutos <= 30);
      case 'MAYOR A 30 MIN':
          return atrasos.value.filter((objeto) => objeto.minutos > 30);
      default:
          console.log('Filtro por defecto aplicado: ' + label);
          return atrasos.value;
  }
};
