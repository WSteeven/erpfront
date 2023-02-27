<template>
  <!-- Tabla de notificaciones -->
  <essential-table
    titulo="Notificaciones"
    :configuracionColumnas="configuracionColumnas"
    :datos="listado"
    :permitirConsultar="false"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarBotones="false"
    :accion1="BotonMarcarLeido"
  >
  </essential-table>
</template>
<script src="./NotificacionPage.ts"></script>
