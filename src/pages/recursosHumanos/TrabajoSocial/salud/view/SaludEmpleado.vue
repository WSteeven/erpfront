<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <!-- Tiene discapacidad -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">¿Tiene discapacidad?</label>
      <option-group-component
        v-model="salud.tiene_discapacidad"
        :disable="disable"
      />
    </div>
    <div class="col-12 col-md-9 col-sm-12" v-if="salud.tiene_discapacidad">
      <q-btn
        color="primary"
        @click="agregarDiscapacidad(salud.discapacidades)"
        class="col-12 col-md-3 full-width"
        >Agregar discapacidad
      </q-btn>
      <essential-table
        :configuracionColumnas="
          [acciones.nuevo, acciones.editar].includes(accion)
            ? [...configuracionColumnasDiscapacidades, accionesTabla]
            : configuracionColumnasDiscapacidades
        "
        :datos="salud.discapacidades"
        :permitirConsultar="false"
        :permitirEliminar="false"
        :disable="disable"
        :permitirEditar="false"
        :mostrarBotones="false"
        :permitir-editar-celdas="true"
        :mostrar-header="false"
        :grid="false"
        :accion1="btnEliminarDefault(salud.discapacidades)"
        :alto-fijo="false"
        :ajustarCeldas="true"
      >
      </essential-table>
    </div>

    <!-- Sufre de alguna enfermedad crónica -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">¿Sufre de alguna enfermedad crónica?</label>
      <option-group-component
        v-model="salud.tiene_enfermedad_cronica"
        :disable="disable"
      />
    </div>

    <!-- Antiguedad -->
    <div
      class="col-12 col-md-3 q-mb-md col-sm-3"
      v-if="salud.tiene_enfermedad_cronica"
    >
      <label class="q-mb-sm block">Indique enfermedad crónica</label>
      <q-input
        v-model="salud.enfermedad_cronica"
        placeholder="Obligatorio"
        :disable="disable"
        autogrow
        outlined
        dense
        :error="!!v$?.enfermedad_cronica.$errors.length"
        @blur="v$?.enfermedad_cronica.$touch"
      >

      </q-input>
    </div>

    <!-- Alergias -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Alergias</label>
      <q-input
        v-model="salud.alergias"
        hint="Separe con comas para registrar varias alergias"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
      />
    </div>

    <!-- Lugar atencion -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Lugar de atención</label>
      <option-group-component
        v-model="salud.lugar_atencion"
        :disable="disable"
        :options="optionsLugaresAtencion"
        clave="lugar_atencion"
        :v$="v$"
        :error="!!v$.lugar_atencion.$errors.length"
      />
    </div>

    <!-- familiar_cercano_dependiente_discapacitado -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block"
        >¿Tiene familiar dependiente con discapacidad?</label
      >
      <option-group-component
        v-model="salud.tiene_familiar_dependiente_discapacitado"
        :disable="disable"
      />
    </div>

    <!-- Nombre Familiar cercano discapacitado -->
    <div
      class="col-12 col-md-3"
      v-if="salud.tiene_familiar_dependiente_discapacitado"
    >
      <label class="q-mb-sm block">Nombre del familiar</label>
      <q-input
        v-model="salud.nombre_familiar_dependiente_discapacitado"
        placeholder="Obligatorio"
        :disable="disable"
        autogrow
        outlined
        dense
      />
    </div>

<!--    {{ v$.$errors }}-->

    <!-- Parentesco familiar discapacitado -->
    <div
      class="col-12 col-md-3 q-mb-md col-sm-3"
      v-if="salud.tiene_familiar_dependiente_discapacitado"
    >
      <label class="q-mb-sm block">Parentesco</label>
      <q-select
        v-model="salud.parentesco_familiar_discapacitado"
        :options="parentescos"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$?.parentesco_familiar_discapacitado.$errors.length"
        @blur="v$?.parentesco_familiar_discapacitado.$touch"
        error-message="Debes seleccionar un parentesco"
        use-input
        input-debounce="0"
        :option-value="v => v.value"
        :option-label="v => v.nombre"
        emit-value
        map-options
      >
        <template v-slot:error>
          <div
            v-for="error of v$?.parentesco_familiar_discapacitado.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>

        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div
      class="col-12 col-md-6 col-sm-12"
      v-if="salud.tiene_familiar_dependiente_discapacitado"
    >
      <q-btn
        color="primary"
        @click="agregarDiscapacidad(salud.discapacidades_familiar_dependiente)"
        class="col-12 col-md-3 full-width"
        >Agregar discapacidad
      </q-btn>
      <essential-table
        :configuracionColumnas="[
          ...configuracionColumnasDiscapacidades,
          accionesTabla
        ]"
        :datos="salud.discapacidades_familiar_dependiente"
        :permitirConsultar="false"
        :permitirEliminar="false"
        :permitirEditar="false"
        :mostrarBotones="false"
        :permitir-editar-celdas="true"
        :mostrar-header="false"
        :grid="false"
        :accion1="btnEliminarDefault(salud.discapacidades_familiar_dependiente)"
        :alto-fijo="false"
        :ajustarCeldas="true"
      >
      </essential-table>
    </div>
  </div>
</template>

<script src="./SaludEmpleado.ts" />
