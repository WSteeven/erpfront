<template>
  <multiple-page-layout :mixin="mixin">
    <template #tab1>
      <tab-layout-filter-tabs2
        :mixin="mixin"
        :configuracion-columnas="configuracionColumnasInspecciones"
        :tabOptions="tabOptionsEstadosInspecciones"
        :filtrar="filtrarInspecciones"
        :tabDefecto="tabActual"
        ajustar-celdas
        forzar-listar
        multiple-pages
      >
        <template #formulario>
          <q-form @submit.prevent>
            <div class="row q-col-gutter-sm q-py-md">
              <!-- Titulo -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Título</label>
                <q-input
                  v-model="inspeccion.titulo"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  autofocus
                  outlined
                  dense
                  :error="!!validador$.titulo.$errors.length"
                  @blur="validador$.titulo.$touch"
                >
                  <template v-slot:error>
                    <div
                      v-for="error of validador$.titulo.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <!-- Descripcion -->
              <div class="col-12 col-md-9">
                <label class="q-mb-sm block">Descripción</label>
                <q-input
                  v-model="inspeccion.descripcion"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  outlined
                  dense
                  :error="!!validador$.descripcion.$errors.length"
                  @blur="validador$.descripcion.$touch"
                >
                  <template v-slot:error>
                    <div
                      v-for="error of validador$.descripcion.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <div v-if="!inspeccion.tiene_incidencias" class="col-12 col-md-3">
                <label class="q-mb-sm block">Empleado involucrado</label>
                <q-select
                  v-model="inspeccion.empleado_involucrado"
                  :options="empleados"
                  transition-show="scale"
                  transition-hide="scale"
                  options-dense
                  dense
                  outlined
                  use-input
                  input-debounce="0"
                  :disable="disabled"
                  :error="!!validador$.empleado_involucrado.$errors.length"
                  @blur="validador$.empleado_involucrado.$touch"
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
                      v-for="error of validador$.empleado_involucrado.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <!-- Responsable -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block"
                  >Responsable de la inspección</label
                >
                <q-input
                  v-model="inspeccion.responsable"
                  disable
                  outlined
                  dense
                />
              </div>

              <div v-if="!inspeccion.tiene_incidencias" class="col-12 col-md-3">
                <coordenadas-input
                  v-model="inspeccion.coordenadas"
                  :disable="disabled"
                  :validador="validador$"
                />
              </div>

              <!-- Fecha de inicio -->
              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha de inicio</label>
                <q-input
                  v-model="inspeccion.fecha_inicio"
                  placeholder="Obligatorio"
                  outlined
                  :disable="disabled"
                  type="datetime"
                  :error="!!validador$.fecha_inicio.$errors.length"
                  @blur="validador$.fecha_inicio.$touch"
                  dense
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="inspeccion.fecha_inicio"
                          :mask="maskFecha"
                          today-btn
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Cerrar"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:error>
                    <div
                      v-for="error of validador$.fecha_inicio.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <div v-if="inspeccion.created_at" class="col-12 col-md-3">
                <label class="q-mb-sm block">Fecha hora de solicitud</label>
                <b>{{ inspeccion.created_at }}</b>
              </div>

              <!-- Causa raiz -->
              <div class="col-12 q-mb-md">
                <label class="q-mb-sm block">Seguimiento</label>
                <essential-editor
                  v-model="inspeccion.seguimiento"
                  :disable="disabled"
                >
                </essential-editor>
              </div>

              <div class="col-12 col-md-3">
                <q-checkbox
                  v-model="inspeccion.tiene_incidencias"
                  label="¿Tiene incidencias?"
                  :disable="disabled || inspeccion.cantidad_incidentes > 0"
                  outlined
                  dense
                ></q-checkbox>
                <!-- @update:model-value="marcarTieneIncidencias()" -->
              </div>

              <!--  <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Estado</label>
            <estado :propsTable="{ value: inspeccion.estado }"></estado>
          </div> -->

              <div v-if="accion !== acciones.nuevo" class="col-12 col-md-3">
                <q-toggle
                  v-model="inspeccion.finalizado"
                  label="¿Finalizado?"
                  :disable="disabled"
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

              <div
                v-if="inspeccion.tiene_incidencias && accion === acciones.nuevo"
                class="col-12 border-callout-warning bg-solid q-pb-sm"
              >
                <q-icon
                  name="bi-exclamation-octagon"
                  color="warning"
                  class="q-mr-sm"
                ></q-icon>
                <span
                  v-html="
                    'Usted está a punto de registrar una inspección con incidencias. Para poder agregar incidencias primero guarde la inspección, luego vaya a Listado y presione el botón <b>Editar</b> de la inspección agregada recientemente.'
                  "
                ></span>
              </div>
            </div>
          </q-form>
        </template>

        <template #custom-buttons>
          <q-btn
            v-if="accion !== acciones.nuevo && inspeccion.tiene_incidencias"
            @click="irIncidencias()"
            color="positive"
            label="Gestionar incidentes"
            icon="bi-person-hearts"
            no-caps
            push
          ></q-btn>
        </template>
      </tab-layout-filter-tabs2>
    </template>

    <template #tab2>
      <!-- v-show="inspeccion.tiene_incidencias && accion === acciones.editar" -->
      <div class="bg-desenfoque rounded q-pa-md">
        <span
          class="q-px-md q-py-xs rounded text-bold q-mb-md inline-block bg-grey-3"
        >
          <q-icon name="bi-person-hearts" class="q-mr-sm"></q-icon>
          Incidentes de la inspección seleccionada
        </span>
        <incidente-page
          ref="refIncidentePage"
          @guardado="marcarTieneIncidencias()"
        ></incidente-page>
      </div>
    </template>

    <template #tab3>
      <solicitud-descuento-page></solicitud-descuento-page>
    </template>
  </multiple-page-layout>
</template>

<script src="./InspeccionPage.ts"></script>
