<template>
  <div class="q-mb-md">
    <essential-table-tabs
      :configuracionColumnas="configuracionColumnas"
      :datos="listado"
      :accion1="botonEditarSubtarea"
      :accion2="botonControlAvance"
      :accion3="botonAsignar"
      :accion4="botonFinalizar"
      :accion5="botonCancelar"
      :accion6="botonReagendar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :tab-options="tabOptions"
      :alto-fijo="false"
      :mostrarFooter="false"
      tabDefecto="CREADO"
      @tab-seleccionado="aplicarFiltro"
      :agregarElemento="agregarSubtarea"
    ></essential-table-tabs>
  </div>

  <small
    v-if="estado === estadosSubtareas.SUSPENDIDO"
    class="text-accent q-py-md block"
  >
    <q-icon
      name="bi-exclamation-triangle-fill"
      class="q-mr-sm"
      size="xs"
    ></q-icon>
    No se pueden agregar más subtareas porque la subtarea principal está
    suspendida.
  </small>

  <small
    v-if="estado === estadosSubtareas.SUSPENDIDO"
    class="text-positive q-mb-md block"
    ><q-icon name="bi-info-circle-fill" class="q-mr-sm" size="xs"></q-icon>Para
    continuar gestionando esta tarea cambie el estado de la subtarea principal a
    reagendado o cancélela definitivamente.
  </small>

  <small
    v-if="estado === estadosSubtareas.CANCELADO"
    class="text-bold text-negative q-mb block"
  >
    <q-icon name="bi-x-octagon-fill" class="q-mr-sm" size="xs"></q-icon>
    No puede agregar subtareas porque la tarea ha sido cancelada.</small
  >
  <!--:accion3="botonSolicitarMaterial"-->

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareasListadoContent.ts"></script>
