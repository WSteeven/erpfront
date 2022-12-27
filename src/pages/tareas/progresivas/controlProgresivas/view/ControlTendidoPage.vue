<template>
  <q-page padding>
    <div class="text-bold q-mb-lg">Tendido de Fibra óptica</div>
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="enviar()">
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Codigo bobina -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de bobina</label>
              <q-select
                v-model="progresiva.bobina"
                :options="listadosAuxiliares.bobinas"
                transition-show="flip-up"
                transition-hide="flip-down"
                options-dense
                dense
                outlined
                emit-value
                map-options
              >
              </q-select>
            </div>

            <!-- Marca inicial -->
            <div v-if="progresiva.codigo_bobina" class="col-12 col-md-3">
              <label class="q-mb-sm block">Cantidad de hilos</label>
              <q-input
                v-model="progresiva.cantidad_hilos"
                outlined
                disable
                dense
              ></q-input>
            </div>

            <!-- Cantidad postes -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Cantidad de postes</label>
              <q-input
                v-model="progresiva.cantidad_postes"
                hint="Calculado automáticamente"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Cantidad pozos -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Cantidad de pozos</label>
              <q-input
                v-model="progresiva.cantidad_pozos"
                hint="Calculado automáticamente"
                outlined
                disable
                dense
              ></q-input>
            </div>

            <!-- Marca inicial -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Marca inicial</label>
              <q-input
                v-model="progresiva.progresiva_inicio"
                hint="Calculado automáticamente"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Marca final -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Marca final</label>
              <q-input
                v-model="progresiva.progresiva_fin"
                hint="Calculado automáticamente"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Metraje del tendido -->
            <div class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Metraje del tendido</label>
              <q-input
                v-model="progresiva.metraje_tendido"
                hint="Calculado automáticamente"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <div v-if="progresiva.id" class="col-12">
              <essential-table
                titulo="Registro de progresivas"
                :configuracionColumnas="[
                  ...configuracionColumnasControlProgresivas,
                  accionesTabla,
                ]"
                :datos="elementos"
                :alto-fijo="false"
                :permitirConsultar="false"
                :mostrar-footer="false"
                :accion1Header="agregarProgresiva"
                @eliminar="eliminar"
                @editar="editar"
              ></essential-table>
            </div>
          </div>
        </q-form>

        <modales-entidad :comportamiento="modales" />
      </q-card-section>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        vertical-actions-align="right"
        color="primary"
        label="Acciones"
        padding="sm lg"
      >
        <q-fab-action
          color="secondary"
          :to="{ name: 'trabajo_asignado' }"
          padding="sm md"
        >
          <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon
          >Volver a trabajo asignado
        </q-fab-action>

        <q-fab-action
          v-if="!progresiva.id"
          color="positive"
          @click="guardar(progresiva, false)"
          padding="sm md"
        >
          <q-icon name="bi-play" size="xs" class="q-mr-sm"></q-icon>Empezar a
          agregar elementos
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script src="./ControlTendidoPage.ts"></script>
