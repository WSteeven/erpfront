<template>
  <div class="text-center text-bold q-mb-md">
    Selecciona al nuevo jefe inmediato para el/los siguiente/s empleado/s:
  </div>
  <q-card class="rounded-card">
    <q-card-section >
      <!-- Jefe común (opcional) -->
      <q-card flat bordered class="q-pa-md q-mb-md ">
        <div class="row q-gutter-xs">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Asignar mismo nuevo jefe a todos</label>
            <q-select
                v-model="jefeComun"
                :options="empleados"
                use-input
                input-debounce="0"
                outlined
                dense
                clearable
                @filter="filtrarEmpleados"
                :option-value="v => v.id"
                :option-label="v => v.nombres + ' ' + v.apellidos"
                emit-value
                map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-md-5">
            <label class="q-mb-sm block"> &nbsp; </label>
            <q-btn
                label="Aplicar a todos"
                color="primary"

                :disable="!jefeComun"
                @click="aplicarJefeComun"
            />
          </div>
        </div>
      </q-card>


      <div
        class="row q-col-gutter-sm"
        v-for="(subordinado, index) in empleados_subordinados"
        :key="index"
      >
        <!-- Empleado -->
        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="subordinado.id"
            :options="empleados"
            disable
            dense
            outlined
            :option-value="v => v.id"
            :option-label="v => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          />
        </div>

        <!-- Jefe -->
        <div class="col-12 col-md-6 q-mb-md col-sm-6">
          <label class="q-mb-sm block">Nuevo Jefe inmediato</label>
          <q-select
            v-model="subordinado.nuevo_jefe_id"
            :options="empleados"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            use-input
            input-debounce="0"
            @filter="filtrarEmpleados"
            @popup-show="ordenarLista(empleados, 'nombres')"
            :option-value="v => v.id"
            :option-label="v => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <no-option-component />
            </template>
          </q-select>
        </div>
      </div>
    </q-card-section>

    <!-- Acciones -->
    <div class="row justify-end q-my-md q-mr-md q-gutter-sm">
      <button-submits
        :accion="acciones.nuevo"
        @guardar="guardar"
        @cancelar="cancelar"
      />
    </div>
  </q-card>
</template>
<script src="./ReasignarSubordinadosPage.ts" />

<style scoped></style>
