<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Creación de Formularios"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarFormularios"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- correo -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Nombre del formulario</label>
            <q-input
              v-model="formulario.nombre"
              autogrow
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">¿Es recurrente?</label>
            <q-toggle
              :label="formulario.es_recurrente ? 'SI' : 'NO'"
              v-model="formulario.es_recurrente"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <!-- tipo de recurrencia -->
          <div class="col-12 col-md-3" v-if="formulario.es_recurrente">
            <label class="q-mb-sm block">Repetir encuesta</label>
            <q-select
              v-model="formulario.periodo_recurrencia"
              :options="tiposRecurrencias"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-chips
              :error="!!v$.periodo_recurrencia.$errors.length"
              :option-value="(v)=>v.value"
              :option-label="(v)=>v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.periodo_recurrencia.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
{{formulario}}
          <!-- Mes inicia -->
          <div class="col-12 col-md-3 col-sm-3" v-if="formulario.es_recurrente">
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input
              v-model="formulario.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              @blur="v$.fecha_inicio.$touch"
              :disable="disabled"
              readonly
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
                      v-model="formulario.fecha_inicio"
                      :options="optionsFecha"
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
                  style="clear: inherit"
                  v-for="error of v$.fecha_inicio.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>


          <div class="col-12 col-md-6 col-sm-6">
            <label class="q-mb-sm block">&nbsp;</label>
            <q-btn
              label="Añadir Pregunta"
              color="primary"
              class="full-width"
              @click="openAddFieldModal"
            />
          </div>
          <q-card class="col-12" v-if="formulario.formulario.length > 0">
            <q-card-section>
              <!-- Botón para añadir un campo -->

              {{ formulario }}

              <!-- Lista de campos -->
              <div
                v-for="(field, index) in formulario.formulario"
                :key="index"
                class="q-mb-md"
              >
                <q-separator />
                <DynamicField :campo="field" />
                <q-btn
                  icon="bi-pencil-square"
                  color="secondary"
                  flat
                  dense
                  @click="editField(index)"
                  class="q-ml-sm"
                />
                <q-btn
                  icon="bi-trash-fill"
                  color="negative"
                  flat
                  dense
                  @click="removeField(index)"
                  class="q-ml-sm"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
        {{newField}}
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
  <crear-nuevo-campo-modal
    v-if="showAddFieldModal"
    :campo="newField"
    :accion="accionModal"
    :mostrar="showAddFieldModal"
    @cerrar="() => (showAddFieldModal = false)"
    :guardar="data => addField(data)"
  />
</template>

<script src="./CrearFormularioPage.ts" />
