<template>
  <!-- :maximized="$q.screen.xs" -->
  <q-dialog
    v-model="abierto"
    :full-width="true"
    :full-height="true"
    :persistent="persistente"
    maximized
  >
    <q-card class="bg-transparent no-border" flat>
      <!-- <q-linear-progress :value="1" color="grey-4" /> -->
      <q-toolbar class="bg-body border-bottom superior-fixed" rounded>
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title class="text-primary text-subtitle1"
          ><span>{{ titulo }}</span></q-toolbar-title
        >

        <div class="row q-gutter-x-sm">
          <q-btn round dense unelevated color="light-green" size="sm">
            <q-icon name="bi-arrows-angle-expand" size="14px"></q-icon>
            <q-tooltip class="bg-dark">Maximizar</q-tooltip>
          </q-btn>

          <q-btn
            round
            dense
            unelevated
            color="red"
            size="sm"
            @click="cerrarModalEntidad()"
          >
            <q-icon name="bi-x-lg" size="14px"></q-icon>
            <q-tooltip class="bg-dark">Cerrar</q-tooltip>
          </q-btn>
        </div>
        <!--v-close-popup -->
      </q-toolbar>

      <q-card-section class="bg-body rounded-footer superior-fixed-body">
        <component
          v-if="mixinModal"
          :is="componente"
          :mixin-modal="mixinModal"
          :accion="accion"
          :mostrarListado="mostrarListado"
          @cerrar-modal="
            (confirmarCerrar) => cerrarModalEntidad(confirmarCerrar)
            "
          @guardado="(data) => emit('guardado', data)"
          ></component>
          <!--  @seleccionar="emit('seleccionar')" -->

        <component
          v-else
          :is="componente"
          :accion="accion"
          :mostrarListado="mostrarListado"
          @cerrar-modal="
            (confirmarCerrar) => cerrarModalEntidad(confirmarCerrar)
            "
          @guardado="(data) => emit('guardado', data)"
          ></component>
        <!--  @seleccionar="emit('seleccionar')" -->
        <!-- :mostrar-listado="false"></component> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script src="./ModalEntidad.ts"></script>

<style>
.superior-fixed {
  position: fixed;
  top: 0;
  z-index: 99999;
}

.superior-fixed-body {
  position: relative;
  top: 50px;
  left: 0;
  right: 0;
}
</style>
