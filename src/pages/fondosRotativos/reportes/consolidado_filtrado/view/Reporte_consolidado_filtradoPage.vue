<template>
  <q-page class="flex flex-center">
    <q-card flat bordered class="my-card bg-grey-1  ">
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
          <q-input v-model="consolidadofiltrado.fecha_inicio" placeholder="Obligatorio"
            :error="!!v$.fecha_inicio.$errors.length" :disable="disabled" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="consolidadofiltrado.fecha_inicio" mask="DD-MM-YYYY" today-btn>
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
          <q-input v-model="consolidadofiltrado.fecha_fin" placeholder="Obligatorio"
            :error="!!v$.fecha_fin.$errors.length" :disable="disabled" outlined dense>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="consolidadofiltrado.fecha_fin" mask="DD-MM-YYYY" today-btn>
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
        <!-- Tipos reportes -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo Saldo</label>
          <q-select v-model="consolidadofiltrado.tipo_saldo" :options="tipos_saldos" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.tipo_saldo.$errors.length" error-message="Debes seleccionar un tipo de saldo" use-input
            input-debounce="0" @filter="filtarTiposSaldos" :option-value="(v) => v.value" :option-label="(v) => v.label"
            emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.tipo_saldo.$errors" :key="error.$uid">
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
        <!-- Tipos filtros -->
          <div class="col-12 col-md-3" >
          <label class="q-mb-sm block">Tipo Filtro</label>
          <q-select v-model="consolidadofiltrado.tipo_filtro" :options="tipos_filtros" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.tipo_filtro.$errors.length" error-message="Debes seleccionar un tipo de saldo" use-input
            input-debounce="0" @filter="filtrarTiposFiltro" :option-value="(v) => v.value" :option-label="(v) => v.name"
            emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.tipo_filtro.$errors" :key="error.$uid">
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
        <!-- Usuarios -->
        <div class="col-12 col-md-3" v-if="consolidadofiltrado.tipo_filtro == 6 || consolidadofiltrado.tipo_filtro == 0">
          <label class="q-mb-sm block">Usuario</label>
          <q-select v-model="consolidadofiltrado.usuario" :options="usuarios" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.usuario.$errors.length" error-message="Debes seleccionar un usuario" use-input input-debounce="0"
            @filter="filtrarUsuarios" :option-value="(v) => v.usuario_id"
            :option-label="(v) => v.nombres + ' ' + v.apellidos" emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.usuario.$errors" :key="error.$uid">
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
        <!-- Proyectos -->
        <div class="col-12 col-md-4 q-mb-md"
          v-if="(consolidadofiltrado.tipo_filtro == 1 || consolidadofiltrado.tipo_filtro == 0) && consolidadofiltrado.tipo_saldo == 2">
          <label class="q-mb-sm block">Proyectos</label>
          <q-select v-model="consolidadofiltrado.proyecto" :options="proyectos" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.proyecto.$errors.length" error-message="Debes seleccionar un canton" use-input input-debounce="0"
            @filter="filtrarProyectos" :option-value="(v) => v.id" :option-label="(v) => v.nombre" emit-value map-options>
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
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Tareas -->
        <div class="col-12 col-md-4 q-mb-md"
          v-if="(consolidadofiltrado.tipo_filtro == 2 || consolidadofiltrado.tipo_filtro == 0) && consolidadofiltrado.proyecto >= 0  && consolidadofiltrado.tipo_saldo == 2">
          <label class="q-mb-sm block">Tareas</label>
          <q-select v-model="consolidadofiltrado.tarea" :options="tareas" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.tarea.$errors.length" error-message="Debes seleccionar una Tarea" use-input input-debounce="0"
            @filter="filtrarTareas" :option-value="(v) => v.id" :option-label="(v) => v.titulo" emit-value map-options>
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
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <!-- Detalle -->
        <div class="col-12 col-md-3 q-mb-md"
          v-if="(consolidadofiltrado.tipo_filtro == 3 || consolidadofiltrado.tipo_filtro == 0)&& consolidadofiltrado.tipo_saldo == 2">
          <label class="q-mb-sm block">Detalle</label>
          <q-select v-model="consolidadofiltrado.detalle" :options="detalles" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.detalle.$errors.length" error-message="Debes seleccionar un canton" use-input input-debounce="0"
            @filter="filtrarDetalles" :option-value="(v) => v.id" :option-label="(v) => v.descripcion" emit-value
            map-options>
            <template v-slot:error>
              <div v-for="error of v$.detalle.$errors" :key="error.$uid">
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
        <!-- Subdetalle-->
        <div class="col-12 col-md-4 q-mb-md"
          v-if="(consolidadofiltrado.tipo_filtro == 4 || consolidadofiltrado.tipo_filtro == 0)&& consolidadofiltrado.tipo_saldo == 2">
          <label class="q-mb-sm block">SubDetalle</label>
          <q-select v-model="consolidadofiltrado.subdetalle" :options="subdetalles" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.subdetalle.$errors.length" error-message="Debes seleccionar un canton" use-input
            input-debounce="0" @filter="filtarSubdetalles" :option-value="(v) => v.id"
            :option-label="(v) => v.descripcion" emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.subdetalle.$errors" :key="error.$uid">
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
        <!-- Autorizacion -->
        <div class="col-12 col-md-3" v-if="consolidadofiltrado.tipo_filtro == 5 || consolidadofiltrado.tipo_filtro == 0">
          <label class="q-mb-sm block">Autorizaciòn Especial</label>
          <q-select v-model="consolidadofiltrado.autorizador" :options="autorizacionesEspeciales" transition-show="jump-up"
            transition-hide="jump-down" options-dense dense outlined :disable="disabled" :readonly="disabled"
            :error="!!v$.autorizador.$errors.length" error-message="Debes seleccionar un canton" use-input
            input-debounce="0" @filter="filtrarAutorizacionesEspeciales" :option-value="(v) => v.id"
            :option-label="(v) => v.usuario" emit-value map-options>
            <template v-slot:error>
              <div v-for="error of v$.autorizador.$errors" :key="error.$uid">
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
      </q-card-section>

      <q-separator></q-separator>

      <q-card-actions align="around">
        <q-btn color="positive" @click="generar_reporte(consolidadofiltrado, 'excel')"> <q-icon
            name="bi-file-earmark-excel-fill" size="xs" class="q-mr-sm"></q-icon>Excel</q-btn>
        <q-btn color="negative" @click="generar_reporte(consolidadofiltrado, 'pdf')"> <q-icon
            name="bi-file-earmark-pdf-fill" size="xs" class="q-mr-sm"></q-icon>PDF</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
<script src="./ConsolidadoFiltradoPage.ts"></script>
