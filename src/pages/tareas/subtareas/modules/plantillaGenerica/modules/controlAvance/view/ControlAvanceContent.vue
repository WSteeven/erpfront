<template>
  <q-page padding>
    <!--<div class="row q-col-gutter-sm q-mb-md">
      <div class="col-12 text-center q-mb-xl">
        <q-btn color="positive" no-caps>
          <q-icon name="bi-plus"></q-icon>
          Agregar avance</q-btn
        >
      </div>
    </div> -->

    <div v-if="cronologiaTrabajoRealizado">
      <div class="q-mb-md">
        <essential-table
          titulo="Cronología de trabajo realizado"
          :configuracionColumnas="columnasTrabajoRealizado"
          :datos="cronologiaTrabajoRealizado"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :permitirEditarModal="true"
          separador="cell"
          :agregarElemento="agregarAvance"
          @eliminar="tablaTrabajoRealizado.eliminar"
          @editar="tablaTrabajoRealizado.editar"
          :accion1="materiales"
        ></essential-table>
      </div>
      <!--:agregarElemento="agregarActividadRealizada"-->

      <!--<div class="q-mb-md">
        <essential-table
          titulo="Observaciones / Mejoras / Pendientes"
          :configuracionColumnas="columnasObservacion"
          :datos="observaciones"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :mostrar-header="false"
          :permitirEditarModal="true"
          @eliminar="tablaObservacion.eliminar"
          @editar="tablaObservacion.editar"
        ></essential-table>
      </div> -->

      <div class="q-mb-md">
        <essential-table
          titulo="Suma total de materiales ocupados"
          :configuracionColumnas="columnasMaterial"
          :datos="materiales"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :mostrar-header="false"
          :permitirEditarModal="true"
          separador="cell"
          @eliminar="tablaMateriales.eliminar"
          @editar="tablaMateriales.editar"
        ></essential-table>
        <!--:agregarElemento="agregarMaterial"-->
      </div>
    </div>

    <!-- Botones formulario -->
    <div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
        <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
        <div>Volver</div>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./ControlAvanceContent.ts"></script>
