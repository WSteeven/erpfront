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
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Fecha Inicio -->
          <div class="col-6 col-md-6">
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input
              v-model="consolidadoFiltrado.fecha_inicio"
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
                      v-model="consolidadoFiltrado.fecha_inicio"
                      :mask="maskFecha"
                      :options="optionsFechaInicio"
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
                <error-component clave="fecha_inicio" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Fecha Fin -->
          <div class="col-6 col-md-6">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
              v-model="consolidadoFiltrado.fecha_fin"
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
                      v-model="consolidadoFiltrado.fecha_fin"
                      :mask="maskFecha"
                      :options="optionsFechaFin"
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
                <error-component clave="fecha_fin" :v$="v$" />
              </template>
            </q-input>
          </div>
          <!-- Tipos saldo -->
          <div class="col-12 col-md-12">
            <label class="q-mb-sm block">Tipo Saldo</label>
            <q-select
              v-model="consolidadoFiltrado.tipo_saldo"
              :options="tipos_saldos_consolidado_filtro"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo_saldo.$errors.length"
              error-message="Debes seleccionar un tipo de saldo"
              use-input
              input-debounce="0"
              @update:model-value="limpiarTipoSaldo"
              @blur="v$.tipo_saldo.$touch"
              @filter="filtarTiposSaldos"
              :option-value="v => v.value"
              :option-label="v => v.label"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo_saldo" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Tipos filtros -->
          <div
            class="col-12 col-md-6"
            v-if="
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Tipo Filtro</label>
            <q-select
              v-model="consolidadoFiltrado.tipo_filtro"
              :options="tipos_filtros"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              :error="!!v$.tipo_filtro.$errors.length"
              error-message="Debes seleccionar un tipo de saldo"
              use-input
              input-debounce="0"
              @blur="v$.tipo_filtro.$touch"
              @filter="filtrarTiposFiltro"
              @update:model-value="limpiar"
              :option-value="v => v.value"
              :option-label="v => v.name"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="tipo_filtro" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Grupo -->
          <div
            v-if="
              consolidadoFiltrado.tipo_filtro === tipo_filtro.GRUPO ||
              consolidadoFiltrado.tipo_saldo === tipo_saldo.ACREDITACIONES
            "
            class="col-12 col-md-6"
          >
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="consolidadoFiltrado.grupo"
              :options="grupos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              clearable
              use-input
              input-debounce="0"
              :error="!!v$.grupo.$errors.length"
              @blur="v$.grupo.$touch"
              @filter="filtrarGrupos"
              @popup-show="ordenarLista(grupos, 'nombre')"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="grupo" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Empleados -->
          <div
            class="col-12 col-md-6"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
                consolidadoFiltrado.tipo_saldo ==
                  tipo_saldo.TRANSFERENCIA_SALDOS) &&
              !is_inactivo
            "
          >
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="consolidadoFiltrado.empleado"
              :options="usuarios"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="consolidadoFiltrado.grupo !== null"
              use-input
              input-debounce="0"
              :error="!!v$.empleado.$errors.length"
              error-message="Debes seleccionar un empleado"
              @blur="v$.empleado.$touch"
              @filter="filtrarUsuarios"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Empleados Inactivos -->
          <div
            class="col-12 col-md-6"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
                consolidadoFiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
                consolidadoFiltrado.tipo_saldo ==
                  tipo_saldo.TRANSFERENCIA_SALDOS) &&
              is_inactivo
            "
          >
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="consolidadoFiltrado.empleado"
              :options="usuariosInactivos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.empleado.$errors.length"
              error-message="Debes seleccionar un empleado"
              @blur="v$.empleado.$touch"
              @filter="filtrarUsuariosInactivos"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
              <template v-slot:after>
                <q-btn color="positive" @click="recargarEmpleadosInactivos()">
                  <q-icon size="xs" class="q-mr-sm" name="bi-arrow-clockwise" />
                </q-btn>
              </template>
            </q-select>
          </div>

          <!-- Cliente -->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              [tipo_filtro.TODOS, tipo_filtro.CLIENTE].includes(
                consolidadoFiltrado.tipo_filtro
              ) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Empresa para la que se realizaron los gastos</label>
            <q-select
              v-model="consolidadoFiltrado.cliente_id"
              :options="clientes"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              hint="Seleccione la empresa para la que hizo el gasto."
              :disable="disabled"
              :error="!!v$.cliente_id.$errors.length"
              error-message="Debes seleccionar una empresa"
              use-input
              input-debounce="0"
              @blur="v$.cliente_id.$touch"
              @filter="filtrarClientes"
              :option-value="v => v.id"
              :option-label="v => v.razon_social"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="cliente_id" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Proyectos -->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.PROYECTO ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Proyectos</label>
            <q-select
              v-model="consolidadoFiltrado.id_proyecto"
              :options="proyectos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.id_proyecto.$errors.length"
              error-message="Debes seleccionar un proyecto"
              @blur="v$.id_proyecto.$touch"
              @filter="filtrarProyectos"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="id_proyecto" :v$="v$" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary"
                      >{{ scope.opt.codigo_proyecto }}
                    </q-item-label>
                    <q-item-label caption>{{ scope.opt.nombre }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Tareas -->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.TAREA ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              consolidadoFiltrado.proyecto >= 0 &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Tareas</label>
            <q-select
              v-model="consolidadoFiltrado.id_tarea"
              :options="tareas"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.id_tarea.$errors.length"
              error-message="Debes seleccionar una tarea"
              @blur="v$.id_tarea.$touch"
              @filter="filtrarTareas"
              :option-value="v => v.id"
              :option-label="v => v.titulo"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="id_tarea" :v$="v$" />
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary"
                      >{{ scope.opt.codigo_tarea }}
                    </q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Detalle -->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.DETALLE ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Detalle</label>
            <q-select
              v-model="consolidadoFiltrado.detalle"
              :options="detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.detalle.$errors.length"
              error-message="Debes seleccionar un detalle"
              @blur="v$.detalle.$touch"
              @filter="filtrarDetalles"
              :option-value="v => v.id"
              :option-label="v => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="detalle" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Ciudad -->
          <div
            class="col-12 col-md-6"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.CIUDAD ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Ciudad</label>
            <q-select
              v-model="consolidadoFiltrado.id_lugar"
              :options="cantones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.id_lugar.$errors.length"
              error-message="Debes seleccionar una ciudad"
              @blur="v$.id_lugar.$touch"
              @filter="filtrarCiudades"
              :option-value="v => v.id"
              :option-label="v => v.canton"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="id_lugar" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Subdetalle-->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.SUBDETALLE ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">SubDetalle</label>
            <q-select
              v-model="consolidadoFiltrado.subdetalle"
              :options="sub_detalles"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              multiple
              use-chips
              use-input
              input-debounce="0"
              :error="!!v$.subdetalle.$errors.length"
              error-message="Debes seleccionar un subdetalle"
              @blur="v$.subdetalle.$touch"
              @filter="filtroSubdetalles"
              :option-value="v => v.id"
              :option-label="v => v.descripcion"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="subdetalle" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!-- Autorizacion -->
          <div
            class="col-12 col-md-6"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.AUTORIZACIONES ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">Autorización Especial</label>
            <q-select
              v-model="consolidadoFiltrado.aut_especial"
              :options="autorizacionesEspeciales"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              :error="!!v$.aut_especial.$errors.length"
              error-message="Debes seleccionar un autorizador"
              @blur="v$.aut_especial.$touch"
              @filter="filtrarAutorizacionesEspeciales"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="aut_especial" :v$="v$" />
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <!--RUC-->
          <div
            class="col-12 col-md-6"
            v-if="
              (consolidadoFiltrado.tipo_filtro == tipo_filtro.RUC ||
                consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS) &&
              [
                tipo_saldo.GASTO,
                tipo_saldo.GASTOS_FOTOGRAFIA,
                tipo_saldo.FOTOGRAFIAS_OYM
              ].includes(consolidadoFiltrado.tipo_saldo)
            "
          >
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="consolidadoFiltrado.ruc"
              placeholder=""
              mask="#############"
              maxlength="13"
              autogrow
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Nodos -->
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="
              consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS &&
              tipo_saldo.FOTOGRAFIAS_OYM == consolidadoFiltrado.tipo_saldo
            "
          >
            <label class="q-mb-sm block">Nodo/s</label>
            <q-select
              v-model="consolidadoFiltrado.nodos"
              :options="nodos"
              options-dense
              dense
              outlined
              multiple
              use-chips
              use-input
              input-debounce="0"
              @filter="filtrarNodos"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>
          <div
            class="col-12 col-md-6 q-mt-lg"
            v-if="
              consolidadoFiltrado.tipo_saldo == tipo_saldo.ACREDITACIONES ||
              consolidadoFiltrado.tipo_saldo == tipo_saldo.CONSOLIDADO ||
              consolidadoFiltrado.tipo_saldo == tipo_saldo.ESTADO_CUENTA ||
              consolidadoFiltrado.tipo_saldo ==
                tipo_saldo.TRANSFERENCIA_SALDOS ||
              consolidadoFiltrado.tipo_filtro == tipo_filtro.EMPLEADO ||
              consolidadoFiltrado.tipo_filtro == tipo_filtro.TODOS
            "
          >
            <q-checkbox
              v-model="is_inactivo"
              color="secondary"
              label="Inactivo"
            ></q-checkbox>
          </div>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around" class="row q-col-gutter-xs">
        <div class="col-md-6">
          <q-btn
            color="positive"
            unelevated
            square
            class="full-width"
            @click="generar_reporte(consolidadoFiltrado, 'excel')"
          >
            <q-icon
              name="bi-file-earmark-excel-fill"
              size="xs"
              class="q-mr-sm"
            ></q-icon>
            Excel
          </q-btn>
        </div>
        <div class="col-md-6">
          <q-btn
            color="negative"
            class="full-width"
            unelevated
            square
            @click="generar_reporte(consolidadoFiltrado, 'pdf')"
          >
            <q-icon
              name="bi-file-earmark-pdf-fill"
              size="xs"
              class="q-mr-sm"
            ></q-icon>
            PDF
          </q-btn>
        </div>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ConsolidadoFiltradoPage.ts"></script>
