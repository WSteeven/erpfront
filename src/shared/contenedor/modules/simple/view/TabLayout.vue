<template>
  <q-page :padding="!$q.screen.xs">
    <!-- Tabs -->
    <q-tabs v-model="tabs" align="left" narrow-indicator class="q-mb-lg">
      <q-tab
        v-if="mostrarFormulario"
        name="formulario"
        label="Formulario"
        no-caps
      />
      <q-tab v-if="mostrarListado" name="listado" label="Listado" no-caps />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      :class="{ 'custom-shadow rounded': !$q.screen.xs }"
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" :class="{ 'q-pa-none': full }">
        <slot name="formulario" />
        <button-submits
          v-if="mostrarButtonSubmits"
          :accion="accion"
          :permitirGuardar="puedeCrear"
          @cancelar="reestablecer()"
          @editar="editar(entidad, resetFormularioOnUpdate)"
          @eliminar="eliminar(entidad, cbEliminar)"
          @guardar="guardar(entidad)"
        />
      </q-tab-panel>
      <!-- Listado -->
      <!-- :initialPagination="pagination" -->
      <q-tab-panel name="listado">
        <essential-table
          :titulo="tituloTabla"
          :configuracionColumnas="columnas"
          :datos="listado"
          :permitirConsultar="puedeVer"
          :permitirEditar="puedeEditar"
          :permitirEliminar="puedeEliminar"
          :accion1="accion1"
          @onScroll="cargarListado"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
        ></essential-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script src="./TabLayout.ts"></script>
