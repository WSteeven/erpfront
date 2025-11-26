<template>
  <q-page padding class="flex flex-center">
    <q-card flat bordered class="my-card bg-desenfoque">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte Consolidado de Saldo</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Tipos reportes -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de Reporte</label>
          <q-select
            v-model="consolidado.tipo_saldo"
            :options="tipos_saldos_consolidado"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            :error="!!v$.tipo_saldo.$errors.length"
            error-message="Debes seleccionar un tipo de saldo"
            use-input
            input-debounce="0"
            @popup-show="ordenarLista(tipos_saldos_consolidado, 'label')"
            @blur="v$.tipo_saldo.$touch"
            @update:model-value="limpiar()"
            @filter="filtarTiposSaldos"
            :option-value="v => v.value"
            :option-label="v => v.label"
            emit-value
            map-options
          >
            <template v-slot:error>
              <error-component clave="tipo_saldo" :v$="v$"/>
            </template>
            <template v-slot:no-option>
              <no-option-component/>
            </template>
          </q-select>
        </div>
        <!-- Empleados -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
              consolidado.tipo_saldo == tipo_saldo.GASTO ||
              consolidado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA ||
              consolidado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
              consolidado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
              consolidado.tipo_saldo == tipo_saldo.TRANSFERENCIA_SALDOS) &&
            !is_inactivo
          "
        >
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="consolidado.empleado"
            :options="usuarios"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            @filter="filtrarUsuarios"
            :option-value="v => v.id"
            :option-label="v => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <no-option-component/>
            </template>
          </q-select>
        </div>
        <!-- Empleados Inactivos -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
              consolidado.tipo_saldo == tipo_saldo.GASTO ||
              consolidado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA ||
              consolidado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
              consolidado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
              consolidado.tipo_saldo == tipo_saldo.TRANSFERENCIA_SALDOS) &&
            is_inactivo
          "
        >
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="consolidado.empleado"
            :options="usuariosInactivos"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            @filter="filtrarUsuariosInactivos"
            :option-value="v => v.id"
            :option-label="v => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <no-option-component/>
            </template>
            <template v-slot:after>
              <q-btn color="positive" @click="recargarEmpleadosInactivos()">
                <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
              </q-btn>
            </template>
          </q-select>
        </div>
        <!-- Fecha Inicio -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Inicio:</label>
          <q-input
            v-model="consolidado.fecha_inicio"
            placeholder="Obligatorio"
            :error="!!v$.fecha_inicio.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="consolidado.fecha_inicio"
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
              <error-component clave="fecha_inicio" :v$="v$"/>
            </template>
          </q-input>
        </div>
        <!-- Fecha Fin -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Fin:</label>
          <q-input
            v-model="consolidado.fecha_fin"
            placeholder="Obligatorio"
            :error="!!v$.fecha_fin.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="consolidado.fecha_fin"
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
              <error-component clave="fecha_fin" :v$="v$"/>
            </template>
          </q-input>
        </div>

        <div
          class="col-12 col-md-3"
          v-if="
            consolidado.tipo_saldo == 1 ||
            consolidado.tipo_saldo == 2 ||
            consolidado.tipo_saldo == 6
          "
        >
          <q-checkbox
            v-model="is_all_empleados"
            color="secondary"
            label="Todos los empleados"
            :true-value="true"
            :false-value="false"
            @update:model-value="mostrarEmpleados()"
          ></q-checkbox>
        </div>
        <div class="col-12 col-md-3">
          <q-checkbox
            v-model="is_inactivo"
            color="secondary"
            label="Inactivo"
          ></q-checkbox>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around" class="row q-col-gutter-xs">
        <div class="col-md-6">
          <q-btn
            color="positive"
            @click="generar_reporte(consolidado, 'excel')"
            class="full-width"
            unelevated
            square
          >
            <q-icon
              name="bi-file-earmark-excel-fill"
              size="xs"
              class="q-mr-sm"
            ></q-icon
            >Excel</q-btn
          >
        </div>

        <div class="col-md-6">
          <q-btn
            color="negative"
            @click="generar_reporte(consolidado, 'pdf')"
            class="full-width"
            unelevated
            square
          >
            <q-icon
              name="bi-file-earmark-pdf-fill"
              size="xs"
              class="q-mr-sm"
            ></q-icon
            >PDF</q-btn
          >
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ConsolidadoPage.ts"></script>
