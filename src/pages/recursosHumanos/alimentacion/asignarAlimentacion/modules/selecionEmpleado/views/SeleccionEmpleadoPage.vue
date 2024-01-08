<template>
  <!-- <q-page padding> -->
    <essential-selectable-table
      :configuracion-columnas="configuracionColumnasItemsPreorden"
      :datos="listado"
    />
    <essential-table
      ref="refListado"
      titulo="Listado de empleados"
      :configuracionColumnas="configuracionColumnasSeleccionEmpleados"
      :datos="listado"
      tipo-seleccion="multiple"
      :permitirConsultar="true"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirFiltrar="false"
      :ajustarCeldas="true"
      ></essential-table>
    <q-card-actions
        class="q-gutter-xs"
        :class="{ 'justify-end': !$q.screen.xs }"
      >
        <q-btn
          color="primary"
          :class="{ 'full-width': $q.screen.xs }"
          no-caps
          push
          @click="seleccionar"
        >
          <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
          <span>Seleccionar</span>
        </q-btn>

        <q-btn
          color="negative"
          :class="{ 'full-width': $q.screen.xs }"
          no-caps
          push
          @click="cerrarModal"
        >
          <q-icon name="bi-x-lg" size="xs" class="q-pr-sm"></q-icon>
          <span>Cancelar</span>
        </q-btn>
      </q-card-actions>
  <!-- </q-page> -->
</template>

<script src="./SeleccionEmpleadoPage.ts"></script>
