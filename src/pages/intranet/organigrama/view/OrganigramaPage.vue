<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsOrganigrama"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarOrganigrama"
    tabDefecto="1"
    ajustarCeldas
    :forzarListar="true"
  >
    <template #formulario>
      <q-form @submit.prevent="() => {}">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleado -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="organigrama.empleado_id"
              :options="empleados.map(emp => ({ label: emp.nombres +' '+ emp.apellidos, value: emp.id }))"
              :error="v$.empleado_id.$error && v$.empleado_id.$dirty"
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error in v$.empleado_id.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Cargo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cargo</label>
            <q-input
              v-model="organigrama.cargo"
              :error="v$.cargo.$error && v$.cargo.$dirty"
              dense
              outlined
              readonly
            >
              <template v-slot:error>
                <div v-for="error in v$.cargo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tipo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tipo</label>
            <q-select
              v-model="organigrama.tipo"
              :options="tipos.map(tipo => ({ label: tipo, value: tipo }))"
              :error=" v$.tipo.$error && v$.tipo.$dirty"
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error in v$.tipo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Departamento -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Departamento</label>
            <q-input
              v-model="organigrama.departamento"
              :error="v$.departamento.$dirty"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error in v$.departamento.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Nivel -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nivel</label>
            <q-input
              v-model="organigrama.nivel"
              type="number"
              :error="v$.nivel.$dirty"
              dense
              outlined
            >
              <template v-slot:error>
                <div v-for="error in v$.nivel.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Jefe Inmediato -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Jefe Inmediato</label>
            <q-select
              v-model="organigrama.jefe_id"
              :options="empleados.map(emp => ({ label: emp.nombres +' '+ emp.apellidos, value: emp.id }))"
              :error="v$.jefe_id.$invalid"
              dense
              outlined
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error in v$.jefe_id.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./OrganigramaPage.ts"></script>
