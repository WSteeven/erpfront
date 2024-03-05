<template>
  <tab-layout-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasSolicitudExamen"
    :full="true"
    :tabOptions="tabOptionsEstadosSolicitudExamen"
    :filtrar="filtrarSolicitudes"
    :tabDefecto="tabSolicitud"
    :forzarListar="true"
  >
    <template #formulario>
      <formulario-solicitud-examen
        :mixin="mixin"
        :empleado="empleado"
      ></formulario-solicitud-examen>
    </template>
  </tab-layout-tabs>
</template>

<script src="./SolicitudExamenPage.ts"></script>
