<template>
  <!-- Tabla de notificaciones -->
  <q-page padding>
    <essential-table
      :titulo="'Tiene ' + totalNoLeidas + ' notificaciones pendientes de leer.'"
      :configuracionColumnas="[...configuracionColumnas, accionesTabla]"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrarBotones="false"
      :accion1="BotonMarcarLeido"
      ajustarCeldas
    >
    </essential-table>
  </q-page>
</template>
<script src="./NotificacionPage.ts"></script>
