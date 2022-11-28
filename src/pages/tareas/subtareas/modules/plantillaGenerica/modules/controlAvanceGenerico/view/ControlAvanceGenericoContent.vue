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

    <div class="q-mb-md">
      <essential-table
        titulo="Actividades realizadas"
        :configuracionColumnas="columnasTrabajoRealizado"
        :datos="actividadesRealizadas"
        :alto-fijo="false"
        :permitirConsultar="false"
        :permitirEliminar="false"
        :permitirEditarModal="true"
        :mostrar-footer="false"
        separador="cell"
        :mostrar-botones="false"
        :agregarElemento="agregarActividad"
        @eliminar="tablaActividadRealizada.eliminar"
        :accion1="materiales"
        :entidad="TrabajoRealizado"
      ></essential-table>
      <!--@editar="tablaTrabajoRealizado.editar"-->
    </div>

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

    <!--<div class="q-mb-md">
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
      </div> -->
    <!--:agregarElemento="agregarMaterial"-->

    <!-- Botones formulario -->
    <!--<div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
        <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
        <div>Volver</div>
      </q-btn>
    </div> -->
    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./ControlAvanceGenericoContent.ts"></script>
