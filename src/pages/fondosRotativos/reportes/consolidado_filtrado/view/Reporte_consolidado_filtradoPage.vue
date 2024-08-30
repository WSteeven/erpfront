<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card bg-grey-1">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Generar Reporte Consolidado de Saldo</div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- Fecha Inicio -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Inicio:</label>
          <q-input
            v-model="consolidadofiltrado.fecha_inicio"
            placeholder="Obligatorio"
            :error="!!v$.fecha_inicio.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="consolidadofiltrado.fecha_inicio"
                    :mask="maskFecha"
                    :options="optionsFechaInicio"
                    today-btn
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- Fecha Fin -->
        <div class="col-6 col-md-3">
          <label class="q-mb-sm block">Fecha Fin:</label>
          <q-input
            v-model="consolidadofiltrado.fecha_fin"
            placeholder="Obligatorio"
            :error="!!v$.fecha_fin.$errors.length"
            :disable="disabled"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="consolidadofiltrado.fecha_fin"
                    :mask="maskFecha"
                    :options="optionsFechaFin"
                    today-btn
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:error>
              <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- Tipos saldo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo Saldo</label>
          <q-select
            v-model="consolidadofiltrado.tipo_saldo"
            :options="tipos_saldos_consolidado_filtro"
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
            @update:model-value="limpiarTipoSaldo"
            @blur="v$.tipo_saldo.$touch"
            @filter="filtarTiposSaldos"
            :option-value="(v) => v.value"
            :option-label="(v) => v.label"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.tipo_saldo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Tipos filtros -->
        <div
          class="col-12 col-md-3"
          v-if="
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA
          "
        >
          <label class="q-mb-sm block">Tipo Filtro</label>
          <q-select
            v-model="consolidadofiltrado.tipo_filtro"
            :options="tipos_filtros"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            :error="!!v$.tipo_filtro.$errors.length"
            error-message="Debes seleccionar un tipo de saldo"
            use-input
            input-debounce="0"
            @blur="v$.tipo_filtro.$touch"
            @filter="filtrarTiposFiltro"
            @update:model-value="limpiar"
            :option-value="(v) => v.value"
            :option-label="(v) => v.name"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.tipo_filtro.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Empleados -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.TRANSFERENCIA_SALDOS) &&
            is_inactivo == 'false'
          "
        >
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="consolidadofiltrado.empleado"
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
            :error="!!v$.empleado.$errors.length"
            error-message="Debes seleccionar un empleado"
            @blur="v$.empleado.$touch"
            @filter="filtrarUsuarios"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Empleados Inactivos -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
              consolidadofiltrado.tipo_saldo == tipo_saldo.TRANSFERENCIA_SALDOS) &&
            is_inactivo == 'true'
          "
        >
          <label class="q-mb-sm block">Empleado</label>
          <q-select
            v-model="consolidadofiltrado.empleado"
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
            :error="!!v$.empleado.$errors.length"
            error-message="Debes seleccionar un empleado"
            @blur="v$.empleado.$touch"
            @filter="filtrarUsuariosInactivos"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
            <template v-slot:after>
                <q-btn color="positive" @click="recargarEmpleadosInactivos()">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
          </q-select>
        </div>
        <!-- Proyectos -->
        <div
          class="col-12 col-md-4 q-mb-md"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.PROYECTO ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">Proyectos</label>
          <q-select
            v-model="consolidadofiltrado.proyecto"
            :options="proyectos"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.proyecto.$errors.length"
            error-message="Debes seleccionar un proyecto"
            @blur="v$.proyecto.$touch"
            @filter="filtrarProyectos"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombre"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="q-my-sm">
                <q-item-section>
                  <q-item-label class="text-bold text-primary">{{
                    scope.opt.codigo_proyecto
                  }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.nombre }} </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Tareas -->
        <div
          class="col-12 col-md-4 q-mb-md"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.TAREA ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
            consolidadofiltrado.proyecto >= 0 &&
            ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">Tareas</label>
          <q-select
            v-model="consolidadofiltrado.tarea"
            :options="tareas"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.tarea.$errors.length"
            error-message="Debes seleccionar una tarea"
            @blur="v$.tarea.$touch"
            @filter="filtrarTareas"
            :option-value="(v) => v.id"
            :option-label="(v) => v.titulo"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.tarea.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="q-my-sm">
                <q-item-section>
                  <q-item-label class="text-bold text-primary">{{
                    scope.opt.codigo_tarea
                  }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Detalle -->
        <div
          class="col-12 col-md-3 q-mb-md"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.DETALLE ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">Detalle</label>
          <q-select
            v-model="consolidadofiltrado.detalle"
            :options="detalles"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.detalle.$errors.length"
            error-message="Debes seleccionar un detalle"
            @blur="v$.detalle.$touch"
            @filter="filtrarDetalles"
            :option-value="(v) => v.id"
            :option-label="(v) => v.descripcion"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Ciudad -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.CIUDAD ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">Ciudades</label>
          <q-select
            v-model="consolidadofiltrado.ciudad"
            :options="cantones"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.ciudad.$errors.length"
            error-message="Debes seleccionar una ciudad"
            @blur="v$.ciudad.$touch"
            @filter="filtrarCiudades"
            :option-value="(v) => v.id"
            :option-label="(v) => v.canton"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.ciudad.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Subdetalle-->
        <div
          class="col-12 col-md-4 q-mb-md"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.SUBDETALLE ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">SubDetalle</label>
          <q-select
            v-model="consolidadofiltrado.subdetalle"
            :options="sub_detalles"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.subdetalle.$errors.length"
            error-message="Debes seleccionar un subdetalle"
            @blur="v$.subdetalle.$touch"
            @filter="filtroSubdetalles"
            :option-value="(v) => v.id"
            :option-label="(v) => v.descripcion"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.subdetalle.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Autorizacion -->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.AUTORIZACIONES ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)
          "
        >
          <label class="q-mb-sm block">Autorización Especial</label>
          <q-select
            v-model="consolidadofiltrado.autorizador"
            :options="autorizacionesEspeciales"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :disable="disabled"
            :readonly="disabled"
            use-input
            input-debounce="0"
            :error="!!v$.autorizador.$errors.length"
            error-message="Debes seleccionar un autorizador"
            @blur="v$.autorizador.$touch"
            @filter="filtrarAutorizacionesEspeciales"
            :option-value="(v) => v.id"
            :option-label="(v) => v.nombres + ' ' + v.apellidos"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.autorizador.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No hay resultados </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!--RUC-->
        <div
          class="col-12 col-md-3"
          v-if="
            (consolidadofiltrado.tipo_filtro == tipo_filtro.RUC ||
              consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS) &&
             ( consolidadofiltrado.tipo_saldo == tipo_saldo.GASTO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.GASTOS_FOTOGRAFIA)          "
        >
          <label class="q-mb-sm block">RUC</label>
          <q-input
            v-model="consolidadofiltrado.ruc"
            placeholder=""
            type="textarea"
            autogrow
            :disable="disabled"
            outlined
            dense
          >
          </q-input>
        </div>
        <div
          class="col-12 col-md-3"
          v-if="
            consolidadofiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
            consolidadofiltrado.tipo_saldo == tipo_saldo.TRANSFERENCIA_SALDOS ||
            consolidadofiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
            consolidadofiltrado.tipo_filtro == tipo_filtro.TODOS
          "
        >
          <q-checkbox
            v-model="is_inactivo"
            color="secondary"
            label="Inactivo"
            true-value="true"
            false-value="false"
          ></q-checkbox>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around">
        <q-btn color="positive" @click="generar_reporte(consolidadofiltrado, 'excel')">
          <q-icon name="bi-file-earmark-excel-fill" size="xs" class="q-mr-sm"></q-icon
          >Excel</q-btn
        >
        <q-btn color="negative" @click="generar_reporte(consolidadofiltrado, 'pdf')">
          <q-icon name="bi-file-earmark-pdf-fill" size="xs" class="q-mr-sm"></q-icon
          >PDF</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ConsolidadoFiltradoPage.ts"></script>
