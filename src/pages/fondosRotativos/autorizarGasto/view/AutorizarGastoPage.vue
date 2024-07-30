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
          accionesTabla,
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
      ></essential-table-tabs>
    </div>
    <modal-entidad
      :comportamiento="modales"
      @guardado="guardado"
      :mostrarListado="false"
    >
      <template>
        <div
          class="q-pa-md q-gutter-sm flex flex-center"
          v-if="
            usuario.id == gasto.aut_especial &&
            gasto.estado_info == 'POR APROBAR'
          "
        >
          <q-btn color="positive" @click="aprobar_gasto(gasto, 'aprobar')">
            <q-icon name="bi-check-circle" size="xs"></q-icon>Aprobadddr</q-btn
          >
          <q-btn color="negative" @click="aprobar_gasto(gasto, 'rechazar')">
            <q-icon name="bi-x-circle" size="xs"></q-icon>Rechazar</q-btn
          >
        </div>
        <div
          class="q-pa-md q-gutter-sm flex flex-center"
          v-if="
            (usuario.id == gasto.aut_especial ||
              authenticationStore.esAdministrador) &&
            gasto.estado_info == 'APROBADO' &&
            estaSemanAC == true
          "
        >
          <q-btn color="negative" @click="aprobar_gasto(gasto, 'anular')">
            <q-icon name="bi-x-circle" size="xs"></q-icon>Anular</q-btn
          >
        </div>
      </template>
    </modal-entidad>
  </q-page>
</template>

<script src="./AutorizarGastoPage.ts"></script>
