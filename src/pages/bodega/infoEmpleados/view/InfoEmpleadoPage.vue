<template>
  <q-page padding>
    <essential-table
      titulo="Empleados "
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirFiltrar="false"
    ></essential-table>
  </q-page>
</template>
<script src="./InfoEmpleadoPage.ts"></script>
