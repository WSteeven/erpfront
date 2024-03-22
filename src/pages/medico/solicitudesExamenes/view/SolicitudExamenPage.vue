<template>
  <tab-layout-tabs
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasSolicitudExamen"
    :full="true"
    :tabOptions="tabOptionsEstadosSolicitudExamen"
    :filtrar="filtrarSolicitudes"
    :tabDefecto="tabSolicitud"
    :forzarListar="true"
    :permitir-consultar="true"
    :permitir-editar="true"
    :mostrar-button-submits="!!empleado.id"
  >
    <template #formulario>
      <div class="q-pa-md">
        <formulario-solicitud-examen
          :mixin="mixin"
          :empleado="empleado"
        ></formulario-solicitud-examen>
      </div>
    </template>
  </tab-layout-tabs>
</template>

<script src="./SolicitudExamenPage.ts"></script>
