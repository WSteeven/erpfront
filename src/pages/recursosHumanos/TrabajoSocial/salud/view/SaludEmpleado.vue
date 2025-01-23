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
        :v$="v$"
        key-error="discapacidades"
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

    <!-- Indique fecha que adquirio enfermedad cronica -->
    <div
      class="col-12 col-md-3 q-mb-md col-sm-3"
      v-if="salud.tiene_enfermedad_cronica"
    >
      <label class="q-mb-sm block">Indique fecha adquirio enfermedad crónica</label>
      <q-input
        v-model="salud.fecha_enfermedad_cronica"
        placeholder="Obligatorio"
        :disable="disable"
        autogrow
        outlined
        dense
        :error="!!v$?.fecha_enfermedad_cronica.$errors.length"
        @blur="v$?.fecha_enfermedad_cronica.$touch"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="salud.fecha_enfermedad_cronica"
                :mask="maskFecha"
                today-btn
              >
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    label="Cerrar"
                    color="primary"
                    flat
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:error>
          <error-component clave="fecha_enfermedad_cronica" :v$="v$"/>
        </template>
      </q-input>
    </div>

    <!-- Indique enfermedad crónica -->
    <div
      class="col-12 col-md-3 q-mb-md col-sm-3"
      v-if="salud.tiene_enfermedad_cronica"
    >
      <label class="q-mb-sm block">Indique enfermedad crónica y cómo la adquirio</label>
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
        <template v-slot:error>
          <error-component clave="enfermedad_cronica" :v$="v$"/>
        </template>
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
        :error="!!v$?.nombre_familiar_dependiente_discapacitado.$errors.length"
        @blur="v$?.nombre_familiar_dependiente_discapacitado.$touch"
      >
        <template v-slot:error>
          <error-component clave="nombre_familiar_dependiente_discapacitado" :v$="v$"/>
        </template>
      </q-input>
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
          <error-component clave="parentesco_familiar_discapacitado" :v$="v$"/>
        </template>

        <template v-slot:no-option>
          <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- imagen_rutagrama -->
    <div class="col-12 col-md-3 q-mb-md col-sm-12" v-if="salud.tiene_familiar_dependiente_discapacitado">
      <label for="q-mb-xl block">Identificación familiar discapacitado</label>
      <selector-imagen
        file_extensiones=".jpg, image/*"
        placeholder="Obligatorio"
        :imagen="salud.imagen_cedula_familiar_dependiente_discapacitado"
        :error="!!v$.imagen_cedula_familiar_dependiente_discapacitado.$errors.length"
        :disable="disable"
        :alto="'300px'"
        @update:model-value="data => (salud.imagen_cedula_familiar_dependiente_discapacitado = data)"
      ></selector-imagen>
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
        :v$="v$"
        key-error="discapacidades_familiar_dependiente"
        :accion1="btnEliminarDefault(salud.discapacidades_familiar_dependiente)"
        :alto-fijo="false"
        :ajustarCeldas="true"
      >
      </essential-table>
    </div>
  </div>
</template>

<script src="./SaludEmpleado.ts" />
