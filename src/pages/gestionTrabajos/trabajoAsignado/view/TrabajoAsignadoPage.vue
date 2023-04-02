<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-my-md">
      <div class="q-mb-md">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <div class="q-mb-md">{{ fecha }}</div>
      <!--<div v-if="authenticationStore.user?.grupo" class="q-mb-md">
        Grupo, <strong>{{ authenticationStore.user.grupo }}</strong>
      </div> -->
    </div>

    <essential-table-tabs
      titulo="Listado de trabajos"
      :configuracionColumnas="[
        ...configuracionColumnasTrabajoAsignado,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonVer"
      :accion2="botonIniciar"
      :accion3="botonFormulario"
      :accion4="botonPausar"
      :accion5="botonReanudar"
      :accion6="botonSuspender"
      :accion7="botonRealizar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabTrabajoAsignado"
      @tab-seleccionado="filtrarTrabajoAsignado"
      tab-defecto="AGENDADO"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modales" :mixin-modal="mixin" />

    <!-- <confirmar-dialog
      :visible="mostrarDialogPlantilla"
      :comportamiento="modales"
      @seleccionar="plantillaSeleccionada"
      @cerrar="mostrarDialogPlantilla = false"
    ></confirmar-dialog> -->
  </q-page>
</template>

<script src="./TrabajoAsignadoPage.ts"></script>
