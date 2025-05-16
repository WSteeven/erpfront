<template>
  <div class="text-center text-bold q-mb-md">
    Selecciona al nuevo responsable
  </div>
  <q-card class="rounded-card">
    <q-card-section>
      <div class="row q-col-gutter-xs">
        <!-- Departamento -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Nuevo departamento responsable</label>
          <q-select
            v-model="reagendar.departamento_responsable"
            :options="departamentos"
            @filter="filtrarDepartamentos"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
            options-dense
            dense
            outlined
            :option-label="item => item.nombre"
            :option-value="item => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            @update:model-value="
              () => {
                reagendar.responsable = null
                obtenerResponsables(reagendar.departamento_responsable)
              }
            "
            :error="!!v$.departamento_responsable.$errors.length"
            @blur="v$.departamento_responsable.$touch"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div
                v-for="error of v$.departamento_responsable.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Nuevo empleado responsable</label>
          <q-select
            v-model="reagendar.responsable"
            :options="empleados"
            @filter="filtrarEmpleados"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
            options-dense
            dense
            outlined
            :option-label="item => `${item.nombres} ${item.apellidos}`"
            :option-value="item => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.responsable.$errors.length"
            @blur="v$.responsable.$touch"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Primero seleccione un departamento
                </q-item-section>
              </q-item>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="modificarCc"
            label="Modificar Cc"
            outlined
            dense
          ></q-checkbox>
        </div>

        <div v-if="modificarCc" class="col-12">
          <label class="q-mb-sm block"
            ><q-icon name="bi-people" class="q-mr-sm"></q-icon>Cc - Las personas
            especificadas aqui podrán agregar y leer comentarios en el
            seguimiento del ticket</label
          >
          <q-select
            v-model="ticket.cc"
            :options="empleadosOrigen"
            @filter="filtrarEmpleadosOrigen"
            transition-show="scale"
            transition-hide="scale"
            hint="Opcional"
            options-dense
            dense
            outlined
            :disable="disabled"
            :option-label="item => `${item.nombres} ${item.apellidos}`"
            :option-value="item => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            use-chips
            multiple
          >
          </q-select>
        </div>
      </div>

      <div class="row q-gutter-sm justify-end">
        <!-- Boton guardar -->
        <q-btn color="primary" no-caps push @click="cambiar()">
          <q-icon name="bi-arrow-left-right" size="xs" class="q-pr-sm"></q-icon>
          <span>Cambiar responsable</span>
        </q-btn>

        <q-btn color="negative" no-caps push @click="cancelar()">
          <q-icon name="bi-x" size="xs" class="q-pr-sm"></q-icon>
          <span>Cancelar</span>
        </q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script src="./ReagendarTicketPage.ts"></script>
