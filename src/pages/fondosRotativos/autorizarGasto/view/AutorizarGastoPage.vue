<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-pb-md">
      <div class="q-my-md">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <div v-if="authenticationStore.user?.grupo" class="q-mb-md">
        Grupo, <strong>{{ authenticationStore.user.grupo }}</strong>
      </div>
    </div>

    <div :class="{ 'bg-desenfoque rounded q-pa-sm': $q.screen.xs }">
      <essential-table-tabs
        :configuracionColumnas="[
          ...configuracionColumnasAutorizarGasto,
          accionesTabla
        ]"
        :datos="listado"
        :accion1="botonVerModalGasto"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :permitirBuscar="true"
        :mostrar-botones="false"
        :tab-options="tabAutorizarGasto"
        @tab-seleccionado="filtrarAutorizacionesGasto"
        tabDefecto="3"
        ajustarCeldas
      ></essential-table-tabs>
    </div>
    <modal-entidad
      :comportamiento="modales"
      @guardado="guardado"
      :mostrarListado="false"
    />
  </q-page>
</template>

<script src="./AutorizarGastoPage.ts"></script>
