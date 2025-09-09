<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Plantilla de Capacitación"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tema -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tema</label>
            <input-component
              v-model="plantilla.tema"
              clave="tema"
              :disable="disabled"
              :v$="v$"
            />
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="plantilla.fecha"
              outlined
              dense
              mask="####-##-##"
              placeholder="YYYY-MM-DD"
            >
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="plantilla.fecha" mask="YYYY-MM-DD" />
              </q-popup-proxy>
            </q-input>
          </div>

          <!-- Hora inicio -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora Inicio</label>
            <q-input
              v-model="plantilla.hora_inicio"
              outlined
              dense
              mask="time"
              placeholder="HH:mm"
            >
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="plantilla.hora_inicio" format24h />
              </q-popup-proxy>
            </q-input>
          </div>

          <!-- Hora fin -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Hora Fin</label>
            <q-input
              v-model="plantilla.hora_fin"
              outlined
              dense
              mask="time"
              placeholder="HH:mm"
            >
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="plantilla.hora_fin" format24h />
              </q-popup-proxy>
            </q-input>
          </div>

          <!-- Capacitador -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Capacitador</label>
            <q-select
              v-model="plantilla.capacitador_id"
              :options="empleados"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            />
          </div>

          <!-- Modalidad -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Modalidad</label>
            <q-select
              v-model="plantilla.modalidad"
              :options="modalidades"
              dense
              outlined
              emit-value
              map-options
            />
          </div>
        </div>

        <!-- Asistentes -->
        <div class="col-12 q-mt-md">
          <label class="q-mb-sm block">Asistentes</label>


          <br />

          <!-- Tabla de empleados -->
          <essential-table
            :configuracionColumnas="configuracionColumnasEmpleados"
            :datos="empleadosFiltrados"
            tipo-seleccion="multiple"
            :emitirAlSeleccionar="true"
            @selected="seleccionarAsistentes"
          />

          <!-- DEBUG -->
          <pre>Asistentes seleccionados: {{ asistentesSeleccionados }}</pre>
          <pre>Plantilla.asistentes: {{ plantilla.asistentes }}</pre>
        </div>

        <!-- Botones -->
        <div class="col-12 q-mt-md">
          <div class="row justify-end q-col-gutter-x-xs">
            <button-submits
              :accion="accion"
              :permitirGuardar="true"
              :disabled="cargando.estaCargando.value"
              @cancelar="reestablecer()"
              @editar="guardar(plantilla, false)"
              @eliminar="eliminar(plantilla)"
              @guardar="guardar(plantilla, true)"
            />
            <q-btn
              color="primary"
              icon="picture_as_pdf"
              label="Exportar PDF"
              @click="exportarPdf"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./PlantillaCapacitacionPage.ts" />
