<template>
  <div class="row q-col-gutter-sm q-mb-md">
    <!-- Coordinador -->
    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Actual coordinador responsable</label>
      <q-select
        v-model="transferencia.actual_coordinador"
        :options="coordinadores"
        @filter="filtrarCoordinadores"
        transition-show="scale"
        transition-hide="scale"
        options-dense
        dense
        outlined
        :disable="!puedeSeleccionarActualCoordinador"
        :option-label="(item) => item.nombres + ' ' + item.apellidos"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        @update:model-value="filtrarTareasPorCoordinador()"
        @blur="v$.actual_coordinador.$touch"
        :error="!!v$.actual_coordinador.$errors.length"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of v$.actual_coordinador.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>

    <!-- Coordinador -->
    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Nuevo coordinador responsable</label>
      <q-select
        v-model="transferencia.nuevo_coordinador"
        :options="coordinadores"
        @filter="filtrarCoordinadores"
        transition-show="scale"
        transition-hide="scale"
        options-dense
        dense
        outlined
        :option-label="(item) => item.nombres + ' ' + item.apellidos"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        @blur="v$.nuevo_coordinador.$touch"
        :error="!!v$.nuevo_coordinador.$errors.length"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of v$.nuevo_coordinador.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>
  </div>

  <div class="row justify-center q-mb-md">
    <essential-table
      v-if="listado.length"
      :titulo="'Se van a transferir ' + listado.length + ' tarea(s).'"
      :configuracionColumnas="configuracionColumnasTarea"
      :datos="listado"
      separador="cell"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :mostrar-botones="false"
      :permitirFiltrar="false"
      :mostrarFooter="false"
      :permitirBuscar="false"
      :alto-fijo="false"
    ></essential-table>

    <div v-else class="text-primary q-py-lg">
      No tienes tareas activas para transferir. Para crear nuevas tareas ve a
      <q-btn
        rounded
        glossy
        outline
        no-caps
        class="text-primary"
        @click="irControlTareas()"
        >Control de tareas</q-btn
      >
    </div>
  </div>

  <div class="row justify-end q-gutter-x-xs">
    <q-btn
      color="primary"
      no-caps
      push
      @click="transferir()"
      :disable="!listado.length"
    >
      <q-icon name="bi-arrow-left-right" class="q-mr-sm" size="xs"></q-icon>
      Transferir al nuevo coordinador</q-btn
    >

    <q-btn color="negative" no-caps push icon="bi-x" @click="cancelar()"
      >Cancelar</q-btn
    >
  </div>
</template>

<script lang="ts" src="./TransferirTareaPage.ts"></script>
