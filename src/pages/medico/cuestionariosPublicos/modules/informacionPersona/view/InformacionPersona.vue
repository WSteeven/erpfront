<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col-12 q-mb-md text-primaryd text-bold">
      <q-icon name="bi-person-fill" class="q-mr-sm"></q-icon>
      Información general
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Primer nombre</label>
      <q-input
        v-model="persona.primer_nombre"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.primer_nombre = d)"
        @blur="v$.persona.primer_nombre.$touch"
        :error="!!v$.persona.primer_nombre.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.primer_nombre.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Segundo nombre</label>
      <q-input
        v-model="persona.segundo_nombre"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.segundo_nombre = d)"
        outlined
        dense
        @blur="v$.persona.segundo_nombre.$touch"
        :error="!!v$.persona.segundo_nombre.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.segundo_nombre.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Primer apellido</label>
      <q-input
        v-model="persona.primer_apellido"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.primer_apellido = d)"
        outlined
        dense
        @blur="v$.persona.primer_apellido.$touch"
        :error="!!v$.persona.primer_apellido.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.primer_apellido.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Segundo apellido</label>
      <q-input
        v-model="persona.segundo_apellido"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.segundo_apellido = d)"
        outlined
        dense
        @blur="v$.persona.segundo_apellido.$touch"
        :error="!!v$.persona.segundo_apellido.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.segundo_apellido.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cédula</label>
      <q-input
        v-model="persona.identificacion"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.identificacion = d)"
        @blur="
          () => {
            v$.persona.identificacion.$touch()
            validarCedula(persona.identificacion)
            validarCuestionarioLleno(persona.identificacion)
          }
        "
        :error="!!v$.persona.identificacion.$errors.length"
      >
        <template #error>
          <div
            v-for="error of v$.persona.identificacion.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Provincia</label>
      <q-select
        v-model="persona.provincia"
        :options="provincias"
        @filter="filtrarProvincias"
        @update:model-value="(d) => (modelValue.persona.provincia = d)"
        transition-show="jump-up"
        transition-hide="jump-down"
        options-dense
        dense
        outlined
        :input-debounce="0"
        use-input
        :option-value="(v) => v.id"
        :option-label="(v) => v.provincia"
        emit-value
        map-options
        @blur="v$.persona.provincia.$touch"
        :error="!!v$.persona.provincia.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.provincia.$errors" :key="error.$uid">
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

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Ciudad</label>
      <q-select
        v-model="persona.canton"
        :options="cantones"
        @filter="filtrarCantones"
        @update:model-value="(d) => (modelValue.persona.canton = d)"
        transition-show="jump-up"
        transition-hide="jump-down"
        options-dense
        dense
        outlined
        :input-debounce="0"
        use-input
        :option-value="(v) => v.id"
        :option-label="(v) => v.canton"
        emit-value
        map-options
        @blur="v$.persona.canton.$touch"
        :error="!!v$.persona.canton.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.canton.$errors" :key="error.$uid">
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

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Área</label>
      <q-input
        v-model="persona.area"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.area = d)"
        outlined
        dense
        @blur="v$.persona.area.$touch"
        :error="!!v$.persona.area.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.area.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 q-mb-md col-sm-3">
      <label class="q-mb-sm block">Nivel Academico</label>
      <q-select
        v-model="persona.nivel_academico"
        :options="niveles_academicos"
        transition-show="jump-up"
        transition-hide="jump-down"
        @update:model-value="(d) => (modelValue.persona.nivel_academico = d)"
        options-dense
        dense
        outlined
        :input-debounce="0"
        use-input
        :option-value="(v) => v.nombre"
        :option-label="(v) => v.nombre"
        emit-value
        map-options
        @blur="v$.persona.nivel_academico.$touch"
        :error="!!v$.persona.nivel_academico.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.nivel_academico.$errors"
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

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Antiguedad</label>
      <q-input
        v-model="persona.antiguedad"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.antiguedad = d)"
        outlined
        dense
        @blur="v$.persona.antiguedad.$touch"
        :error="!!v$.persona.antiguedad.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.antiguedad.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Correo</label>
      <q-input
        v-model="persona.correo"
        placeholder="Obligatorio"
        @update:model-value="(d) => (modelValue.persona.correo = d)"
        type="email"
        outlined
        dense
        @blur="v$.persona.correo.$touch"
        :error="!!v$.persona.correo.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.correo.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Estado Civil</label>
      <q-select
        v-model="persona.estado_civil"
        :options="estadosCiviles"
        @filter="filtrarEstadosCiviles"
        @update:model-value="(d) => (modelValue.persona.estado_civil = d)"
        transition-show="jump-up"
        transition-hide="jump-down"
        options-dense
        dense
        outlined
        :input-debounce="0"
        use-input
        @blur="v$.persona.estado_civil.$touch"
        :error="!!v$.persona.estado_civil.$errors.length"
        :option-value="(v) => v.id"
        :option-label="(v) => v.nombre"
        emit-value
        map-options
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.estado_civil.$errors"
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

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha nacimiento</label>
      <q-input
        v-model="persona.fecha_nacimiento"
        placeholder="Obligatorio"
        outlined
        type="datetime"
        dense
        @blur="v$.persona.fecha_nacimiento.$touch"
        :error="!!v$.persona.fecha_nacimiento.$errors.length"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="persona.fecha_nacimiento"
                @update:model-value="
                  (d) => (modelValue.persona.fecha_nacimiento = d)
                "
                :mask="maskFecha"
                today-btn
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template #error>
          <div
            v-for="error of v$.persona.fecha_nacimiento.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Género</label>
      <q-toggle
        :label="modelValue.persona.genero == 'M' ? 'Masculino' : 'Femenino'"
        v-model="modelValue.persona.genero"
        true-value="M"
        false-value="F"
        color="primary"
        keep-color
        icon="fa-solid fa-person"
        unchecked-icon="fa-solid fa-person-dress"
      />
    </div>
  </div>

  <div v-if="mostrarConsumoDrogas" class="row q-col-gutter-sm q-pa-sm">
    <!-- <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Nombre empresa</label>
      <q-input
        v-model="persona.nombre_empresa"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.nombre_empresa = d)"
        @blur="v$.persona.nombre_empresa.$touch"
        :error="!!v$.persona.nombre_empresa.$errors.length"
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.nombre_empresa.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div> -->

    <!-- <div class="col-12 col-md-3">
      <label class="q-mb-sm block">RUC</label>
      <q-input
        v-model="persona.ruc"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.ruc = d)"
        @blur="v$.persona.ruc.$touch"
        :error="!!v$.persona.ruc.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.ruc.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div> -->

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cargo</label>
      <q-input
        v-model="persona.cargo"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.cargo = d)"
        @blur="v$.persona.cargo.$touch"
        :error="!!v$.persona.cargo.$errors.length"
      >
        <template v-slot:error>
          <div v-for="error of v$.persona.cargo.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Tipo afiliación seguridad social</label>
      <q-input
        v-model="persona.tipo_afiliacion_seguridad_social"
        placeholder="Obligatorio"
        outlined
        dense
        @update:model-value="
          (d) => (modelValue.persona.tipo_afiliacion_seguridad_social = d)
        "
        @blur="v$.persona.tipo_afiliacion_seguridad_social.$touch"
        :error="!!v$.persona.tipo_afiliacion_seguridad_social.$errors.length"
      >
        <template #error>
          <div
            v-for="error of v$.persona.tipo_afiliacion_seguridad_social.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Número de hijos</label>
      <q-input
        v-model="persona.numero_hijos"
        placeholder="Obligatorio"
        type="number"
        outlined
        dense
        @update:model-value="(d) => (modelValue.persona.numero_hijos = d)"
        @blur="v$.persona.numero_hijos.$touch"
        :error="!!v$.persona.numero_hijos.$errors.length"
      >
        <template #error>
          <div
            v-for="error of v$.persona.numero_hijos.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">AutoIdentificacion Etnica</label>
      <q-select
        v-model="persona.autoidentificacion_etnica"
        :options="autoidentificaciones_etnicas"
        @update:model-value="
          (d) => (modelValue.persona.autoidentificacion_etnica = d)
        "
        transition-show="jump-up"
        transition-hide="jump-down"
        options-dense
        dense
        outlined
        :input-debounce="0"
        use-input
        @blur="v$.persona.autoidentificacion_etnica.$touch"
        :error="!!v$.persona.autoidentificacion_etnica.$errors.length"
        :option-value="(v) => v.value"
        :option-label="(v) => v.nombre"
        emit-value
        map-options
      >
        <template v-slot:error>
          <div
            v-for="error of v$.persona.autoidentificacion_etnica.$errors"
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

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Discapacidad</label>
      <q-toggle
        v-model="modelValue.persona.discapacidad"
        color="primary"
        icon="bi-person-wheelchair"
        keep-color
      />
    </div>

    <div v-if="modelValue.persona.discapacidad" class="col-12 col-md-3">
      <label class="q-mb-sm block">Porcentaje de discapacidad</label>
      <q-input
        v-model="persona.porcentaje_discapacidad"
        placeholder="Obligatorio"
        hint="Describa la discapacidad y su porcentaje"
        autogrow
        outlined
        dense
        @update:model-value="
          (d) => (modelValue.persona.porcentaje_discapacidad = d)
        "
        @blur="v$.persona.porcentaje_discapacidad.$touch"
        :error="!!v$.persona.porcentaje_discapacidad.$errors.length"
      >
        <template #error>
          <div
            v-for="error of v$.persona.porcentaje_discapacidad.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Enfermedades preexistentes</label>
      <q-input
        v-model="persona.enfermedades_preexistentes"
        placeholder="Obligatorio"
        autogrow
        type="textarea"
        outlined
        dense
        @update:model-value="
          (d) => (modelValue.persona.enfermedades_preexistentes = d)
        "
        @blur="v$.persona.enfermedades_preexistentes.$touch"
        :error="!!v$.persona.enfermedades_preexistentes.$errors.length"
      >
        <template #error>
          <div
            v-for="error of v$.persona.enfermedades_preexistentes.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Es trabajador sustituto</label>
      <q-toggle
        v-model="modelValue.persona.es_trabajador_sustituto"
        color="primary"
        icon="bi-person-standing"
        keep-color
      />
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Ha recibido capacitación</label>
      <q-toggle
        v-model="modelValue.persona.ha_recibido_capacitacion"
        color="primary"
        icon="bi-person-raised-hand"
        keep-color
      />
    </div>

    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Tiene examen preocupacional</label>
      <q-toggle
        v-model="modelValue.persona.tiene_examen_preocupacional"
        color="primary"
        icon="bi-clipboard2-pulse"
        keep-color
      />
    </div>
  </div>
</template>

<script src="./InformacionPersona.ts"></script>
