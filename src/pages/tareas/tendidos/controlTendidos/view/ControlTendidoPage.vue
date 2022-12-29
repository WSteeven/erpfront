<template>
  <q-page padding>
    <div class="text-bold q-mb-lg">Tendido de Fibra óptica</div>
    <q-card>
      <q-card-section>
        <q-form @submit.prevent="enviar()">
          <div class="row q-col-gutter-sm q-py-md">
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Bobina</label>
              <q-select
                v-model="progresiva.bobina"
                :options="listadosAuxiliares.bobinas"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                :disable="!!progresiva.id"
                outlined
                :option-label="(item) => item.descripcion"
                :option-value="(item) => item.id"
                :error="!!v$.bobina.$errors.length"
                emit-value
                map-options
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:error>
                  <div v-for="error of v$.bobina.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Marca inicial -->
            <div v-if="progresiva.bobina" class="col-12 col-md-3">
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

            <div v-if="progresiva.fecha" class="col-12 col-md-3 q-mb-md">
              <label class="q-mb-sm block">Fecha del tendido</label>
              <q-input
                v-model="progresiva.fecha"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <div v-if="progresiva.id" class="col-12">
              <essential-table
                titulo="Registro de avances"
                :configuracionColumnas="[
                  ...configuracionColumnasControlTendido,
                  accionesTabla,
                ]"
                :datos="listadoRegistrosTendidos"
                :alto-fijo="false"
                :permitirEliminar="false"
                :accion1Header="agregarProgresiva"
                @consultar="consultarRegistro"
                @editar="editarRegistro"
              ></essential-table>
            </div>
          </div>
        </q-form>
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
          <q-icon name="bi-play-circle" size="xs" class="q-mr-sm"></q-icon
          >Empezar a agregar elementos
        </q-fab-action>
      </q-fab>
    </q-page-sticky>

    <modales-entidad :comportamiento="modales" :mixin="mixinRegistroTendido" />
  </q-page>
</template>

<script src="./ControlTendidoPage.ts"></script>
