<template>
  <!-- Tabla de notificaciones -->
  <q-page padding>
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
  </q-page>
</template>
<script src="./NotificacionPage.ts"></script>
