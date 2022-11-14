<template>
  <q-page padding>
    <slot name="modales" />

    <!-- <div class="text-white text-h6 q-my-md q-ml-md">{{ tituloPagina }}</div> -->

    <!-- Tabs -->
    <q-tabs v-model="tabs" align="left" narrow-indicator class="q-mb-lg">
      <q-tab
        v-if="mostrarFormulario"
        name="formulario"
        label="Formulario"
        no-caps
      />
      <q-tab v-if="mostrarListado" name="listado" label="Listado"  no-caps />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="rounded-3"
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" class="q-py-none">
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
      <q-tab-panel name="listado">
        <essential-table-tabs
          :titulo="tituloTabla"
          :configuracionColumnas="columnas"
          :datos="listado"
          :permitirConsultar="puedeVer"
          :permitirEditar="puedeEditar"
          :permitirEliminar="puedeEliminar"
          @onScroll="cargarListado"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
          :tab-options="tabOptions"
          @tab-seleccionado="aplicarFiltro"
        ></essential-table-tabs>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script src="./TabLayoutFilterTabs.ts"></script>
<style>
.rounded-3 {
  border-radius: 28px;
}
</style>