<template>
  <q-dialog
    v-model="abierto"
    :maximized="true"
    :full-width="true"
    :persistent="confirmarCerrar"
  >
    <q-card class="bg-desenfoque" :class="{ 'q-py-md q-px-xl': !$q.screen.xs }">
      <!-- <q-linear-progress :value="1" color="grey-4" /> -->
      <q-toolbar class="bg-body rounded-header" rounded>
        <q-avatar square>
          <img src="~assets/logo.svg" />
        </q-avatar>

        <q-toolbar-title class="text-primary"
          ><span>{{ titulo }}</span></q-toolbar-title
        >

        <q-btn
          round
          glossy
          unelevated
          color="grey-6"
          icon="bi-x"
          @click="cerrarModalEntidad()"
        >
          <q-tooltip class="bg-dark">Cerrar</q-tooltip>
        </q-btn>
        <!--v-close-popup -->
      </q-toolbar>

      <q-card-section class="bg-body rounded-footer">
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
