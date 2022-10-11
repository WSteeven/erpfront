<template>
  <q-page padding>
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Regional -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Regional</label>
        <q-select
          v-model="controlAvance.regional"
          :options="regiones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
        />
      </div>

      <!-- Atenciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Atenciones</label>
        <q-select
          v-model="controlAvance.atencion"
          :options="atenciones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          emit-value
          map-options
          dense
          outlined
        />
      </div>

      <!-- Tipo de intervencion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de intervención</label>
        <q-select
          v-model="controlAvance.tipo_intervencion"
          :options="tiposIntervenciones"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          use-input
          input-debounce="0"
          :option-label="(item) => item.descripcion"
          :option-value="(item) => item.id"
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
        </q-select>
      </div>

      <!-- Fecha de intervencion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Causa de intervención</label>
        <q-select
          v-model="controlAvance.causa_intervencion"
          :options="causasIntervencion"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          use-input
          input-debounce="0"
          :option-label="(item) => item.descripcion"
          :option-value="(item) => item.descripcion"
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
        </q-select>
      </div>

      <!-- Fecha del reporte del problema -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha del reporte del problema</label>
        <q-input v-model="controlAvance.fecha_reporte_problema" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_reporte_problema"
                  mask="DD-MM-YYYY"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora de reporte de problema -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de reporte de problema</label>
        <flat-pickr
          v-model="controlAvance.hora_reporte_problema"
          :config="{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
          }"
        />
      </div>

      <!-- Fecha de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de arribo</label>
        <q-input v-model="controlAvance.fecha_arribo" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="controlAvance.fecha_arribo" mask="DD-MM-YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora de arribo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de arribo</label>
        <flat-pickr
          v-model="controlAvance.hora_arribo"
          :config="{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
          }"
        />
      </div>

      <!-- Fecha de fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de fin de reparación</label>
        <q-input v-model="controlAvance.fecha_fin_reparacion" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_fin_reparacion"
                  mask="DD-MM-YYYY"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora fin reparacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora de fin de reparación</label>
        <flat-pickr
          v-model="controlAvance.hora_fin_reparacion"
          :config="{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
          }"
        />
      </div>

      <!-- Fecha de retiro de personal -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de retiro de personal</label>
        <q-input v-model="controlAvance.fecha_retiro_personal" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  v-model="controlAvance.fecha_retiro_personal"
                  mask="DD-MM-YYYY"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <!-- Hora fin reparacion -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Hora de retiro de personal</label>
        <flat-pickr
          v-model="controlAvance.hora_retiro_personal"
          :config="{
            enableTime: true,
            noCalendar: true,
            dateFormat: 'H:i',
          }"
        />
      </div>

      <div class="col-12 q-mb-sm text-bold">Distancia de la afectación</div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estación de referencia</label>
        <q-input
          v-model="controlAvance.estacion_referencia"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Distancia</label>
        <q-input
          v-model="controlAvance.distancia"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Tiempo de espera adicionales</label>
        <q-input
          v-model="controlAvance.tiempo_espera_adicional"
          placeholder="Opcional"
          outlined
          dense
        ></q-input>
      </div>

      <div class="col-12 text-center q-mb-xl">
        <q-btn color="positive" no-caps>
          <q-icon name="bi-plus"></q-icon>
          Agregar avance</q-btn
        >
      </div>
    </div>

    <div v-if="cronologiaTrabajoRealizado">
      <div class="q-mb-md">
        <essential-table
          titulo="Cronología de trabajo realizado"
          :configuracionColumnas="columnasTrabajoRealizado"
          :datos="cronologiaTrabajoRealizado"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :mostrar-header="false"
          :permitirEditarModal="true"
          @eliminar="tablaTrabajoRealizado.eliminar"
          @editar="tablaTrabajoRealizado.editar"
        ></essential-table>
      </div>
      <!--:agregarElemento="agregarActividadRealizada"-->

      <!--<div class="q-mb-md">
        <essential-table
          titulo="Observaciones / Mejoras / Pendientes"
          :configuracionColumnas="columnasObservacion"
          :datos="observaciones"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :mostrar-header="false"
          :permitirEditarModal="true"
          @eliminar="tablaObservacion.eliminar"
          @editar="tablaObservacion.editar"
        ></essential-table>
      </div> -->

      <div class="q-mb-md">
        <essential-table
          titulo="Listado de materiales ocupados"
          :configuracionColumnas="columnasMaterial"
          :datos="materiales"
          :alto-fijo="false"
          :permitirConsultar="false"
          :mostrar-footer="false"
          :mostrar-header="false"
          :permitirEditarModal="true"
          @eliminar="tablaMateriales.eliminar"
          @editar="tablaMateriales.editar"
        ></essential-table>
        <!--:agregarElemento="agregarMaterial"-->
      </div>
    </div>

    <!-- Botones formulario -->
    <div class="row q-gutter-md justify-end">
      <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
        <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
        <div>Volver</div>
      </q-btn>
    </div>
  </q-page>
</template>

<script src="./ControlAvanceContent.ts"></script>
