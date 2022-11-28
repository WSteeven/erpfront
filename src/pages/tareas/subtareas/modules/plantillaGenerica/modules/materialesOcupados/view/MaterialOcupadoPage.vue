<template>
  <div class="text-bold q-mb-md">Material usado</div>
  <essential-table
    titulo="Material usado en ésta actividad"
    :configuracionColumnas="configuracionColumnasControlMaterialSubtarea"
    :datos="materiales"
    :alto-fijo="false"
    :permitirConsultar="false"
    :permitirEliminar="false"
    :permitirEditarModal="true"
    :mostrar-footer="false"
    separador="cell"
    :mostrar-botones="false"
    :agregarElemento="agregarMaterial"
    @eliminar="eliminarMaterial"
    :entidad="ControlMaterialSubtarea"
  ></essential-table>
  <div class="row justify-end q-gutter-sm q-pt-md">
    <!-- Boton guardar -->
    <q-btn color="primary" type="submit" no-caps push @click="guardar()">
      <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
      <span>Guardar</span>
    </q-btn>
  </div>
</template>

<script src="./MaterialOcupadoPage.ts"></script>
