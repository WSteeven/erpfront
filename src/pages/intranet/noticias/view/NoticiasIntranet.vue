<template>
  <tab-layout-filter-tabs2 :mixin="mixin" :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsNoticias" :full="true" :accion1="editarNoticias" :permitirEditar="false"
    :permitirEliminar="false" :mostrarButtonSubmits="true" :filtrar="filtrarNoticia" tabDefecto="1"
    :forzarListar="true">

    <template #formulario>
      <q-form @submit="submitForm" ref="formRef" class="q-gutter-md">
        <q-card class="q-pa-md q-mx">
          <q-card-section>
            <div class="text-h6">Subir Noticia</div>
          </q-card-section>

          <q-card-section class="q-py-none">
            <q-input v-model="noticia.titulo" label="Título" :rules="[val => !!val || 'El título es requerido']" dense
              outlined />
          </q-card-section>

          <br>
          <q-card-section class="q-py-none">
            <q-editor v-model="noticia.descripcion" label="Descripción"
              :rules="[val => !!val || 'La descripción es requerida']" dense outlined />
          </q-card-section>
          <br>

          <div class="row q-col-gutter-md q-py-none">
            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input v-model="noticia.autor" label="AUTOR" :rules="[val => !!val || 'El autor es requerido']" dense
                  outlined />
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input v-model="noticia.fecha_creacion" label="Fecha de Publicación" mask="####/##/##"
                  :rules="[val => !!val || 'La fecha es requerida']" dense outlined>
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="noticia.fecha_creacion" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input v-model="noticia.categoria" label="Categoría" dense outlined />
              </q-card-section>
            </div>

            <div class="col-6">
              <q-card-section class="q-py-none">
                <q-input v-model="noticia.etiquetas" label="Etiquetas" hint="Separadas por comas" dense outlined />
              </q-card-section>
            </div>

            <div class="col-12">
              <q-card-section class="q-py-none">
                <q-file v-model="noticia.url_imagen" label="Subir Imagen" accept="image/*"
                  :rules="[val => !!val || 'La imagen es requerida']" dense outlined />
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
