<template>
  <q-page :padding="!$q.screen.xs">
    <div class="text-center q-pb-md">
      <div class="q-mb-md">{{ fecha }}</div>
      <div class="q-mb-md">
        Bienvenido, <strong>{{ authenticationStore.nombreUsuario }}</strong>
      </div>
      <div v-if="authenticationStore.user?.grupo" class="q-mb-md">
        Grupo, <strong>{{ authenticationStore.user.grupo }}</strong>
      </div>
    </div>

    <essential-table-tabs
      :configuracionColumnas="[
        ...configuracionColumnasAutorizarGasto,
        accionesTabla,
      ]"
      :datos="listado"
      :accion1="botonAprobar"
      :accion2="botonRechazar"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :permitirBuscar="false"
      :mostrar-botones="false"
      :tab-options="tabAutorizarGasto"
      @tab-seleccionado="filtrarAutorizacionesGasto"
      tab-defecto="PENDIENTE"
    ></essential-table-tabs>
  </q-page>
</template>

<script src="./AutorizarGastoPage.ts"></script>
