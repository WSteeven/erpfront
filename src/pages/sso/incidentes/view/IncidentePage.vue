<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasIncidente"
    :tabOptions="tabOptionsEstadosIncidentes"
    :filtrar="filtrarIncidentes"
    :tabDefecto="tabActual"
    ajustar-celdas
    forzar-listar
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Titulo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Título</label>
            <q-input
              v-model="incidente.titulo"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.titulo.$errors.length"
              @blur="v$.titulo.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Descripcion -->
          <div class="col-12 col-md-9">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="incidente.descripcion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
              @blur="v$.descripcion.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado involucrado</label>
            <q-select
              v-model="incidente.empleado_involucrado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.empleado_involucrado.$errors.length"
              @blur="v$.empleado_involucrado.$touch"
              @filter="filtrarEmpleados"
              :option-label="v => v.apellidos + ' ' + v.nombres"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.empleado_involucrado.$errors"
                  TR9953
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <coordenadas-input
              :coordenadas="incidente.coordenadas"
              :disable="disabled"
              :validador="v$"
              @update:model-value="c => (incidente.coordenadas = c)"
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tipo de incidente</label>
            <q-btn-toggle
              v-model="incidente.tipo_incidente"
              class="toggle-button-primary"
              :disable="disabled"
              spread
              no-caps
              rounded
              toggle-color="primary"
              unelevated
              :options="[
                {
                  label: tabOptionsTiposIncidentes[0].label,
                  value: tabOptionsTiposIncidentes[0].value
                },
                {
                  label: tabOptionsTiposIncidentes[1].label,
                  value: tabOptionsTiposIncidentes[1].value
                }
              ]"
            />
          </div>

          <div class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="incidente.es_parte_inspeccion"
              label="¿Es parte de una inspección?"
              :disable="disabled"
              @update:model-value="incidente.inspeccion = null"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div v-if="incidente.es_parte_inspeccion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Inspección</label>
            <q-select
              v-model="incidente.inspeccion"
              :options="inspecciones"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.inspeccion.$errors.length"
              @blur="v$.inspeccion.$touch"
              @filter="filtrarInspecciones"
              :option-label="v => v.titulo"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template #after>
                <q-btn
                  color="positive"
                  @click="refrescarListados('inspecciones')"
                  unelevated
                  square
                >
                  <q-icon size="xs" name="bi-arrow-clockwise" />
                  <q-tooltip>Recargar inspecciones</q-tooltip>
                </q-btn>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.inspeccion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <estado :propsTable="{ value: incidente.estado }"></estado>
          </div>

          <!-- Manejo de archivos -->
          <div class="col-12">
            <gestor-archivos
              ref="refArchivo"
              label="Adjuntar archivos"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="id"
            />
          </div>

          <seleccion-productos-usuario
            :mixin="mixin"
            :propietario="propietario"
            :configuracion-columnas="
              configuracionColumnasProductosSeleccionadosIncidente
            "
            :accion1="btnEditarMotivoCambio"
            :accion2="btnEditarCantidad"
            :accion3="btnEliminar"
          />
        </div>

        <div v-if="incidente.acciones_correctivas" class="col-12 q-mb-md">
          <small class="text-bold">Respuesta del encargado de SSO</small>
          <q-separator></q-separator>
        </div>

        <div
          v-if="incidente.acciones_correctivas"
          class="col-12 bg-solid q-pa-sm border-callout-positive q-mb-xl"
        >
          <q-icon
            name="bi-chat-left-text"
            color="grey-7"
            class="q-mr-sm"
          ></q-icon>
          {{ incidente.acciones_correctivas }}
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./IncidentePage.ts"></script>
