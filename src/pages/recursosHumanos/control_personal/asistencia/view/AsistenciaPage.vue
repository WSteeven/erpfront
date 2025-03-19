<template>
  <q-page padding>
    <!-- Botón de actualización -->
    <div class="col-12 row justify-end q-gutter-sm q-mb-md">
      <q-btn color="primary" no-caps @click="actualizarAsistencias">
        <q-icon name="bi-arrow-clockwise" size="xs" class="q-pr-sm"></q-icon>
        <span>Actualizar Asistencias</span>
      </q-btn>
    </div>

    <!-- Tabla de asistencias -->
    <essential-table-pagination
      :mixin="mixin"
      titulo="Asistencias"
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      :permitirConsultar="true"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirFiltrar="true"
      :ajustarCeldas="true"
      @toggle-filtros="listarListado"
      @filtrar="aplicarFiltro"
      paginate
    ></essential-table-pagination>
  </q-page>
</template>

<script src="./AsistenciaPage.ts"></script>
