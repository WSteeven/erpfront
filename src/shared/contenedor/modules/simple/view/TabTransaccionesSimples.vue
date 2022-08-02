<template>
  <section>
    <div class="card p-4">
      <slot name="modales" />

      <!-- Tabs pestañas -->
      <ul class="nav nav-tabs mb-4" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{active: tabIndex === 0}"
            data-bs-toggle="pill"
            data-bs-target="#firstTab"
            type="button"
            role="tab"
            @click="tabIndex = 0"
          >
            <i class="bi-pencil-square"></i> Formulario
          </button>
        </li>
        <li v-if="mostrarTabListado" class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{active: tabIndex === 1}"
            data-bs-toggle="pill"
            data-bs-target="#secondTab"
            type="button"
            role="tab"
            @click="tabIndex = 1"
          >
            <i class="bi-list"></i> Listado
          </button>
        </li>
      </ul>

      <!-- Contenido de los tabs -->
      <div class="tab-content" id="pills-tabContent">
        <!-- Tab 1 -->
        <div
          class="tab-pane fade show"
          :class="{active: tabIndex === 0}"
          id="firstTab"
          role="tabpanel"
        >
          <slot name="formulario" />
          <button-submits
            :accion="accion"
            :mostrarModificar="mostrarModificar"
            :mostrarCancelar="mostrarCancelar"
            @cancelar="reestablecer()"
            @editar="editar(entidad, resetFormularioOnUpdate)"
            @eliminar="eliminar(entidad, cbEliminar)"
            @guardar="guardar(entidad)"
          />
        </div>

        <!-- Tab 2 -->
        <div
          v-if="mostrarTabListado"
          class="tab-pane fade show"
          :class="{active: tabIndex === 1}"
          id="secondTab"
          role="tabpanel"
        >
          <div class="col d-md-flex mb-2 align-items-md-end d-grid gap-2">
            <div class="flex-grow-1">
              <label class="form-label">Búsqueda</label>
              <input
                v-model="filtros.search"
                type="search"
                class="form-control"
                placeholder="Buscar..."
                @keydown.enter="obtenerListadoFiltrado"
              />
            </div>
            <button class="btn btn-primary" @click="obtenerListadoFiltrado">
              <i class="bi bi-search"></i> Consultar
            </button>
          </div>

          <!-- Cabecera tabla listado -->
          <div class="container-fluid mt-1">
            <div class="row cabecera-listado py-2">
              <div
                class="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0"
              >
                <small>Listado de {{ tituloTabla }}</small>
              </div>

              <!-- Accciones -->
              <div
                class="col-12 col-md-6 d-flex justify-content-center justify-content-md-end"
              >
                <div class="navbar-nav gap-4 d-flex flex-row">
                  <!-- Exportar -->
                  <div
                    class="nav-item"
                    @click="descargarListado('xlsx')"
                    v-tooltip:top="'Exportar excel'"
                  >
                    <i class="bi bi-download"></i>
                  </div>
                  <!-- Importar -->
                  <div
                    class="nav-item"
                    @click="mostrarImportarExcel"
                    v-tooltip:top="'Importar excel'"
                  >
                    <i class="bi bi-upload"></i>
                  </div>
                  <!-- Imprimir -->
                  <div
                    class="nav-item"
                    @click="descargarListado('xlsx')"
                    v-tooltip:top="'Imprimir'"
                  >
                    <i class="bi bi-printer"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <listado
            :configuracion="configuracionTabla"
            :elementos="listado"
            :estilos="{height: 'calc(95vh - 375px)'}"
            :selection-type="tipoSeleccion.UNA_FILA"
          />
        </div>
      </div>
    </div>

    <!-- importar excel -->
    <importar-excel
      ref="refImportarExcel"
      :configuracion="configuracionPlantilla"
      @importar="importarListado"
    />
  </section>
</template>

<script lang="ts" src="./TabTransaccionesSimples.ts"></script>

<style lang="scss" scoped>
.cabecera-listado {
  background: #f5f7f7;
  border: 1px solid #cccccc;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
  padding: 2px 0;

  .nav-item {
    cursor: pointer;
    color: $primary;
  }
}
</style>
