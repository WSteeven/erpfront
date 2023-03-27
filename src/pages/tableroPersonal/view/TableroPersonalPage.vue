<template>
  <q-page padding>
    <div class="text-center q-py-md">
      <div class="text-subtitle2 q-mb-md">{{ fecha }}</div>
      <div class="text-subtitle1 q-mb-md">
        Bienvenido, {{ store.nombreUsuario }}.
      </div>
      <div v-if="store.user?.grupo" class="text-subtitle2 q-mb-md">
        Grupo, {{ store.user.grupo }}.
      </div>

      <lottie-player
        :animationData="loginJson"
        background="transparent"
        :speed="1"
        style="width: 400px; height: 400px"
        loop
        autoplay
      ></lottie-player>

      <q-btn color="primary" no-caps push glossy>Manual de usuario</q-btn>

      <!--<q-chip
        v-if="store.esCoordinador || store.esTecnicoLider"
        icon="bi-check"
        color="white"
        >16 Trabajos finalizados</q-chip
      > -->
    </div>

    <!--<div class="row q-col-gutter-sm">
      <div v-if="store.esCoordinador || store.esTecnicoLider" class="col-12">
        <q-card class="custom-shadow rounded">
          <q-card-section>
            <div class="row justify-between items-center">
              <div
                class="text-bold"
                :class="{ 'text-center full-width q-mb-md': $q.screen.xs }"
              >
                Subtareas asignadas
              </div>
              <q-btn
                v-if="store.esTecnicoLider"
                color="primary"
                rounded
                no-caps
                push
                :to="{ name: 'trabajo_asignado' }"
                :class="{ 'q-mx-auto q-mb-md': $q.screen.xs }"
              >
                <q-icon name="bi-ui-checks" size="xs" class="q-mr-sm"></q-icon>
                Ver todos los trabajos asignados</q-btn
              >
            </div>
          </q-card-section>

          <q-tabs
            v-model="tab"
            class="primary"
            dense
            narrow-indicator
            active-color="white"
            active-bg-color="secondary"
            indicator-color="secondary"
            :class="{ 'borde-header-tabla': !$q.screen.xs }"
          >
            <q-tab
              v-if="store.esTecnicoLider"
              label="Asignadas recientemente"
              name="asignadas"
              class="q-mx-xs q-my-md rounded"
              :class="{ 'shadow-chip borde': $q.screen.xs }"
              no-caps
            />
            <q-tab
              v-if="store.esCoordinador"
              label="Pendientes de asignar (9)"
              name="pendientes"
              class="q-mx-xs q-my-md rounded"
              :class="{ 'shadow-chip borde': $q.screen.xs }"
              no-caps
            />
            <q-tab
              v-if="store.esCoordinador"
              label="Ventanas (10)"
              name="ventanas"
              class="q-mx-xs q-my-md rounded"
              :class="{ 'shadow-chip borde': $q.screen.xs }"
              no-caps
            />
          </q-tabs>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="asignadas">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat class="q-mb-md" @click="verSubtarea()">
                  <q-icon
                    name="bi-ui-checks"
                    class="q-mr-md"
                    color="primary"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_3</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat class="q-mb-md" @click="verSubtarea()">
                  <q-icon
                    name="bi-ui-checks"
                    class="q-mr-md"
                    color="primary"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_4</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat class="q-mb-md" @click="verSubtarea()">
                  <q-icon
                    name="bi-ui-checks"
                    class="q-mr-md"
                    color="primary"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_5</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel name="pendientes">
              <div
                v-for="subtarea in subtareasPorAsignar"
                :key="subtarea.id"
                class="col-12 col-md-6 column"
              >
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-ui-checks"
                    class="q-mr-md"
                    color="positive"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">{{ subtarea.codigo_subtarea }}</div>
                    <small>{{ subtarea.detalle }}</small>
                  </div>
                </q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel name="atrasadas">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-alarm"
                    class="q-mr-md"
                    color="negative"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_3</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>
              </div>
            </q-tab-panel>

            <q-tab-panel name="finalizadas">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-check-circle-fill"
                    class="q-mr-md"
                    color="primary"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_1</div>
                    <small>Tendido circular Palmales (Ventana)</small>
                  </div>
                </q-btn>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>

      <div v-if="store.esCoordinador" class="col-12">
        <q-card class="custom-shadow rounded">
          <q-card-section>
            <div class="q-mb-md row justify-between">
              <div class="text-bold">Tareas</div>

              <q-btn
                :to="{ name: 'tareas' }"
                color="primary"
                no-caps
                rounded
                push
              >
                <q-icon name="bi-plus"></q-icon>
                Crear tarea
              </q-btn>
            </div>

            <div class="row">
              <div class="col-12 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-check-square-fill"
                    class="q-mr-md"
                    color="positive"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP00001 / 798541</div>
                    <small>Total de subtareas 8</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon
                    name="bi-check-square-fill"
                    class="q-mr-md"
                    color="positive"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0002 / 854126</div>
                    <small>Total de subtareas 6</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon
                    name="bi-check-square-fill"
                    class="q-mr-md"
                    color="positive"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0003 / ED9865</div>
                    <small>Total de subtareas 3</small>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div> -->

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script src="./TableroPersonalPage.ts"></script>
