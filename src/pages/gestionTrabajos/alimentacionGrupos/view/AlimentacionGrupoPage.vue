<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasAlimentacionGrupo"
    :paginate="true"
    puede-filtrar
    puede-exportar
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-md border-white rounded q-mb-md">
          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="alimentacion.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.fecha.$touch"
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
                      v-model="alimentacion.fecha"
                      :mask="maskFecha"
                      :options="optionsFecha"
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
                <div v-for="error of v$.fecha.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="block q-mb-sm">&nbsp;</label>
            <q-btn
              color="positive"
              icon="bi-plus"
              label="Agregar grupo"
              unelevated
              square
              no-caps
              @click="agregarGrupo()"
            ></q-btn>
          </div>
        </div>

        <div
          v-for="(alimentacionGrupo, index) in alimentacion.alimentacion_grupos"
          :key="index"
          class="row q-col-gutter-sm q-py-md q-mb-md"
          :class="{ 'bg-desenfoque rounded': index % 2 === 0 }"
        >
          <!-- {{ alimentacionGrupo.grupo_id }} -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="alimentacionGrupo.grupo_id"
              :options="grupos"
              @filter="filtrarGrupos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="item => item.nombre"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :disable="disabled || noSePuedeEditar"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index].grupo_id
                  .length
              "
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
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].grupo_id"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- {{ grupos }} -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tarea</label>
            <q-select
              v-model="alimentacionGrupo.tarea_id"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled || noSePuedeEditar"
              @filter="filtrarTareas"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index].tarea_id
                  .length
              "
              error-message="Seleccione una tarea"
              use-input
              input-debounce="0"
              :option-value="v => v.id"
              :option-label="v => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].tarea_id"
                  :key="error.$uid"
                >
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

          <div class="col-12 col-md-2">
            <label class="q-mb-sm block">Cantidad personas</label>
            <q-input
              v-model="alimentacionGrupo.cantidad_personas"
              placeholder="Obligatorio"
              :disable="disabled"
              type="number"
              autofocus
              outlined
              dense
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index]
                  .cantidad_personas.length
              "
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].cantidad_personas"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input
              :model-value="
                PRECIO_ALIMENTACION * alimentacionGrupo.cantidad_personas
              "
              disable
              autofocus
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo alimentación</label>
            <q-select
              v-model="alimentacionGrupo.tipo_alimentacion_id"
              :options="subdetalles"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :disable="disabled || noSePuedeEditar"
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarSubdetalles"
              error-message="Debes seleccionar uno"
              :error="
                !!v$.alimentacion_grupos.$each.$response.$errors[index]
                  .tipo_alimentacion.length
              "
              :option-value="v => v.id"
              :option-label="v => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:option="{ itemProps, opt }">
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.descripcion }}
                    <q-item-label v-bind:inner-h-t-m-l="opt.nombres" />
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div
                  v-for="error of v$.alimentacion_grupos.$each.$response
                    .$errors[index].tipos_alimentacion"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>

              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-8">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="alimentacionGrupo.observacion"
              placeholder="Opcional"
              :disable="disabled"
              autofocus
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./AlimentacionGrupoPage.ts"></script>
