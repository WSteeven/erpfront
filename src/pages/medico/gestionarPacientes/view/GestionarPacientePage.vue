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
          class="border-bottom-grey-5"
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
          <q-tab-panel name="1" class="q-pa-none">
            <q-splitter v-model="splitterModel" class="border-grey">
              <template v-slot:before>
                <div
                  class="bg-body border-bottom-grey-5 border-right-grey-5 text-center q-pb-md q-pt-sm"
                >
                  <q-btn
                    color="white"
                    class="text-black border-grey-6"
                    square
                    unelevated
                    no-caps
                    @click="agregarRegistro()"
                  >
                    <q-icon
                      name="bi-plus-circle-fill"
                      color="positive"
                      size="xs"
                      class="q-mr-sm"
                    ></q-icon>
                    Nuevo registro</q-btn
                  >
                </div>
                <!-- Tabs -->
                <q-tabs
                  v-model="tabsRegistro"
                  vertical
                  indicator-color="transparent"
                  class="bg-white text-grey-9 q-col-guttser-y-sm"
                  active-class="bg-blue-1 text-black text-bold"
                >
                  <q-tab
                    v-for="registro in registros"
                    :key="registro.id"
                    :name="registro.id"
                    no-caps
                  >
                    <q-icon
                      name="bi-person"
                      size="xs"
                      class="text-primary q-mb-xs"
                    ></q-icon>
                    <span> Registro # {{ registro.numero_registro }} </span>
                  </q-tab>
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
                  <q-tab-panel
                    v-for="registro in registros"
                    :key="registro.id"
                    :name="registro.id"
                    class="q-pa-none"
                  >
                    <div class="row bg-body q-pa-md">
                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block">
                          Fecha y hora de registro
                        </label>
                        <div class="text-bold">{{ registro.created_at }}</div>
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="q-mb-sm block"> Observación </label>
                        <div class="text-bold">{{ registro.observacion }}</div>
                      </div>
                    </div>
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
                      :accion1Header="btnSeleccionarVariosExamenes"
                      :accion2Header="btnSolicitarExamenesSeleccionados"
                      :accion1="btnSolicitar"
                      :accion2="btnResultados"
                      :tipo-seleccion="tipoSeleccion"
                    ></essential-table-tabs>
                    <!-- :alto-fijo="false" -->
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
