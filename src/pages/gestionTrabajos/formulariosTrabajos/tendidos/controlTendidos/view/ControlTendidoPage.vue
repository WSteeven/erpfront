<template>
  <!--<q-page padding> -->
  <q-card class="rounded q-mb-md">
    <q-card-section>
      <q-form @submit.prevent>
        <div class="text-bold q-mb-lg">1. Información general</div>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Bobina -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Bobina</label>
            <q-select
              v-model="tendido.bobina"
              :options="listadosAuxiliares.bobinas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              :disable="!!tendido.id"
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

          <!-- Cantidad de hilos -->
          <div v-if="tendido.bobina" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad de hilos de la FO</label>
            <q-input
              v-model="tendido.cantidad_hilos"
              outlined
              disable
              dense
            ></q-input>
          </div>

          <!-- Cantidad postes -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cantidad de postes</label>
            <q-input
              v-model="
                listadoRegistrosTendidos.filter(
                  (item) => item.tipo_elemento === 'POSTE'
                ).length
              "
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
              v-model="
                listadoRegistrosTendidos.filter(
                  (item) => item.tipo_elemento === 'POZO'
                ).length
              "
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
              v-model="marcaInicial"
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
              v-model="marcaFinal"
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
              v-model="metrajeTendido"
              hint="Calculado automáticamente"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <div v-if="tendido.fecha" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha del tendido</label>
            <q-input v-model="tendido.fecha" disable outlined dense></q-input>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>

  <!--<div class="row justify-center q-mb-md q-gutter-xs"> -->
  <q-btn
    v-if="!tendidoIniciado"
    class="col-12 col-md-3"
    color="positive"
    @click="iniciarRegistros()"
    no-caps
    no-wrap
    rounded
    push
  >
    <q-icon name="bi-play-fill" size="xs" class="q-pr-sm"></q-icon>
    Comenzar a agregar elementos
  </q-btn>

  <!--<q-btn
      v-if="tendido.id"
      color="positive"
      class="col-12 col-md-3"
      no-caps
      push
      @click="verResumen()"
    >
      <q-icon name="bi-table" size="xs" class="q-pr-sm"></q-icon>
      <span>Ver resumen</span>
    </q-btn> -->
  <!--</div> -->

  <q-card v-if="tendidoIniciado" class="rounded q-mb-md">
    <q-card-section>
      <div class="row q-mb-xl">
        <div class="col-12">
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
    </q-card-section>
  </q-card>

  <modales-entidad
    :comportamiento="modales"
    :mixinModal="mixinRegistroTendido"
  />
  <!--</q-page> -->
</template>

<script src="./ControlTendidoPage.ts"></script>
