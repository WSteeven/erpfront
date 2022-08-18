<template>
  <essential-table
    titulo="subtareas"
    :configuracionColumnas="configuracionColumnasSubtareas"
    :datos="listado"
  ></essential-table>

  <div class="row justify-end q-gutter-sm q-pt-md">
    <q-btn color="positive" no-caps rounded push>
      <q-icon name="bi-plus" class="q-pr-sm"></q-icon>
      <div>Agregar nueva subtarea</div>
    </q-btn>
  </div>
</template>

<script src="./SubtareasContent.ts"></script>
