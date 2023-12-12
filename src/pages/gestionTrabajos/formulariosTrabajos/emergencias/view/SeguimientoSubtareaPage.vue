<template>
  <q-page>
    <div class="column items-center justify-between q-gutter-sm q-mb-md">
      <div
        :class="{ 'text-center full-width': $q.screen.xs }"
        class="text-primary"
      >
        {{ 'Subtarea ' + subtarea.codigo_subtarea }}
      </div>

      <q-btn
        color="primary"
        no-caps
        push
        class="q-mr-sm"
        :class="{ 'full-width': $q.screen.xs }"
        @click="descargarExcel()"
      >
        <q-icon name="bi-file-spreadsheet" size="xs" class="q-pr-sm"></q-icon>
        <span>Descargar informe</span>
      </q-btn>
    </div>

    <q-card class="rounded-card custom-shadow q-pa-md">
      <div class="row">
        <div class="col-12 q-mb-md">
          <tabla-filas-dinamicas
            :listado="actividadesRealizadas"
            :configuracion-columnas="configuracionColumnasTrabajoRealizado"
            @guardarFila="(fila) => guardarFilaActividad(fila)"
            :mostrarAccion1Header="permitirSubir"
            :entidad="ActividadRealizadaSeguimientoSubtarea"
            :accion1="verFotografia"
            titulo="Cronología de actividades realizadas"
          ></tabla-filas-dinamicas>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-toggle
            v-model="mostrarSolicitudesAts"
            label="Solicitudes de ATS"
            checked-icon="bi-eye"
            color="positive"
            dense
          ></q-toggle>
        </div>

        <div v-if="mostrarSolicitudesAts" class="col-12">
          <tabla-filas-dinamicas
            titulo="Solicitudes  de ATS a través de tickets"
            :configuracionColumnas="configuracionColumnasSolicitudAts"
            :listado="ticketsAts"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :mostrarBotones="false"
            :alto-fijo="false"
            :entidad="Ticket"
            :consultarTiempo="false"
            :accion1="btnSeguimiento"
            :accion2="btnCancelar"
            :mostrarAccion1Header="permitirSubir"
            @guardarFila="(fila) => guardarFilaSolicitudAts(fila, subtarea.id)"
          ></tabla-filas-dinamicas>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-toggle
            v-model="usarMaterialTarea"
            label="Usar material asignado para la tarea"
            checked-icon="bi-eye"
            color="positive"
            dense
          ></q-toggle>
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
                @click="actualizarTablaMaterialesTarea()"
              />
              <q-tab
                v-if="esCoordinador"
                name="historial_material_tarea_usado"
                label="Historial de material de tarea usado"
                @click="resetearFiltroHistorial()"
              >
              </q-tab>
            </q-tabs>

            <q-tab-panels v-model="tab" animated class="bg-body">
              <q-tab-panel name="usar_material_tarea">
                <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
                  <div class="col-12 col-md-6">
                    <label class="q-mb-sm block"
                      >Seleccione un cliente para filtrar el material</label
                    >
                    <q-select
                      v-model="clienteMaterialTarea"
                      :options="clientesMaterialesTarea"
                      transition-show="scale"
                      transition-hide="scale"
                      use-input
                      input-debounce="0"
                      options-dense
                      dense
                      outlined
                      :option-label="(item) => item.razon_social"
                      :option-value="(item) => item.cliente_id"
                      @update:model-value="
                        obtenerMaterialesTarea(clienteMaterialTarea)
                      "
                      emit-value
                      map-options
                    >
                    </q-select>
                  </div>

                  <div class="col-12 col-md-6">
                    <br />
                    <q-toggle
                      v-model="mostrarMaterialConStock"
                      label="Mostrar sólo material con stock mayor a cero"
                      checked-icon="bi-bag-check"
                      icon="bi-bag"
                      color="positive"
                      dense
                    ></q-toggle>
                  </div>
                </div>
                <essential-table
                  v-if="materialesTarea.length"
                  titulo="Materiales designados para la tarea"
                  :configuracionColumnas="columnasMaterial"
                  :datos="materialesTarea"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitir-buscar="true"
                  :permitirEditarModal="true"
                  separador="cell"
                  :accion1="botonEditarCantidadTarea"
                ></essential-table>
              </q-tab-panel>

              <q-tab-panel name="historial_material_tarea_usado">
                <div
                  class="row text-center justify-center bg-drawer rounded-card q-py-md q-mb-md custom-shadow"
                >
                  <!-- Fecha historial -->
                  <div class="col-12 col-md-3 q-mb-md">
                    <label class="q-mb-sm block"
                      >Seleccione una fecha para filtrar en el historial</label
                    >
                    <small class="text-positive">{{
                      rangoFechasHistorial
                    }}</small>
                  </div>

                  <div class="col-12">
                    <div class="q-gutter-sm">
                      <q-radio
                        v-for="fecha in fechasHistorialMaterialesUsados"
                        :key="fecha.fecha"
                        v-model="fecha_historial"
                        :val="fecha.fecha"
                        :label="fecha.fecha"
                      />
                    </div>
                  </div>
                </div>

                <essential-table
                  v-if="historialMaterialTareaUsadoPorFecha.length"
                  titulo="Historial material tarea usado"
                  :configuracionColumnas="columnasMaterial"
                  :datos="historialMaterialTareaUsadoPorFecha"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitirEditarModal="true"
                  separador="cell"
                  :accion1="botonEditarCantidadTareaHistorial"
                ></essential-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-toggle
            v-model="usarMaterialStock"
            label="Usar material de mi stock"
            checked-icon="bi-eye"
            color="positive"
            dense
          ></q-toggle>
        </div>

        <div v-if="usarMaterialStock" class="col-12 q-mb-md">
          <q-card class="rounded-card">
            <q-tabs
              v-model="tabMaterialStock"
              class="text-primary"
              :class="{ 'bg-grey-1': !$q.dark.isActive }"
              active-color="primary"
              align="justify"
              no-caps
              inline-label
            >
              <q-tab
                name="usar_material_stock"
                label="Usar material de mi stock"
                @click="() => (clienteMaterialStock = null)"
              />
              <q-tab
                v-if="esCoordinador"
                name="historial_material_stock_usado"
                label="Historial de material de stock usado"
                @click="resetearFiltroHistorialStock()"
              >
              </q-tab>
            </q-tabs>

            <q-tab-panels v-model="tabMaterialStock" animated class="bg-body">
              <q-tab-panel name="usar_material_stock">
                <div class="row q-col-gutter-sm q-pa-sm q-mb-md">
                  <div class="col-12 col-md-6">
                    <label class="q-mb-sm block"
                      >Seleccione un cliente para filtrar el material</label
                    >
                    <!-- @filter="filtrarClientes" -->
                    <q-select
                      v-model="clienteMaterialStock"
                      :options="clientes"
                      transition-show="scale"
                      transition-hide="scale"
                      use-input
                      input-debounce="0"
                      options-dense
                      dense
                      outlined
                      :option-label="(item) => item.razon_social"
                      :option-value="(item) => item.cliente_id"
                      @update:model-value="
                        obtenerMaterialesStock(clienteMaterialStock)
                      "
                      emit-value
                      map-options
                    >
                    </q-select>
                  </div>

                  <div class="col-12 col-md-6">
                    <br />
                    <q-toggle
                      v-model="mostrarMaterialStockConStock"
                      label="Mostrar sólo material con stock mayor a cero"
                      checked-icon="bi-bag-check"
                      icon="bi-bag"
                      color="positive"
                      dense
                    ></q-toggle>
                  </div>
                </div>

                <essential-table
                  v-if="materialesStock.length"
                  titulo="Materiales de stock del responsable"
                  :configuracionColumnas="columnasMaterial"
                  :datos="materialesStock"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitir-buscar="true"
                  :permitirEditarModal="true"
                  separador="cell"
                  :ajustar-celdas="true"
                  :accion1="botonEditarCantidadStock"
                ></essential-table>
              </q-tab-panel>

              <q-tab-panel name="historial_material_stock_usado">
                <div
                  class="row text-center justify-center bg-drawer rounded-card q-py-md q-mb-md custom-shadow"
                >
                  <!-- Fecha historial -->
                  <div class="col-12 col-md-3 q-mb-md">
                    <label class="q-mb-sm block"
                      >Seleccione una fecha para filtrar en el historial</label
                    >
                    <small class="text-positive">{{
                      rangoFechasHistorial
                    }}</small>
                  </div>

                  <div class="col-12">
                    <div class="q-gutter-sm">
                      <q-radio
                        v-for="fecha in fechasHistorialMaterialesStockUsados"
                        :key="fecha.fecha"
                        v-model="fecha_historial_stock"
                        :val="fecha.fecha"
                        :label="fecha.fecha"
                      />
                    </div>
                  </div>
                </div>

                <essential-table
                  v-if="historialMaterialStockUsadoPorFecha.length"
                  titulo="Historial material stock usado"
                  :configuracionColumnas="columnasMaterial"
                  :datos="historialMaterialStockUsadoPorFecha"
                  :alto-fijo="false"
                  :permitirConsultar="false"
                  :permitirEliminar="false"
                  :permitirEditar="false"
                  :permitirEditarModal="true"
                  separador="cell"
                  :ajustar-celdas="true"
                  :accion1="botonEditarCantidadStockHistorial"
                ></essential-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <!-- v-if="subtarea.cliente_id !== clientes.TELCONET" -->
        <!-- <div
          class="col-12 q-mb-md"
        >
          <br />
          <q-toggle
            v-model="usarStock"
            label="Gestionar material del stock personal"
            checked-icon="bi-eye"
            color="positive"
            dense
          ></q-toggle>
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
        </div> -->

        <!-- <div class="col-12 q-mb-md">
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
          ></tabla-observaciones>
        </div> -->

        <!-- <div
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
        </div> -->

        <div class="col-12 q-mb-md">
          <archivo-seguimiento
            ref="refArchivoSeguimiento"
            :mixin="mixinArchivoSeguimiento"
            :endpoint="endpoint"
            :permitir-eliminar="permitirSubir"
            :permitir-subir="permitirSubir"
          >
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubir"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados</q-btn
              >
            </template>
          </archivo-seguimiento>
        </div>
      </div>
    </q-card>

    <visor-imagen ref="refVisorImagen"></visor-imagen>

    <modales-entidad
      :comportamiento="modales"
      :mixin-modal="mixin"
      :confirmar-cerrar="false"
      :persistente="false"
    />
  </q-page>
</template>

<script src="./SeguimientoSubtareaPage.ts"></script>
