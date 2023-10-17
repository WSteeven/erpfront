<template>
  <q-page :padding="!$q.screen.xs">
    <transition name="scale" mode="out-in">
      <slot name="modales" />
    </transition>

    <div class="text-right">
      <b class="block text-subtitle1 text-thin text-primary">
        <!-- <q-icon name="bi-app-indicator" class="q-mr-sm"></q-icon> -->
        {{ tituloTabla }}</b
      >
      <small class="text-grey-9 text-bold">{{ subtituloPagina }}</small>
    </div>

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
      <q-tab
        v-if="mostrarCustomListado"
        name="custom-listado"
        label="Listado"
        :class="{ 'tab-inactive': tabs !== 'custom-listado' }"
        no-caps
      />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      helpalive
      :class="{ 'rounded-tabpanel': !$q.screen.xs }"
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" :class="{ 'q-pa-none': full }">
        <slot name="formulario" />
        <div :class="{ 'q-pa-md': full }">
          <div class="row justify-end q-col-gutter-x-xs">
            <button-submits
              v-if="mostrarButtonSubmits"
              :accion="accion"
              :permitirGuardar="puedeCrear"
              :disabled="storeCargando.cargando"
              :labelGuardar="labelGuardar"
              @cancelar="reestablecer()"
              @editar="editar(entidad, resetFormularioOnUpdate)"
              @eliminar="eliminar(entidad, cbEliminar)"
              @guardar="guardar(entidad)"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- Listado -->
      <q-tab-panel name="listado">
        <essential-table
          :titulo="tituloTabla"
          :configuracionColumnas="columnas"
          :datos="listado"
          :permitirConsultar="puedeVer"
          :permitirEditar="puedeEditar"
          :permitirEliminar="puedeEliminar"
          :accion1="accion1"
          :accion2="accion2"
          :accion3="accion3"
          :accion4="accion4"
          :accion5="accion5"
          :accion1Header="accion1Header"
          :accion2Header="accion2Header"
          :accion3Header="accion3Header"
          :accion4Header="accion4Header"
          :permitirFiltrar="puedeFiltrar"
          :mostrarExportar="puedeExportar"
          :ajustarCeldas="ajustarCeldas"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
          @filtrar="filtrarTodos"
        ></essential-table>
      </q-tab-panel>

      <!-- Custom listado -->
      <q-tab-panel name="custom-listado">
        <slot name="custom-listado" />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script src="./TabLayout.ts"></script>
