<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasIncidente"
    :tabOptions="tabOptionsEstadosIncidentes"
    :filtrar="filtrarIncidentes"
    :tabDefecto="tabActual"
    ajustar-celdas
    forzar-listar
    :permitir-consultar="false"
    label-guardar="Guardar incidente"
    label-editar="Actualizar incidente"
    :accion1="btnSeguimiento"
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
              :error="!!v$.titulo?.$errors?.length"
              @blur="v$.titulo?.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo?.$errors" :key="error.$uid">
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
              :error="!!v$.descripcion?.$errors.length"
              @blur="v$.descripcion?.$touch"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion?.$errors" :key="error.$uid">
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
              :disable="disabled"
              :error="!!v$.empleado_involucrado?.$errors.length"
              @blur="v$.empleado_involucrado?.$touch"
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
                  v-for="error of v$.empleado_involucrado?.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <coordenadas-input
              v-model="incidente.coordenadas"
              :disable="disabled"
              :validador="v$"
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
              :disable="disabled || enRutaInspeccion"
              @update:model-value="incidente.inspeccion = null"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div v-if="incidente.es_parte_inspeccion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Inspecciones para incidencias</label>
            <q-select
              v-model="incidente.inspeccion"
              :options="inspecciones"
              transition-show="scale"
              transition-hide="scale"
              :disable="disabled || enRutaInspeccion"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :error="!!v$.inspeccion?.$errors.length"
              @blur="v$.inspeccion?.$touch"
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
                  :disable="disabled || enRutaInspeccion"
                  unelevated
                  square
                >
                  <q-icon size="xs" name="bi-arrow-clockwise" />
                  <q-tooltip>Recargar inspecciones</q-tooltip>
                </q-btn>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.inspeccion?.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div v-if="incidente.created_at" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de registro del incidente</label
            >
            <q-input v-model="incidente.created_at" disable outlined dense />
          </div>

          <!-- <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <estado :propsTable="{ value: incidente.estado }"></estado>
          </div> -->

          <div v-if="accion !== acciones.nuevo" class="col-12 col-md-3">
            <q-toggle
              class="q-mt-lg q-pt-md"
              v-model="incidente.finalizado"
              label="¿Finalizado?"
              :disable="disabled"
              @update:model-value="finalizar()"
              color="positive"
              outlined
              dense
            ></q-toggle>
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
              :idModelo="idEntidad"
            />
          </div>

          <seleccion-productos-usuario
            v-if="incidente.tipo_incidente === tiposIncidentes.CAMBIO_EPP"
            :mixin="mixin"
            :propietario="incidente.empleado_involucrado"
            :disable="disabled"
            :configuracion-columnas="columnas"
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

    <template #formulario-2>
      <div class="bg-desenfoque rounded q-py-md">
        <span
          v-if="accion === acciones.consultar"
          class="q-ml-md q-px-md q-py-xs rounded text-bold bg-grey-4 inline-block"
        >
          <q-icon name="bi-clock-history" class="q-mr-sm"></q-icon>
          Seguimiento del incidente
        </span>
        <seguimiento-incidente-page
          v-if="accion === acciones.consultar"
          ref="refSeguimiento"
          :id-empleado="incidente.empleado_involucrado"
          :disable="disableSeguimiento"
          :incidente="incidente"
          @solicitud-descuento-guardada="
            id => (incidente.solicitud_descuento = id)
          "
          @pedido-guardado="id => (incidente.pedido = id)"
          @devolucion-guardada="id => (incidente.devolucion = id)"
        ></seguimiento-incidente-page>
      </div>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./IncidentePage.ts"></script>
