<template>
  <!-- Tabla de notificaciones -->
  <q-page padding>
    <essential-table
      :titulo="'Tiene ' + totalNoLeidas + ' notificaciones pendientes de leer.'"
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrarBotones="false"
      :accion1="BotonMarcarLeido"
      :permitir-buscar="false"
    >
    </essential-table>
  </q-page>
</template>
<script src="./NotificacionPage.ts"></script>
