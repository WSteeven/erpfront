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
        indicator-color="transparent"
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
          name="3"
          label="Salida"
          :class="{ 'tab-inactive': tabs !== '3' }"
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
          <q-splitter v-model="splitterModel" style="height: 250px">
            <template v-slot:before>
              <!-- Tabs -->
              <q-tabs
                v-model="tabs"
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
                <q-tab
                  name="3"
                  label="Registro #3"
                  :class="{ 'tab-inactive': tabs !== '3' }"
                  no-caps
                />
                <q-tab
                  name="4"
                  label="Registro #4"
                  :class="{ 'tab-inactive': tabs !== '3' }"
                  no-caps
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="tabs"
                animated
                transition-prev="scale"
                transition-next="scale"
                helpalive
                :class="{ 'rounded-tabpanel': !$q.screen.xs }"
              >
                <q-tab-panel name="1"> Ingreso </q-tab-panel>
                <q-tab-panel name="2"> Ocupacionales </q-tab-panel>
                <q-tab-panel name="3"> Reingreso </q-tab-panel>
                <q-tab-panel name="4"> Salida </q-tab-panel>
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
