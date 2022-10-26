<template>
  <q-page padding>
    <div class="text-center q-py-md">
      <div class="text-bold q-mb-md">{{ fecha }}</div>
      <div class="text-h5 q-mb-md">Buenos días, {{ store.nombreUsuario }}.</div>
      <q-chip v-if="store.esCoordinador || store.esTecnicoLider" icon="bi-check"
        >16 Trabajos finalizados</q-chip
      >
    </div>

    <div class="row q-col-gutter-sm">
      <div v-if="store.esCoordinador || store.esTecnicoLider" class="col-12">
        <q-card class="custom-shadow">
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h6">Subtareas</div>
              <q-btn
                v-if="store.esTecnicoLider"
                color="primary"
                rounded
                no-caps
                push
                :to="{ name: 'trabajo_asignado' }"
              >
                <q-icon
                  name="bi-list-nested"
                  size="xs"
                  class="q-mr-sm"
                ></q-icon>
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
            active-bg-color="primary"
            indicator-color="primary"
            :class="{ 'my-custom-toggle': !$q.screen.xs }"
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
            <q-tab
              v-if="store.esCoordinador"
              label="Proyectos (9)"
              name="proyectos"
              class="q-mx-xs q-my-md rounded"
              :class="{ 'shadow-chip borde': $q.screen.xs }"
              no-caps
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="asignadas">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat class="q-mb-md" @click="verSubtarea()">
                  <q-icon
                    name="bi-app-indicator"
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
                    name="bi-app-indicator"
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
                    name="bi-app-indicator"
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
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-app-indicator"
                    class="q-mr-md"
                    color="primary"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_3</div>
                    <small>Tendido circular Palmales</small>
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
        <q-card class="custom-shadow">
          <q-card-section>
            <div class="q-mb-md row items-top">
              <div class="text-h6 q-mr-md">Tareas</div>

              <q-select
                v-model="filtroTarea"
                :options="filtrosTareas"
                options-dense
                dense
                borderless
              />
            </div>

            <!--<div class="text-subtitle2">Coordinador</div> -->
            <div class="row">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon name="bi-app-indicator" class="q-mr-md"></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP00001 / 798541</div>
                    <small>Total de subtareas 8</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon name="bi-app-indicator" class="q-mr-md"></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP0002 / 854126</div>
                    <small>Total de subtareas 6</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon name="bi-app-indicator" class="q-mr-md"></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP0003 / ED9865</div>
                    <small>Total de subtareas 3</small>
                  </div>
                </q-btn>
              </div>

              <div class="col-12 col-md-6">
                <q-btn :to="{ name: 'tareas' }" flat no-caps>
                  <q-icon
                    name="bi-plus-square-dotted"
                    size="lg"
                    class="q-mr-md"
                  ></q-icon>
                  Crear tarea
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <modales-entidad :comportamiento="modales" />
  </q-page>
</template>

<script lang="ts">
// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import { date } from 'quasar'

// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

// Logica y controladores
import { ComportamientoModalesTableroPersonal } from '../application/ComportamientoModalesTableroPersonal'
import { TableroPersonalController } from '../infraestructure/TableroPersonalController'
import { TableroPersonal } from '../domain/TableroPersonal'

export default defineComponent({
  components: {
    ModalesEntidad,
  },
  setup() {
    const store = useAuthenticationStore()
    const controller = new TableroPersonalController()
    const tablero = reactive(new TableroPersonal())
    const usuarios = 20

    const filtrosTareas = ['Recientes', 'sdsd']
    const filtroTarea = ref('Recientes')

    async function index() {
      const { response } = await controller.listar()
      tablero.hydrate(response.data.results)
    }

    index()

    const modales = new ComportamientoModalesTableroPersonal()

    const timeStamp = Date.now()
    const fecha = date.formatDate(timeStamp, 'dddd, DD MMMM YYYY')

    function verSubtarea() {
      modales.abrirModalEntidad('SubtareaAsignadaPage')
    }

    return {
      tablero,
      store,
      usuarios,
      tab: ref(
        store.esTecnicoLider
          ? 'asignadas'
          : store.esCoordinador
          ? 'pendientes'
          : ''
      ),
      filtrosTareas,
      filtroTarea,
      modales,
      verSubtarea,
      fecha,
    }
  },
})
</script>
