<template>
  <q-dialog
    v-model="abierto"
    :maximized="$q.screen.xs"
    :full-width="true"
    :persistent="confirmarCerrar"
  >
    <q-card class="bg-transparent rounded-card no-border" flat>
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
          push
          color="negative"
          icon="bi-x"
          @click="cerrarModalEntidad()"
        >
          <q-tooltip class="bg-dark">Cerrar</q-tooltip>
        </q-btn>
        <!--v-close-popup -->
      </q-toolbar>

      <q-card-section class="bg-body rounded-footer">
        <component
          v-if="mixinModal"
          :is="componente"
          :mixin-modal="mixinModal"
          @cerrar-modal="cerrarModalEntidad()"
          @guardado="(data) => emit('guardado', data)"
        ></component>
        <!--  @seleccionar="emit('seleccionar')" -->

        <component
          v-else
          :is="componente"
          @cerrar-modal="cerrarModalEntidad()"
          @guardado="(data) => emit('guardado', data)"
        ></component>
        <!--  @seleccionar="emit('seleccionar')" -->
        <!-- :mostrar-listado="false"></component> -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script src="./ModalEntidad.ts"></script>
