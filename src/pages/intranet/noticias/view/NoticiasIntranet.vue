<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsNoticias"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarNoticia"
    tabDefecto="1"
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit="submitForm" ref="formRef" class="q-gutter-md">
        <q-card class="q-pa-md q-mx">
          <q-card-section>
            <div class="text-h6">Subir Noticia</div>
          </q-card-section>

          <q-card-section class="q-py-none">
            <q-input
              v-model="noticia.titulo"
              label="Título"
              :rules="[val => !!val || 'El título es requerido']"
              dense
              outlined
            />
          </q-card-section>

          <br />
          <q-card-section class="q-py-none">
            <essential-editor
                v-model="noticia.descripcion"
                :disable="disabled"
              >
              </essential-editor>
              <div
                v-for="error of v$.descripcion.$errors"
                :key="error.$uid"
                class="text-negative text-uppercase"
              >
                <small>{{ error.$message }}</small>
              </div>
          </q-card-section>
          <br />

          <div class="row q-col-gutter-md q-py-none">
            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input
                  v-model="noticia.autor"
                  disable
                  label="AUTOR"
                  :rules="[val => !!val || 'El autor es requerido']"
                  dense
                  outlined
                />
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input
                  v-model="noticia.fecha_vencimiento"
                  label="Fecha de Vencimiento"

                  :rules="[val => !!val || 'La fecha es requerida']"
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
                          mask="YYYY-MM-DD"
                          today-btn
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <!-- <label class="q-mb-sm block">Categoría</label> -->
                <q-select
                outlined
                  v-model="noticia.categoria"
                  :options="categorias"
                  :disable="disabled"
                  label="Categoría"
                  :option-value="v => v.id"
                  :option-label="v => v.nombre"
                  dense
                  options-dense

                  use-chips
                  emit-value
                  map-options
                  @update:model-value="categoriaSeleccionada"
                />
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <!-- <label class="q-mb-sm block">Etiquetas</label> -->
                <q-select
                outlined
                  v-model="noticia.etiquetas"
                  :options="etiquetas"
                  options-dense
                  dense
                  label="Etiquetas"
                  :disable="disabled"
                  multiple
                  use-chips
                  use-input
                  input-debounce="0"
                  :option-value="v => v.id"
                  :option-label="v => v.nombre"
                  emit-value
                  map-options
                />
              </q-card-section>
            </div>

            <div class="col-12">
              <q-card-section class="q-py-none">
                <label class="q-mb-sm block">Subir imagen</label>
                <selector-imagen
                  file_extensiones=".jpg, image/*"
                  :imagen="noticia.imagen_noticia"
                  :comprimir="true"
                  :disable="disabled"
                  :error="!!v$.imagen_noticia.$errors.length"
                  :alto="'200px'"
                  @update:model-value="data => (noticia.imagen_noticia = data)"
                ></selector-imagen>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<style scoped>
.q-form {
  width: 100%;
}

.q-card {
  width: 100%;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
}

.col-12 {
  flex: 0 0 100%;
  max-width: 100%;
}

.q-card-section {
  padding-bottom: 0 !important;
}

.q-card-actions {
  padding-top: 1 !important;
}
</style>

<script src="./NoticiasIntranet.ts"></script>
