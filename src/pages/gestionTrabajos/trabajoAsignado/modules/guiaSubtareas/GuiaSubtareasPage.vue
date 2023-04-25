<template>
  <q-page>
    <p>
      Al iniciar sesión lo primero que el técnico ve en la pantalla, es la tabla de trabajos agendados. La tabla consta de los siguientes estados.
      <ul>
        <li><b>Agendado:</b> El coordinador crea la subtarea, y se la agenda al
        técnico responsable. Aquí se muestran las subtareas que se deben ejecutar
        en el día actual y las atrasadas. El técnico puede: consultar más detalles para información más completa,
        ejecutar y/o suspender la subtarea. </li>
        <li><b>Ejecutando:</b> el responsable técnico ejecuta la
        subtarea. En este estado se le habilitan los botones: seguimiento, pausar,
        suspender, realizado.</li>
        <li><b>Pausado:</b> Cuando el técnico no puede continuar con
        una tarea puede pausarla temporalmente. En cada pausa el técnico debe
        seleccionar el motivo por el que se va a dar la pausa. Al momento de
        retornar el técnico puede reanudar la subtarea. </li>
        <li><b>Próximos trabajos:</b> aquí
        se detallan los trabajos agendados y que se deben ejecutar a futuro.</li>
      </ul>
    </p>
  </q-page>
</template>
