<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :permitir-editar="false"
  >
    <template #formulario>
      <div class="q-mb-xl">
        <detalle-paciente
          v-if="empleado.id"
          :empleado="empleado"
        ></detalle-paciente>
      </div>

      <!-- Tabs -->
      <q-tabs
        v-model="tabs"
        switch-indicator
        align="justify"
        active-class="tab-active"
        :indicator-color="transparent"
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
        :class="{ 'rounded-tabpanel': !$q.screen.xs }"
      >
        <q-tab-panel name="1">
          <div class="row justify-end">
            <q-btn color="primary" no-caps rounded
              >Agregar un registro de examen de ingreso</q-btn
            >
          </div>
          <q-splitter v-model="splitterModel" style="height: 250px">
            <template v-slot:before>
              <!-- Tabs -->
              <q-tabs
                v-model="tabsRegistro"
                vertical
                switch-indicator
                active-class="bg-primary text-white"
                indicator-color="transparent"
              >
                <q-tab
                  name="1"
                  label="Registro #1"
                  :class="{ 'tab-inactive': tabs !== '1' }"
                  no-caps
                />
                <q-tab
                  name="2"
                  label="Registro #2"
                  :class="{ 'tab-inactive': tabs !== '2' }"
                  no-caps
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="tabsRegistro"
                animated
                transition-prev="scale"
                transition-next="scale"
                helpalive
                :class="{ 'rounded-tabpanel': !$q.screen.xs }"
              >
                <q-tab-panel name="1">
                  <div class="text-primary text-bold">Exámenes comunes</div>
                  <div class="row text-bold text-center">
                    <div class="col-12 col-md-4">TIPO DE EXAMEN</div>
                    <div
                      v-for="estado in estadosExamenes"
                      :key="estado.id"
                      class="col-12 col-md-2"
                    >
                      {{ estado.nombre }}
                    </div>
                  </div>

                  <!-- Categoria -->
                  <div
                    v-for="registro in registroExamenes"
                    :key="registro.id"
                    class="row"
                  >
                    <div class="text-bold">{{ registro.categoria }}</div>
                    <!-- <div>{{ registro.examenes }}</div> -->
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
                  </div>
                </q-tab-panel>
                <q-tab-panel name="2"> Ocupacionales </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </tab-layout>

  <!-- <modales-entidad
    :comportamiento="modales"
    @guardado="(data) => guardado(data)"
    :mixin-modal="mixinFamiliares"
  ></modales-entidad> -->
</template>

<script src="./GestionarPacientePage.ts" />
