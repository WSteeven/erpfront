<template>
  <q-page padding>
    <slot name="modales" />

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
        @click="forzarListar()"
      />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      :class="{ 'rounded-tabpanel': !$q.screen.xs }"
      keep-alive
    >
      <!-- Formulario -->
      <q-tab-panel name="formulario" :class="{ 'q-pa-none': full }">
        <slot name="formulario" />
        <div :class="{ 'q-pa-md': full }">
          <div class="row justify-end">
            <q-btn
              v-if="accionButtonSubmit && accionButtonSubmit.visible()"
              :color="accionButtonSubmit.color"
              no-caps
              push
              class="q-mr-sm"
              @click="accionButtonSubmit.accion()"
            >
              <q-icon
                :name="accionButtonSubmit.icono"
                size="xs"
                class="q-pr-sm"
              ></q-icon>
              <span>{{ accionButtonSubmit.titulo }}</span>
            </q-btn>

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
        <essential-table-tabs
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
          :accion6="accion6"
          :accion7="accion7"
          :accion8="accion8"
          :accion1Header="accion1Header"
          :accion2Header="accion2Header"
          :accion3Header="accion3Header"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
          :tab-options="tabOptions"
          @tab-seleccionado="aplicarFiltro"
          :tab-defecto="tabDefecto"
          :ajustarCeldas="ajustarCeldas"
        ></essential-table-tabs>
        <!-- :tab-defecto="tabDefecto" -->
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script src="./TabLayoutFilterTabs2.ts"></script>
<style>
.rounded-3 {
  border-radius: 28px;
}
</style>
