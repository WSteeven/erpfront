<template>
  <q-page padding>
    <slot name="modales" />

    <!-- Tabs -->
    <q-tabs
      v-model="tabs"
      align="left"
      switch-indicator
      active-class="tab-active"
      indicator-color="transparent"
      dense
    >
      <q-tab
        v-if="mostrarFormulario"
        name="formulario"
        label="Formulario"
        :class="{ 'tab-inactive': tabs !== 'formulario' }"
        no-caps
      />
      <q-tab
        v-if="mostrarListado"
        name="listado"
        label="Listado"
        :class="{ 'tab-inactive': tabs !== 'listado' }"
        no-caps
      />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      :class="{ 'rounded-tabpanel': !$q.screen.xs }"
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" :class="{ 'q-pa-none': full }">
        <slot name="formulario" />
        <div :class="{ 'q-pa-md': full }">
          <button-submits
            v-if="mostrarButtonSubmits"
            :accion="accion"
            :permitirGuardar="puedeCrear"
            @cancelar="reestablecer()"
            @editar="editar(entidad, resetFormularioOnUpdate)"
            @eliminar="eliminar(entidad, cbEliminar)"
            @guardar="guardar(entidad)"
          />
        </div>
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
          :accion1="accionPersonalizada"
          :accion2="accion2"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
          :tab-options="tabOptions"
          @tab-seleccionado="aplicarFiltro"
        ></essential-table-tabs>
        <!--@onScroll="cargarListado" -->
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
