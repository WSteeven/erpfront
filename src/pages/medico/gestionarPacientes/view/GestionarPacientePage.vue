<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :permitir-editar="false"
  >
    <template #formulario>
      <div :class="{ 'q-mb-xl': empleado.id }">
        <detalle-paciente
          v-if="empleado.id"
          :empleado="empleado"
        ></detalle-paciente>
      </div>

      <!-- Tabs -->
      <div class="border-grey">
        <q-tabs
          v-model="tabs"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          active-bg-color="blue-1"
          dense
        >
          <q-tab
            name="1"
            label="Ingreso"
            :class="{ 'tab-inactive': tabs !== '1' }"
            no-caps
          />
          <q-tab
            name="2"
            label="Ocupacionales"
            :class="{ 'tab-inactive': tabs !== '2' }"
            no-caps
          />
          <q-tab
            name="3"
            label="Reingreso"
            :class="{ 'tab-inactive': tabs !== '3' }"
            no-caps
          />
          <q-tab
            name="4"
            label="Salida"
            :class="{ 'tab-inactive': tabs !== '4' }"
            no-caps
          />
        </q-tabs>

        <!-- Paneles -->
        <q-tab-panels
          v-model="tabs"
          animated
          transition-prev="scale"
          transition-next="scale"
          helpalive
        >
          <!-- :class="{ 'rounded-tabpanel': !$q.screen.xs }" -->
          <q-tab-panel name="1" class="q-pa-none">
            <q-splitter
              v-model="splitterModel"
              style="height: 700px"
              class="border-grey"
            >
              <template v-slot:before>
                <q-btn
                  color="positive"
                  square
                  no-caps
                  icon="bi-plus"
                  class="full-width"
                  >Nuevo registro</q-btn
                >
                <!-- Tabs -->
                <q-tabs
                  v-model="tabsRegistro"
                  vertical
                  indicator-color="transparent"
                  class="full-width bg-grey-5"
                  active-class="bg-grey-4 text-primary text-bold"
                >
                  <q-tab name="1" label="Registro #1" no-caps />
                  <q-tab name="2" label="Registro #2" no-caps />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="tabsRegistro"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  helpalive
                >
                  <q-tab-panel name="1" class="q-pa-none">
                    <essential-table-tabs
                      :configuracionColumnas="[
                        ...configuracionColumnasExamenes,
                        accionesTabla,
                      ]"
                      :datos="examenes"
                      :permitirConsultar="false"
                      :permitirEditar="false"
                      :permitirEliminar="false"
                      :tab-options="tabOptionsEstadosExamenes"
                      @tab-seleccionado="filtrarEstadoExamen"
                      :tab-defecto="tabEstadoExamen"
                      :alto-fijo="false"
                      :accion1="btnSolicitar"
                      :accion2="btnResultados"
                    ></essential-table-tabs>
                    <!-- <div class="text-primary text-bold">Exámenes comunes</div>
                    <div class="row text-bold text-center">
                      <div class="col-12 col-md-4">TIPO DE EXAMEN</div>
                      <div
                        v-for="estado in estadosExamenes"
                        :key="estado.id"
                        class="col-12 col-md-2"
                      >
                        {{ estado.nombre }}
                      </div>
                    </div> -->

                    <!-- Categoria -->
                    <!-- <div
                      v-for="registro in registroExamenes"
                      :key="registro.id"
                      class="row"
                    >
                      <div class="text-bold">{{ registro.categoria }}</div>
                      <div
                        v-for="examen in registro.examenes"
                        :key="examen.examen"
                        class=""
                      >
                        <q-checkbox
                          v-model="examen.seleccionado"
                          :label="examen.examen"
                          outlined
                          dense
                        ></q-checkbox>
                      </div>
                    </div> -->
                  </q-tab-panel>
                  <q-tab-panel name="2"> Ocupacionales </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </template>
  </tab-layout>

  <!-- <modales-entidad
    :comportamiento="modales"
    @guardado="(data) => guardado(data)"
    :mixin-modal="mixinFamiliares"
  ></modales-entidad> -->
  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :confirmar-cerrar="false"
    :persistente="false"
  />
</template>

<script src="./GestionarPacientePage.ts" />
