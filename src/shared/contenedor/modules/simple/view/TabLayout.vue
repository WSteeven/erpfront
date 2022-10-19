<template>
  <q-page padding>
    <slot name="modales" />

    <div class="text-h6 q-mb-md" :class="{ 'q-ml-md': $q.screen.xs }">
      {{ tituloPagina }}
    </div>

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
      <q-tab-panel name="listado" class="q-py-none">
        <essential-table
          :titulo="tituloTabla"
          :configuracionColumnas="columnas"
          :datos="listado"
          :permitirConsultar="puedeVer"
          :permitirEditar="puedeEditar"
          :permitirEliminar="puedeEliminar"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
        ></essential-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script src="./TabLayout.ts"></script>
