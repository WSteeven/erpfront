<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-pb-md">
      <div class="text-bold q-mb-md">{{ fecha }}</div>
      <div class="text-h5 q-mb-md">
        Bienvenido, {{ authenticationStore.nombreUsuario }}
      </div>
      <div v-if="authenticationStore.user?.grupo" class="text-h6 q-mb-md">
        Grupo, {{ authenticationStore.user.grupo }}
      </div>
    </div>

    <essential-table-tabs
      titulo=""
      :configuracionColumnas="[
        ...configuracionColumnasSubtareas,
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
      :mostrar-botones="false"
      :tab-options="tabTrabajoAsignado"
      @tab-seleccionado="aplicarFiltro"
      tab-defecto="ASIGNADO"
    ></essential-table-tabs>

    <modales-entidad :comportamiento="modales" :confirmar-cerrar="true" />

    <confirmar-dialog
      :visible="mostrarDialogPlantilla"
      :comportamiento="modales"
      @seleccionar="plantillaSeleccionada"
      @cerrar="mostrarDialogPlantilla = false"
    ></confirmar-dialog>
  </q-page>
</template>

<script src="./TrabajoAsignadoPage.ts"></script>
