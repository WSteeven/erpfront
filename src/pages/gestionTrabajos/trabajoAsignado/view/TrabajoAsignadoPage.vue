<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-my-md">
      <div class="q-mb-mdd">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <small class="block q-mb-md">{{ fecha }}</small>
      <q-btn
        color="transparent"
        class="q-px-md text-positive"
        no-caps
        dense
        unelevated
        rounded
        @click="abrirGuia()"
      >
        <q-icon
          name="bi-info-circle-fill"
          size="xs"
          class="q-mr-sm"
          color="primary"
        ></q-icon>
        <span class="text-primary">
          ¿Cómo funcionan los estados de las subtareas?
        </span>
      </q-btn>
    </div>

    <essential-table-tabs
      :titulo="
        'Tienes ' + listado.length + ' subtarea(s) en estado ' + tabActual
      "
      :configuracionColumnas="[
        ...configuracionColumnasTrabajoAsignado,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVer"
      :accion2="btnIniciar"
      :accion3="btnSeguimiento"
      :accion4="btnPausar"
      :accion5="btnReanudar"
      :accion6="btnSuspender"
      :accion7="btnRealizar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabTrabajoAsignado"
      @tab-seleccionado="filtrarTrabajoAsignado"
      :tab-defecto="tabActual"
    ></essential-table-tabs>

    <modales-entidad
      :comportamiento="modales"
      :mixin-modal="mixin"
      :confirmar-cerrar="false"
      :persistente="false"
    />

    <!-- <confirmar-dialog
      :visible="mostrarDialogPlantilla"
      :comportamiento="modales"
      @seleccionar="plantillaSeleccionada"
      @cerrar="mostrarDialogPlantilla = false"
    ></confirmar-dialog> -->
  </q-page>
</template>

<script src="./TrabajoAsignadoPage.ts"></script>
