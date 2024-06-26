<template>
  <q-page padding>
    <div class="row q-col-gutter-sm q-pa-sm bg-desenfoque rounded border-white">
      <div class="col-12 text-primary q-mb-sm">
        Reporte de materiales utilizados
      </div>

      <!-- Tipo de reporte -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de reporte</label>
        <q-select
          v-model="filtro.tipo_reporte"
          :options="opcionesTipoReporteMaterialUtilizado"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
        >
        </q-select>
      </div>

      <!-- Tareas -->
      <div
        class="col-12 col-md-6"
        v-if="filtro.tipo_reporte === tiposReportesMaterialUtilizado.POR_TAREA"
      >
        <label class="q-mb-sm block">Tareas</label>
        <q-select
          v-model="filtro.tarea_id"
          :options="tareas"
          @filter="filtrarTareas"
          transition-show="jump-up"
          transition-hide="jump-down"
          options-dense
          dense
          outlined
          :error="!!v$.tarea_id.$errors.length"
          @blur="v$.tarea_id.$touch"
          error-message="Debes seleccionar una Tarea"
          use-input
          input-debounce="0"
          :option-value="(v) => v.id"
          :option-label="(v) => v.codigo_tarea + ' - '+ v.titulo"
          emit-value
          map-options
        >
          <template v-slot:error>
            <div v-for="error of v$.tarea_id.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" class="q-my-sm">
              <q-item-section>
                <q-item-label class="text-bold text-primary">{{
                  scope.opt.codigo_tarea
                }}</q-item-label>
                <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
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

      <!-- Proyecto -->
      <div
        class="col-12 col-md-6"
        v-if="
          filtro.tipo_reporte === tiposReportesMaterialUtilizado.POR_PROYECTO
        "
      >
        <label class="q-mb-sm block">Proyectos</label>
        <q-select
          v-model="filtro.proyecto_id"
          :options="proyectos"
          @filter="filtrarProyectos"
          transition-show="jump-up"
          transition-hide="jump-down"
          options-dense
          dense
          outlined
          :error="!!v$.proyecto_id.$errors.length"
          @blur="v$.proyecto_id.$touch"
          error-message="Debes seleccionar un proyecto"
          use-input
          input-debounce="0"
          :option-value="(v) => v.id"
          :option-label="(v) => v.nombre"
          emit-value
          map-options
        >
          <template v-slot:error>
            <div v-for="error of v$.proyecto_id.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" class="q-my-sm">
              <q-item-section>
                <q-item-label class="text-bold text-primary">{{
                  scope.opt.codigo_proyecto
                }}</q-item-label>
                <q-item-label caption>{{ scope.opt.nombre }} </q-item-label>
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

      <div class="col-12 col-md-3">
        <label class="block q-mb-sm">&nbsp;</label>
        <q-btn
          color="primary"
          class="full-width"
          icon="bi-search"
          no-caps
          unelevated
          @click="consultarDescargar()"
          >Consultar y descargar</q-btn
        >
      </div>
    </div>
  </q-page>
</template>

<script src="./ReporteMaterialUtilizadoPage.ts"></script>
