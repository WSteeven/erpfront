<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    :permitirEliminar="false"
    :tab-options="tabOptions"
    :tabDefecto="currentTab"
    :mostrar-formulario="false"
    :filtrar="filtrarListadoTareas"
    :custom-panel1="mapaTabPanel"
    :permitir-editar="false"
  >
    <template #header-tabla-listado>
      <q-select
        v-model="fechaSeleccionada"
        :options="fechas"
        label="Selecciona una fecha para filtrar"
        transition-show="scale"
        transition-hide="scale"
        style="width: 300px"
        options-dense
        dense
        clearable
        outlined
      >
        <template v-slot:no-option>
          <no-option-component />
        </template>
      </q-select>
    </template>

    <template #formulario>
      <q-form @submit.prevent>
        <div
          class="row q-col-gutter-sm q-py-none"
        >
          <!-- Fecha  -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="tarea.fecha"
              placeholder="Obligatorio"
              disable
              outlined
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
                      v-model="empleado.fecha_nacimiento"
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
            </q-input>
          </div>

          <!-- Asignada -->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">¿Asignada?</label>
            <q-toggle
              :label="tarea.asignada ? 'SI' : 'NO'"
              v-model="tarea.asignada"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>


          <!--Estado -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Estado de tarea</label>
            <q-select
              v-model="tarea.estado_tarea"
              :options="estados_tareas"
              :disable="disabled"
              options-dense
              dense
              outlined
              hint="Obligatorio"
              :error="!!v$.estado_tarea.$errors.length"
              @blur="v$.estado_tarea.$touch"
              :option-value="v => v.value"
              :option-label="v => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="estado_tarea" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- OT -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">OT</label>
            <q-input
              v-model="tarea.orden_trabajo"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.orden_trabajo.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Nombre cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre Cliente</label>
            <q-input
              v-model="tarea.nombre_cliente"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre_cliente.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre_cliente" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!--Direccion -->
          <div class="col col-12 col-md-12">
            <label class="q-mb-xs block">Dirección</label>
            <q-input
              v-model="tarea.direccion"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.direccion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="direccion" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Referencia -->
          <div class="col col-12 col-md-12">
            <label class="q-mb-xs block">Referencia</label>
            <q-input
              v-model="tarea.referencia"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Latitud -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Latitud</label>
            <q-input
              v-model="tarea.latitud"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Longitud -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Longitud</label>
            <q-input
              v-model="tarea.longitud"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>
          <!-- Mapa -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Mapa</label>
            <mapa-component :puntos="tarea.coordenadas" height="400px" />
          </div>



          <!-- Manejo de archivos -->
          <div class="col-12 q-mb-md" v-if="false">
            <gestor-archivos
              ref="refArchivo"
              label="Imagenes o archivos adjunt@s"
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idTarea"
            >
            </gestor-archivos>
          </div>

          <div class="col-12">
            <q-separator />
          </div>
          <!-- Observacion -->
          <div class="col-12" v-if="false">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="tarea.observacion"
              type="textarea"
              placeholder="Opcional"
              hint="Utilice este campo para documentar cambios importantes o motivos de eliminación"
              :disable="disabled"
              outlined
              dense
            />
          </div>
        </div>
      </q-form>
    </template>
    <template v-slot:Mapa>
      <q-form @submit.prevent>
        <div class="row rounded-borders q-py-none">
          <div
            class="col-12 col-md-12 rounded-card q-ma-sm q-py-sm text-center bg-light-blue-1"
          >
            <div>
              <q-icon
                name="bi-info-circle-fill"
                class="q-mr-xs q-ml-xs"
                size="1em"
              />
              <b> Información </b>Las opciones se marcan con colores:
            </div>
            <div>
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                :color="estadoColorMap[estadosTareasString.pendiente]"
                disable
                val="1"
                :label="estadosTareasString.pendiente"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                :color="estadoColorMap[estadosTareasString.finalizada]"
                disable
                val="1"
                :label="estadosTareasString.finalizada"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                :color="estadoColorMap[estadosTareasString.iniciada]"
                disable
                val="1"
                :label="estadosTareasString.iniciada"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                :color="estadoColorMap[estadosTareasString.cancelada]"
                disable
                val="1"
                :label="estadosTareasString.cancelada"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                :color="estadoColorMap[estadosTareasString.riesgo_perderse]"
                disable
                val="1"
                :label="estadosTareasString.riesgo_perderse"
              />
            </div>
          </div>
          <!-- Mapa -->
          <div class="col-8">
            <label class="q-mb-sm block">Mapa</label>
            <mapa-component
              ref="refMapa"
              :puntos="puntosMapa"
              :punto-seleccionado="puntoSeleccionado"
              :height="alturaMapa"
              @punto-click="seleccionarTarea"
            />
          </div>
          <!-- Longitud -->
          <div class="col-4">
            <label class="q-mb-xs block text-caption">Listado de tareas</label>
            <q-card flat bordered>
              <q-card-section class="q-pa-xs">
                <q-scroll-area :style="{ height: alturaMapa }">
                  <div class="q-pa-none">
                    <q-item
                      clickable
                      dense
                      v-for="(tarea, index) in listado"
                      :key="index"
                      @click="seleccionarTarea(tarea)"
                      :class="{ 'bg-grey-3': puntoSeleccionado === tarea.id }"
                      class="q-py-xs q-px-sm"
                    >
                      <q-item-section avatar class="q-pa-none">
                        <q-avatar
                          size="24px"
                          :color="estadoColorMap[tarea.estado_tarea] ?? 'blue'"
                          text-color="white"
                          class="text-caption"
                        >
                          {{ tarea.estado_tarea.charAt(0) }}
                        </q-avatar>
                      </q-item-section>

                      <q-item-section class="q-pa-none">
                        <div class="text-caption q-mb-xs">
                          {{ tarea.orden_trabajo }} - {{ tarea.tipo_actividad }}
                        </div>
                        <div class="text-caption text-grey q-mb-xs">
                          {{ tarea.direccion }} - {{ tarea.nombre_cliente }}
                        </div>
                        <hr
                          class="q-mt-none q-mb-none"
                          style="border-top: 1px solid #ccc; width: 100%"
                        />
                      </q-item-section>
                    </q-item>
                  </div>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./TareaPage.ts" />
<style scoped></style>
