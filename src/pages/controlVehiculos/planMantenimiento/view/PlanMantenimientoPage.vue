<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control diario de vehículos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="plan.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :readonly="disabled"
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.marca + ' ' + scope.opt.modelo
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Km que comienza -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Aplicar desde (Km)</label>
            <q-input
              v-model="plan.aplicar_desde"
              placeholder="Obligatorio"
              type="number"
              min="0"
              :disable="disabled"
              :error="!!v$.aplicar_desde.$errors.length"
              outlined
              dense
            >
            <template v-slot:error>
                <div v-for="error of v$.aplicar_desde.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- activo -->
          <div class="col-12 col-md-3" v-if="accion == acciones.editar">
            <br />
            <q-toggle
              v-model="plan.activo"
              checked-icon="check"
              :disable="disabled"
              :label="plan.activo ? 'Plan Activo' : 'Plan Inactivo'"
              color="positive"
            />
          </div>
          <!-- Selector de servicios -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Agregar Servicios</label>
            <div class="row q-col-gutter-x-xs">
              <div class="col-12 col-md-10 q-mb-md">
                <q-input
                  v-model="criterioBusqueda"
                  :disable="disabled"
                  placeholder="Nombre del servicio"
                  hint="Presiona Enter para seleccionar un servicio"
                  @keydown.enter="
                    listarServicios({
                      search: criterioBusqueda,
                      tipo: 'PREVENTIVO',
                      estado: 1,
                    })
                  "
                  @blur="criterioBusqueda === '' ? limpiarServicios() : null"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  @click="
                    listarServicios({
                      search: criterioBusqueda,
                      tipo: 'PREVENTIVO',
                      estado: 1,
                    })
                  "
                  icon="search"
                  unelevated
                  color="positive"
                  class="full-width"
                  style="height: 40px"
                  :disable="disabled"
                  no-caps
                  glossy
                  >Buscar</q-btn
                >
              </div>
            </div>
          </div>
          <!-- Tabla de servicios seleccionados -->

          {{ plan.listadoServicios }}
          <div
            class="col-12"
            v-if="plan.listadoServicios.length > 0 || accion == acciones.editar"
          >
            <essential-table
              titulo="Productos Seleccionados"
              :configuracionColumnas="
                accion == acciones.nuevo || accion == acciones.editar
                  ? [...configuracionColumnasServicios, accionesTabla]
                  : configuracionColumnasServicios
              "
              :datos="plan.listadoServicios"
              separador="cell"
              :desplegarDesde="3"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
              :accion1Header="btnAgregarServicio"
              :accion1="btnEditarFila"
              :accion2="btnEditarNotificar"
              :accion3="btnEliminarFila"
            >
            </essential-table>
          </div>
        </div>
      </q-form>
      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasServicios"
        :datos="listadoServicios"
        tipo-seleccion="multiple"
        @selected="seleccionarServicio"
      ></essential-selectable-table>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modales-entidad>
</template>

<script src="./PlanMantenimientoPage.ts"></script>
