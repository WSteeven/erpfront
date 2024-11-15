<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Planificador"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrar"
    ajustar-celdas
    :accion1="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Jefe -->
          <div class="col-12 col-md-4 q-mb-md col-sm-6">
            <label class="q-mb-sm block">Realizado Por</label>
            <q-select
              v-model="planificador.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              disable
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un jefe"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
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
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Nombre Planificación</label>
            <q-input
              v-model="planificador.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Porcentaje cumplimiento -->
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Porcentaje Cumplimiento</label>
            <q-input
              v-model="planificador.completado"
              placeholder="Obligatorio"
              disable
              dense outlined
            />
          </div>
          <!--          BOTON DE AGREGAR ACTIVIDAD-->
          <div class="col-12 text-center q-pb-md">
            <q-btn
              color="primary"
              class="full-width"
              no-caps
              no-wrap
              :disable="disabled"
              push
              glossy
              @click="agregarActividad"
            >
              <q-icon name="bi-plus" size="xs" class="q-pr-sm" />
              <span>Agregar Actividad</span></q-btn
            >
          </div>
        </div>


        <!--          TABLAS DE ACTIVIDADES-->
        <q-expansion-item
          v-for="(actividad, index) of planificador.actividades"
          :key="actividad.id"
          class="overflow-hidden q-mb-md expansion"
          :label="actividad.nombre"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <template v-slot:header="scope">
            <div class="row full-width q-col-gutter-sm">
              <div class="col-6">
              <p class="q-pt-sm">{{index+1}}. {{ actividad.nombre }}</p>
              </div>
              <div class="col-5">
                Completado {{actividad.completado}}%
              </div>
              <div class="q-pl-md" v-if="scope.expanded">
                <q-btn
                  outline
                  dense
                  :disable="disabled"
                  @click="editarNombreActividad(actividad)"
                  color="secondary"
                >
                  <q-tooltip class="bg-dark">Editar</q-tooltip>
                  <q-icon class="bi-pencil-square" size="xs" />
                </q-btn>
              </div>
              <div  v-if="scope.expanded">
                <q-btn
                  outline
                  dense
                  class="q-pl-sm"
                  :disable="disabled"
                  @click="eliminarActividad(index)"
                  color="negative"
                >
                  <q-tooltip class="bg-dark">Eliminar</q-tooltip>
                  <q-icon class="bi-trash" size="xs" />
                </q-btn>
              </div>
            </div>
          </template>
          <div class="col-12">
            <essential-table
              :identificador="index"
              :datos="actividad.subactividades"
              :configuracion-columnas="[acciones.nuevo, acciones.editar].includes(accion) ?[
                ...configuracionColumnasSubactividades,
                accionesTabla
              ]: configuracionColumnasSubactividades"
              ajustar-celdas
              :disable="disabled"
              :permitirConsultar="false"
              :permitirEditarCeldas="true"
              :permitirEditar="false"
              :permitirEliminar="false"
              :altoFijo="false"
              :accion1Header="btnAgregarSubactividad"
              :accion1="btnEliminar"
              :mostrarFooter="false"
              @fila-modificada="(fila)=>calcularPorcentajeCompletado(fila, actividad)"
            >
<!--              @input-val="(val)=>filtrarEmpleados"-->
            </essential-table>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./PlanificadorPage.ts"></script>
