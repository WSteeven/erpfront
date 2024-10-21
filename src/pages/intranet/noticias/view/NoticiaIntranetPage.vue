<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsNoticias"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarNoticias"
    tabDefecto="1"
    ajustarCeldas
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Título</label>
            <q-input
              v-model="noticia.titulo"
              :error="!!v$.titulo.$errors.length"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- AUTOR -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Autor</label>
            <q-input
              v-model="noticia.autor"
              disable
              :error="!!v$.autor.$errors.length"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error of v$.autor.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Descripción</label>
            <essential-editor v-model="noticia.descripcion" :disable="disabled">
            </essential-editor>
            <div
              v-for="error of v$.descripcion.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Fecha de vencimiento</label>
            <q-input
              v-model="noticia.fecha_vencimiento"
              :error="!!v$.fecha_vencimiento.$errors.length"
              dense
              outlined
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="noticia.fecha_vencimiento"
                      :mask="maskFecha"
                      today-btn
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
              <template v-slot:error>
                <div
                  v-for="error of v$.fecha_vencimiento.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Opción de Noticia para Todos o Departamentos -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block"
              >¿Noticia para todos los empleados?</label
            >
            <q-toggle
              v-model="noticia.para_todos"
              :label="noticia.para_todos ? 'Si' : 'Personalizado'"
              :true-value="true"
              :false-value="false"
              dense
            />
          </div>

          <!--Departamentos Destinatarios-->
          <div class="col-12 col-md-3" v-if="!noticia.para_todos">
            <label class="q-mb-sm block">Departamentos Destinatarios</label>
            <q-select
              v-model="noticia.departamentos_destinatarios"
              :options="departamentos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              use-chips
              outlined
              multiple
              use-input
              input-debounce="0"
              @filter="filtrarDepartamentos"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
              :disable="noticia.para_todos"
            >
              <template
                v-slot:option="{ itemProps, opt, selected, toggleOption }"
              >
                <q-item v-bind="itemProps">
                  <q-item-section>
                    {{ opt.nombre }}
                  </q-item-section>
                  <q-item-section side>
                    <q-toggle
                      :model-value="selected"
                      @update:model-value="toggleOption(opt)"
                    />
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

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Categoría</label>
            <q-select
              outlined
              v-model="noticia.categoria"
              :options="categorias"
              :disable="disabled"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              dense
              options-dense
              :error="!!v$.categoria.$errors.length"
              use-chips
              emit-value
              map-options
              @update:model-value="categoriaSeleccionada"
            >
              <template v-slot:error>
                <div v-for="error of v$.categoria.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Etiquetas</label>
            <q-select
              outlined
              v-model="noticia.etiquetas"
              :options="etiquetas"
              options-dense
              dense
              :disable="disabled"
              multiple
              use-chips
              use-input
              input-debounce="0"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Selecciona una categoría que tenga etiquetas
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Imagen</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="noticia.imagen_noticia"
              :comprimir="true"
              :disable="disabled"
              :alto="'200px'"
              @update:model-value="data => (noticia.imagen_noticia = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./NoticiaIntranetPage.ts"></script>
