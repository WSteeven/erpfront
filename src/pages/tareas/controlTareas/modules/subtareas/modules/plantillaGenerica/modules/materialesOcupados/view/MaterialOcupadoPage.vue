<template>
  <q-page>
    <div class="text-bold q-mb-md">Material usado</div>
    <essential-table
      titulo="Material usado en ésta actividad"
      :configuracionColumnas="columnas"
      :datos="materiales"
      :alto-fijo="false"
      :permitirConsultar="false"
      :permitirEliminar="false"
      :permitirEditar="false"
      :accion1="botonEditarCantidad"
      :mostrar-footer="false"
      separador="cell"
      tipo-seleccion="multiple"
      :mostrar-botones="false"
      @eliminar="eliminarMaterial"
      :entidad="ControlMaterialSubtarea"
    ></essential-table>
    <!-- :accion1Header="agregarMaterial" -->
    <div class="row justify-end q-gutter-sm q-pt-md">
      <!-- Boton guardar -->
      <q-btn color="primary" type="submit" no-caps push @click="guardar()">
        <q-icon name="bi-save" size="xs" class="q-pr-sm"></q-icon>
        <span>Guardar</span>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./MaterialOcupadoPage.ts"></script>
