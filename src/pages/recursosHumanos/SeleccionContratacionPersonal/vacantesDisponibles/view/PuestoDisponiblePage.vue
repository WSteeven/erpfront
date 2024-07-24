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
      <div class="row q-col-gutter-sm q-py-md flex flex-center">
        <q-card
          class="col-12 col-md-4 q-my-md q-mx-md"
          v-for="vacante of vacantesDisponibles"
          :key="vacante.id"

          flat
          bordered
        >
        <!-- :class="{'puesto-card': $q.screen.md || $q.screen.lg || $q.screen.xl,}" -->
          <q-card-section class="q-pa-none">
            <div class="row q-pb-sm">
              <div class="col-6 flex flex-center">
                <q-img
                  class="rounded-borders"
                  loading="lazy"
                  :src="vacante.imagen_referencia"
                />
              </div>
              <div class="col-6 flex flex-center q-px-sm">
                <div class="text-h6 q-mt-sm q-mb-xs text-center text-bold">
                  {{ vacante.nombre }}
                </div>
                <div class="text-caption text-grey text-justify">
                  <p class="multiline-ellipsis">
                    {{ removeHTMLTags(vacante.descripcion) }}
                  </p>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row flex">
            <div class="col col-md-6">
              <q-icon class="bi-clock-fill" />
              <strong class="q-px-sm">
                {{
                  dayjs() > dayjs(vacante.fecha_caducidad)
                    ? 'Finalizado'
                    : 'Finaliza ' + dayjs().to(vacante.fecha_caducidad)
                }}
              </strong>
            </div>
            <div class="col col-md-6">
              <q-icon class="bi-suitcase-lg-fill" />
              <strong class="q-px-sm">
                {{ vacante.tipo_empleo }}
              </strong>
            </div>
            <!-- <div class="col col-md-6">
              <q-icon class="bi-people-fill" />
              <strong class="q-px-sm"
                >Postulantes {{ vacante.numero_postulantes }}</strong
              >
            </div> -->
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <q-btn
              unelevated
              glossy
              rounded
              color="primary"
              @click="visualizarVacante(vacante.id)"
              class="flex block full-width"
              >Visualizar</q-btn
            >
          </q-card-actions>
        </q-card>
      </div>
    </template>
  </basic-container>
  <modal-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modal-entidad>
</template>

<script src="./PuestoDisponiblePage.ts"></script>

<style scoped>
.puesto-card {
  width: 30%;
  height: 400px;
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
