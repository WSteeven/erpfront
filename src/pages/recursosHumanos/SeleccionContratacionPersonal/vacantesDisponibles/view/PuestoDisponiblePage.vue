<template>
  <basic-container>
    <template #contenido>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs text-center text-bold">
          Nuestros Puestos de Trabajo
        </div>
        <div class="row q-col-gutter-sm q-pa-md flex flex-center">
          <div class="col-12 col-md-6 col-sm-12">
            <q-input
              v-model="val"
              autogrow
              placeholder="Ingresa algo para filtrar"
              outlined
              dense
            >
              <template #append>
                <q-btn unelevated>
                  <q-icon class="bi-search"></q-icon>
                </q-btn>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <!-- <pre>
          {{ $q.screen }}
      </pre> -->
      <div class="row q-col-gutter-sm q-py-md q-mx-sm">
        <div
          class="col-12 col-md-4 col-sm-6"
          v-for="vacante of vacantesDisponibles"
          :key="vacante.id"
        >
          <div class="my-custom-card">
            <div class="row" style="min-height: 72%; max-height: 72%">
              <div class="col-6 h-100">
                <q-img
                  class="rounded-borders"
                  loading="lazy"
                  :src="vacante.imagen_referencia"
                  fit="contain"
                />
              </div>
              <div class="col-6">
                <div class="column">
                  <div
                    class="col-3 block text-h6 screen--subtitle2 text-center text-bold overflow-hidden"
                    :class="$q.screen.lg ? 'text-h6' : 'text-subtitle2'"
                    style="overflow: hidden; text-overflow: ellipsis"
                  >
                    <!-- <q-responsive :ratio="1.77"> -->
                    {{ vacante.nombre }}
                    <!-- </q-responsive> -->
                  </div>
                  <div
                    class="col-9 block q-px-xs text-caption text-grey text-justify"
                  >
                    <p>{{ getShortDescription($q, vacante.descripcion) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <q-separator></q-separator>
            <div class="row q-pa-sm" style="min-height: 10%; max-height: 15%">
              <div class="col-6">
                <q-icon class="bi-clock-fill" />
                <strong class="q-px-sm">
                  {{
                    dayjs() > dayjs(vacante.fecha_caducidad)
                      ? 'FINALIZADO'
                      : 'FINALIZA ' + dayjs().to(vacante.fecha_caducidad).toUpperCase()
                  }}
                </strong>
              </div>
              <!-- <div class="col-4">
                <q-icon class="bi-suitcase-lg-fill" />
                <strong class="q-px-sm">
                  {{ vacante.modalidad }}
                </strong>
              </div> -->
              <div class="col-6">
                <q-icon class="bi-geo-alt-fill" />
                <strong class="q-px-sm">
                  {{ vacante.canton }}
                </strong>
              </div>
            </div>
            <q-separator></q-separator>
            <div class="q-py-sm" style="min-height: 10%; max-height: 15%">
              <q-btn
                unelevated
                glossy
                rounded
                color="primary"
                @click="visualizarVacante(vacante.id)"
                class="flex block full-width"
                >Visualizar</q-btn
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </basic-container>
  <modal-entidad
    :comportamiento="modales"
    :persistente="false"
  ></modal-entidad>
</template>

<script src="./PuestoDisponiblePage.ts"></script>

<style scoped>
.my-custom-card {
  height: 100%; /* Ajusta el contenedor para ocupar todo el alto disponible */
  width: 100%; /* Ajusta el contenedor para ocupar todo el ancho disponible */
  border: 1px solid gray; /* Borde fino de 2px, color rojo */
  border-radius: 8px; /* Bordes redondeados con un radio de 8px, ajusta según tus necesidades */
  padding: 4px; /* Padding interno para separar el contenido del borde */
  padding-bottom: 0px;
  overflow: hidden; /* Oculta cualquier contenido que se desborde */
}

.multiline-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 14;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em; /* Ajusta la altura de la línea */
}
</style>
