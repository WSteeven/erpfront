<template>
  <!-- Modal -->
  <div ref="refImportarExcel" class="modal fade">
    <div class="modal-dialog modal-xl modal-fullscreen-sm-down">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title">Importar excel</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <!-- Body -->
        <div class="modal-body">
          <form ref="refFormulario" @submit.prevent class="mb-2">
            <div class="row">
              <div class="col">
                <div class="input-group">
                  <input
                    ref="refInputFile"
                    type="file"
                    class="form-control"
                    accept=".xlsx"
                    @change="procesarArchivo"
                  />
                </div>
              </div>
            </div>
          </form>
          <listado
            :configuracion="configuracionTabla"
            :elementos="listado"
            :estilos="{height: 'calc(95vh - 375px)'}"
          />
        </div>
        <!-- Footer -->
        <div class="modal-footer">
          <div class="col d-grid gap-2 d-md-flex justify-content-md-end">
            <button class="btn btn-success" @click="descargarPlantilla()">
              <i :class="iconos.descargar" class="me-1" />
              Descargar plantilla
            </button>

            <button
              :disabled="listado.length === 0"
              class="btn btn-primary"
              @click="emitEventImportar()"
            >
              <i :class="iconos.guardar" class="me-1" />
              Guardar
            </button>

            <button class="btn btn-danger" @click="ocultar()">
              <i :class="iconos.cancelar" class="me-1" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./ImportarExcel.ts"></script>
