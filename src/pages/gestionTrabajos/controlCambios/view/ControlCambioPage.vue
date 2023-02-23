<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasControlCambios"
    titulo-pagina="Control de cambios"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tarea JP -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de tarea JP</label>
            <q-input
              v-model="control.codigo_tarea_jp"
              placeholder="Obligatorio"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tarea Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de tarea Cliente</label>
            <q-input
              v-model="control.codigo_tarea_cliente"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Detalle tarea -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Detalle de la tarea</label>
            <q-input
              v-model="control.detalle_tarea"
              autogrow
              type="textarea"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-input v-model="control.grupo" outlined dense></q-input>
          </div>

          <!-- Tecnico responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Técnico responsable</label>
            <q-input
              v-model="control.tecnico_responsable"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="control.fecha"
              placeholder="Obligatorio"
              outlined
              dense
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="control.fecha">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
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

          <!-- Numero elemento -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"># Elemento</label>
            <q-input
              v-model="control.numero_elemento"
              placeholder="Obligatorio"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Cambios -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cambios</label>
            <q-input
              v-model="control.cambios"
              placeholder="Obligatorio"
              outlined
              dense
              autogrow
              type="textarea"
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Georeferencia X -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Georeferencia X (DMS)</label>
            <q-input
              v-model="control.georeferencia_x"
              placeholder="Obligatorio"
              outlined
              dense
            >
              <template #append>
                <q-icon name="bi-arrow-repeat" class="q-mr-sm"></q-icon>
                <div class="text-caption">Convertir a UTM</div>
              </template>
            </q-input>
          </div>

          <!-- Georeferencia Y -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Georeferencia Y (DMS)</label>
            <q-input
              v-model="control.georeferencia_y"
              placeholder="Obligatorio"
              outlined
              dense
            >
              <template #append>
                <q-icon name="bi-arrow-repeat" class="q-mr-sm"></q-icon>
                <div class="text-caption">Convertir a UTM</div>
              </template>
            </q-input>
          </div>

          <!-- Aprobado por -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Aprobado por</label>
            <q-input
              v-model="control.aprobado_por"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ControlCambioPage.ts"></script>
