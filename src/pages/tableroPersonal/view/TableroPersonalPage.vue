<template>
  <q-page padding>
    <div class="text-center q-py-md">
      <div class="text-bold q-mb-md">Jueves, 13 de Octubre</div>
      <div class="text-h5 q-mb-md">Buenos días, {{ store.nombreUsuario }}.</div>
      <q-chip v-if="store.esCoordinador || store.esTecnicoLider" icon="bi-check"
        ><b class="q-mr-xs">16</b>Trabajos finalizados</q-chip
      >
    </div>

    <div class="row q-col-gutter-sm">
      <div v-if="store.esCoordinador || store.esTecnicoLider" class="col-12">
        <q-card class="my-card" bordered>
          <q-card-section>
            <div class="text-h6">Subtareas</div>
          </q-card-section>

          <q-tabs v-model="tab" class="primary">
            <q-tab
              v-if="store.esTecnicoLider"
              label="Asignadas (4)"
              name="asignadas"
            />
            <q-tab
              v-if="store.esCoordinador"
              label="Pendientes de asignar (9)"
              name="pendientes"
            />
            <q-tab
              v-if="store.esCoordinador"
              label="Ventanas (10)"
              name="ventanas"
            />
            <q-tab
              v-if="store.esCoordinador"
              label="Proyectos (9)"
              name="proyectos"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="asignadas">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat class="q-mb-md">
                  <q-icon
                    name="bi-check-circle"
                    class="q-mr-md"
                    color="grey-5"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_3</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>

                <div class="row justify-center q-gutter-xs">
                  <q-btn color="primary" no-caps>Ver</q-btn>
                  <q-btn color="positive" no-caps>
                    <q-icon name="bi-play"></q-icon>Iniciar</q-btn
                  >
                </div>

                <q-btn align="left" flat class="q-mb-md">
                  <q-icon
                    name="bi-check-circle"
                    class="q-mr-md"
                    color="grey-5"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_4</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>

                <div class="row justify-center q-gutter-xs">
                  <q-btn color="primary" no-caps>Ver</q-btn>
                  <q-btn color="positive" no-caps>
                    <q-icon name="bi-play"></q-icon>Iniciar</q-btn
                  >
                </div>

                <q-btn align="left" flat class="q-mb-md">
                  <q-icon
                    name="bi-check-circle"
                    class="q-mr-md"
                    color="grey-5"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">JP0001_5</div>
                    <small>Tendido circular Palmales</small>
                  </div>
                </q-btn>

                <div class="row justify-center q-gutter-xs">
                  <q-btn color="primary" no-caps>Ver</q-btn>
                  <q-btn color="positive" no-caps>
                    <q-icon name="bi-play"></q-icon>Iniciar</q-btn
                  >
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="pendientes">
              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-check-circle"
                    class="q-mr-md"
                    color="grey-5"
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
                    name="bi-check-circle"
                    class="q-mr-md"
                    color="grey-5"
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
        <q-card class="my-card" bordered>
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

              <div class="col-12 col-md-6 column">
                <q-btn align="left" flat>
                  <q-icon
                    name="bi-pin-angle"
                    size="md"
                    class="q-mr-md"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP00001 / 798541</div>
                    <small>Total de subtareas 8</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon
                    name="bi-pin-angle"
                    size="md"
                    class="q-mr-md"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP0002 / 854126</div>
                    <small>Total de subtareas 6</small>
                  </div>
                </q-btn>

                <q-btn align="left" flat>
                  <q-icon
                    name="bi-pin-angle"
                    size="md"
                    class="q-mr-md"
                  ></q-icon>
                  <div class="text-left column">
                    <div class="block">Tarea JP0003 / ED9865</div>
                    <small>Total de subtareas 3</small>
                  </div>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Usuarios registrados -->
      <!--<div class="col-12 col-md-6 text-center">
        <q-card class="rounded full-height" flat bordered>
          <q-card-section>
            <div>Usuarios registrados</div>
            <q-knob
              v-model="tablero.usuarios"
              readonly
              show-value
              size="90px"
              color="lime"
              track-color="grey-3"
              class="text-lime q-ma-md"
            >
              <template #default>{{ tablero.usuarios }}</template>
            </q-knob>
          </q-card-section>
        </q-card>
      </div> -->
    </div>
  </q-page>
</template>

<script lang="ts">
import { useAuthenticationStore } from 'stores/authentication'
import { defineComponent, reactive, ref } from 'vue'
import { TableroPersonalController } from '../infraestructure/TableroPersonalController'
import { TableroPersonal } from '../domain/TableroPersonal'

export default defineComponent({
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
    }
  },
})
</script>
