<template>
  <q-dialog
    v-model="abierto"
    :maximized="true"
    :full-width="true"
    :persistent="confirmarCerrar"
  >
    <q-card class="bg-body">
      <!-- <q-linear-progress :value="1" color="grey-4" /> -->
      <q-toolbar>
        <q-avatar square>
          <img src="~assets/logo.svg" />
        </q-avatar>

        <q-toolbar-title>{{ titulo }}</q-toolbar-title>

        <q-btn
          flat
          round
          :class="{
            'bg-grey-9': $q.dark.isActive,
            'bg-grey-4': !$q.dark.isActive,
          }"
          icon="bi-x"
          @click="cerrarModalEntidad()"
        >
          <q-tooltip class="bg-dark">Cerrar</q-tooltip>
        </q-btn>
        <!--v-close-popup -->
      </q-toolbar>

      <q-card-section>
        <component
          v-if="mixin"
          :is="componente"
          :mixin-modal="mixin"
          @seleccionar="emit('seleccionar')"
          @cerrar-modal="cerrarModalEntidad()"
        ></component>

        <component
          v-else
          :is="componente"
          @seleccionar="emit('seleccionar')"
          @cerrar-modal="cerrarModalEntidad()"
        ></component>
        <!-- :mostrar-listado="false"></component> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script src="./ModalEntidad.ts"></script>
