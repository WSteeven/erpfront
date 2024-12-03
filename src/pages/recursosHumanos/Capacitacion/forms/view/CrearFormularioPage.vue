<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Creación de Formularios"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarFormularios"
    ajustar-celdas
    :accion1="btnCompartirFormulario"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- empleado -->
          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-input
              v-model="formulario.empleado"
              autogrow
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>

          <!-- nombre -->
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
              :option-value="v => v.value"
              :option-label="v => v.label"
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

          <!-- tipo de formulario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Tipo Formulario <i class="bi bi-info-circle" />
              <q-tooltip class="bg-dark"
                >INTERNO unicamente para empleados registrados, EXTERNO para
                cualquier persona en general
              </q-tooltip>
            </label>
            <q-select
              v-model="formulario.tipo"
              :options="tiposFormularios"
              options-dense
              dense
              outlined
              @update:model-value="tipoFormularioSeleccionado"
              :disable="disabled"
              use-chips
              :error="!!v$.tipo.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.tipo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">¿Activo?</label>
            <q-toggle
              :label="formulario.activo ? 'SI' : 'NO'"
              v-model="formulario.activo"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>

          <div class="col-12 col-md-3 col-sm-6">
            <label class="q-mb-sm block">&nbsp;</label>
            <q-btn
              label="Añadir Pregunta"
              color="primary"
              class="full-width"
              @click="openAddFieldModal"
            />
          </div>
          <q-card class="col-12" v-if="formulario.formulario.length > 0">
            <transition-group name="flip-list" tag="div" class="list-group">
              <draggable
                v-if="formulario.formulario.length > 0"
                v-model="formulario.formulario"
                item-key="id"
                :component-data="{ tag: 'div' }"
                v-bind="dragOptions"
                @start="dragging = true"
                @end="dragging = false"
              >
                <template #item="{ element, index }">
                  <q-item class="q-mb-sm">
                    <q-item-section>
                      <q-separator />
                      <DynamicField :campo="element" />
                      <div class="row justify-end q-mt-sm">
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
                    </q-item-section>
                    <q-item-section side>
                      <q-icon
                        name="drag_indicator"
                        class="drag-handle cursor-pointer"
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </draggable>
            </transition-group>
          </q-card>
          <!--          <q-card class="col-12" v-if="formulario.formulario.length > 0">-->
          <!--            <q-card-section>-->
          <!--              &lt;!&ndash; Botón para añadir un campo &ndash;&gt;-->
          <!--              {{ formulario.formulario }}-->
          <!--              &lt;!&ndash; Lista de campos &ndash;&gt;-->
          <!--              <div-->
          <!--                v-for="(field, index) in formulario.formulario"-->
          <!--                :key="index"-->
          <!--                class="q-mb-md"-->
          <!--              >-->
          <!--                <q-separator />-->
          <!--                <DynamicField :campo="field" />-->

          <!--                <div class="row justify-end q-mt-sm">-->
          <!--                  <q-btn-->
          <!--                    icon="bi-pencil-square"-->
          <!--                    color="secondary"-->
          <!--                    flat-->
          <!--                    dense-->
          <!--                    @click="editField(index)"-->
          <!--                    class="q-ml-sm"-->
          <!--                  />-->
          <!--                  <q-btn-->
          <!--                    icon="bi-trash-fill"-->
          <!--                    color="negative"-->
          <!--                    flat-->
          <!--                    dense-->
          <!--                    @click="removeField(index)"-->
          <!--                    class="q-ml-sm"-->
          <!--                  />-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </q-card-section>-->
          <!--          </q-card>-->
        </div>
<!--        {{ newField }}-->
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
<style scoped>
.flip-list-enter-active,
.flip-list-leave-active {
  transition: transform 0.5s;
}

.flip-list-enter,
.flip-list-leave-to {
  transform: scale(1.1);
}

.ghost {
  opacity: 0.5;
  background-color: #c3dff5;
}

.list-group {
  min-height: 20px;
}

.list-group-item i {
  cursor: pointer;
}
</style>
