<template>
  <q-page>
    <div class="q-mb-md">
      Código de subtarea: <b>{{ codigoSubtarea }}</b>
    </div>

    <q-card class="rounded-card custom-shadow q-pa-md">
      <div
        v-if="esCoordinador"
        class="col-12 rounded-card q-py-sm q-mb-md text-center text-accent bg-yellow-2"
      >
        <div>
          <q-icon
            name="bi-exclamation-triangle-fill
"
            class="q-mr-sm"
          ></q-icon>
          <div>
            Cualquier cambio realizado aquí sobreescribirá el seguimiento hecho
            por el técnico.
            <br />
            Se recomienda cerrar y abrir el seguimiento para tener las más
            recientes actualizaciones ingresadas por el técnico.
          </div>
          <b>Advertencia</b>
        </div>
      </div>
      <div class="row">
        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="emergencia.trabajo_realizado"
            :configuracion-columnas="configuracionColumnasTrabajoRealizado"
            @actualizar="(data) => (emergencia.trabajo_realizado = data)"
            :mostrarAccion1Header="permitirSubir"
            :entidad="TrabajoRealizado"
            :accion1="verFotografia"
          ></tabla-filas-dinamicas>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="usarMaterialTarea"
            label="Utilizar material de la tarea"
            dense
          ></q-checkbox>
        </div>

        <div v-if="usarMaterialTarea" class="col-12 q-mb-md">
          <q-card class="rounded-card">
            <q-tabs
              v-model="tab"
              class="text-primary"
              :class="{ 'bg-grey-1': !$q.dark.isActive }"
              active-color="primary"
              align="justify"
              no-caps
              inline-label
            >
              <q-tab
                name="usar_material_tarea"
                label="Usar material de tarea"
              />
              <!-- <q-tab
                name="historial_material_tarea_usado"
                label="Historial de material de tarea usado"
              >
              </q-tab> -->
            </q-tabs>

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="usar_material_tarea">
                <essential-table
                  titulo="Materiales designados para la tarea"
                  :configuracionColumnas="columnasMaterial"
                  :datos="materialesTarea"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitir-buscar="false"
                  :permitirEditarModal="true"
                  separador="cell"
                  :accion1="botonEditarCantidadTarea"
                ></essential-table>
              </q-tab-panel>

              <q-tab-panel name="historial_material_tarea_usado">
                <essential-table
                  titulo="Historial material tarea usado"
                  :configuracionColumnas="columnasMaterial"
                  :datos="materialesTarea"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitir-buscar="false"
                  :permitirEditarModal="true"
                  separador="cell"
                  :accion1="botonEditarCantidadTarea"
                ></essential-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <div
          v-if="subtarea.cliente_id !== clientes.TELCONET"
          class="col-12 q-mb-md"
        >
          <br />
          <q-checkbox
            v-model="usarStock"
            label="Utilizar material del stock personal"
            dense
          ></q-checkbox>
        </div>

        <div v-if="usarStock" class="col-12 q-mb-md">
          <essential-table
            titulo="Materiales del stock personal"
            :configuracionColumnas="columnasMaterial"
            :datos="materialesStock"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :permitir-buscar="false"
            :permitirEditarModal="true"
            separador="cell"
            :accion1="botonEditarCantidadStock"
          ></essential-table>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="existeObservaciones"
            label="Agregar observaciones"
            dense
          ></q-checkbox>
        </div>

        <div v-if="existeObservaciones" class="col-12 q-mb-md">
          <tabla-observaciones
            :listado="emergencia.observaciones"
            @actualizar="(data) => (emergencia.observaciones = data)"
          ></tabla-observaciones>
        </div>

        <div
          v-if="subtarea.cliente_id !== clientes.TELCONET"
          class="col-12 q-mb-md"
        >
          <br />
          <q-checkbox
            v-model="existeMaterialesDevolucion"
            label="Seleccionar materiales para devolución (Desmontaje)"
            dense
          ></q-checkbox>
        </div>

        <div v-if="existeMaterialesDevolucion" class="col-12 q-mb-md">
          <tabla-devolucion-producto
            :listado="emergencia.materiales_devolucion"
            :listadoProductos="listadosAuxiliares.productos"
            @actualizar="(data) => (emergencia.materiales_devolucion = data)"
            :alto-fijo="false"
            :mostrarFooter="!emergencia.materiales_devolucion.length"
          >
          </tabla-devolucion-producto>
        </div>

        <div class="col-12 q-mb-md">
          <archivo-seguimiento
            ref="refArchivoSeguimiento"
            :mixin="mixinArchivoSeguimiento"
            :endpoint="endpoint"
            :permitir-eliminar="permitirSubir"
          ></archivo-seguimiento>
        </div>
      </div>

      <div class="row justify-end q-col-gutter-x-xs">
        <!-- <q-btn
          v-if="esCoordinador"
          color="positive"
          no-caps
          push
          class="q-mr-sm"
          @click="descargarExcel()"
        >
          <q-icon name="bi-file-spreadsheet" size="xs" class="q-pr-sm"></q-icon>
          <span>Descargar Excel</span>
        </q-btn> -->

        <button-submits
          :accion="accion"
          @cerrar-modal="emit('cerrar-modal')"
          @cancelar="reestablecer()"
          @editar="editarSeguimiento()"
          @guardar="guardarSeguimiento()"
        />
      </div>
    </q-card>

    <visor-imagen ref="refVisorImagen"></visor-imagen>
  </q-page>
</template>

<script src="./SeguimientoSubtareaPage.ts"></script>
