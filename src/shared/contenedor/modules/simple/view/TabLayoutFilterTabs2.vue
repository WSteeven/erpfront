<template>
  <q-page padding>
    <!-- Tabs -->
    <!-- switch-indicator -->
    <div v-if="tituloPagina" class="text-h5 text-bold q-mb-md">
      {{ tituloPagina }}
    </div>

    <q-tabs
      v-model="tabs"
      align="left"
      active-class="tab-active"
      indicator-color="primary"
      dense
      class="border-bottom"
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
      <q-tab
        v-if="customPanel1?.label"
        :name="customPanel1?.label"
        :label="customPanel1?.label"
        :class="{ 'tab-inactive': tabs !== customPanel1?.label }"
        no-caps
        @click="ejecutarUnaVezCustomPanel1()"
      />
      <q-tab
        v-if="customPanel2?.label"
        :name="customPanel2?.label"
        :label="customPanel2?.label"
        :class="{ 'tab-inactive': tabs !== customPanel2?.label }"
        no-caps
        @click="ejecutarUnaVezCustomPanel2()"
      />
    </q-tabs>

    <!-- Tab content -->
    <q-tab-panels
      v-model="tabs"
      animated
      transition-prev="scale"
      transition-next="scale"
      class="borde rounded custom-shadow5 q-mt-lg"
      keep-alive
    >
      <!-- :class="{ 'bg-desenfoque border-white rounded-tabpanel': !$q.screen.xs }" -->
      <!-- Formulario -->
      <q-tab-panel name="formulario" class="q-pa-none">
        <slot name="formulario" />
        <div>
          <div class="row justify-end q-col-gutter-x-xs q-mt-xl">
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

            <slot name="custom-buttons"></slot>

            <button-submits
              v-if="mostrarButtonSubmits"
              :accion="accion"
              :permitirGuardar="puedeCrear"
              :permitirCancelar="permitirCancelar"
              :disabled="storeCargando.cargando"
              :labelGuardar="labelGuardar"
              :labelEditar="labelEditar"
              @cancelar="reestablecer()"
              @editar="editar(entidad, resetFormularioOnUpdate)"
              @eliminar="eliminar(entidad, cbEliminar)"
              @guardar="guardar(entidad)"
            />
          </div>
        </div>
      </q-tab-panel>

      <!-- Listado -->
      <q-tab-panel name="listado" class="q-pa-none">
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
          :mostrarExportar="puedeExportar"
          @consultar="accionTabla.consultar"
          @editar="accionTabla.editar"
          @eliminar="accionTabla.eliminar"
          :tab-options="tabOptions"
          @tab-seleccionado="aplicarFiltro"
          :tab-defecto="tabDefecto"
          :ajustarCeldas="ajustarCeldas"
          :mixin="mixin"
          :paginate="paginate"
          :permitirFiltrar="permitirFiltrar"
        ></essential-table-tabs>
        <!-- :tab-defecto="tabDefecto" -->
      </q-tab-panel>

      <q-tab-panel :name="customPanel1?.label">
        <slot :name="customPanel1?.label" />
      </q-tab-panel>

      <q-tab-panel :name="customPanel2?.label">
        <slot :name="customPanel2?.label" />
      </q-tab-panel>
    </q-tab-panels>

    <div v-show="tabs == 'formulario'">
      <slot name="formulario-2" />
    </div>

    <slot name="modales" />
  </q-page>
</template>

<script src="./TabLayoutFilterTabs2.ts"></script>
<style>
.rounded-3 {
  border-radius: 28px;
}
</style>
