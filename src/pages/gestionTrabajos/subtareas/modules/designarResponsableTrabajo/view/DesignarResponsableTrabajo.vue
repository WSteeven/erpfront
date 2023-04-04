<template>
  <div class="row q-col-gutter-xs q-pa-md q-mb-md">
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Trabajo designado</label>
      <q-btn-toggle
        v-model="subtarea.modo_asignacion_trabajo"
        class="toggle-button"
        :disable="disable"
        spread
        no-caps
        rounded
        glossy
        toggle-color="positive"
        unelevated
        :options="[
          {
            label: 'Para un grupo',
            value: modosAsignacionTrabajo.por_grupo,
          },
          {
            label: 'Para un empleado',
            value: modosAsignacionTrabajo.por_empleado,
          },
        ]"
      />
    </div>

    <div
      v-if="
        subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo
      "
      class="col-12 col-md-3"
    >
      <label class="q-mb-sm block">Grupo seleccionado</label>
      <q-select
        v-model="subtarea.grupo"
        :options="grupos"
        @filter="filtrarGrupos"
        transition-show="scale"
        transition-hide="scale"
        hint="Obligatorio"
        options-dense
        dense
        outlined
        :option-label="(item) => item.nombre"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        :disable="disable"
        :error="!!validate$.grupo.$errors.length"
        @blur="validate$.grupo.$touch"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of validate$.grupo.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>

    <div
      v-if="
        subtarea.modo_asignacion_trabajo === modosAsignacionTrabajo.por_empleado
      "
      class="col-12 col-md-3"
    >
      <label class="q-mb-sm block">Empleado seleccionado</label>
      <q-select
        v-model="subtarea.empleado"
        :options="empleados"
        @filter="filtrarEmpleados"
        transition-show="scale"
        transition-hide="scale"
        hint="Obligatorio"
        options-dense
        dense
        outlined
        :option-label="(item) => item.nombres + ' ' + item.apellidos"
        :option-value="(item) => item.id"
        use-input
        input-debounce="0"
        emit-value
        map-options
        :disable="disable"
        :error="!!validate$.empleado.$errors.length"
        @blur="validate$.empleado.$touch"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No hay resultados
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:error>
          <div v-for="error of validate$.empleado.$errors" :key="error.$uid">
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-select>
    </div>

    <!-- Es dependiente -->
    <div v-if="subtarea.grupo" class="col-12 col-md-3">
      <br />
      <q-checkbox
        v-model="subtarea.mas_empleados"
        label="Quiero agregar más empleados"
        outlined
        :disable="disable"
        dense
      ></q-checkbox>
    </div>

    <div
      v-if="subtarea.mas_empleados"
      class="col-12 row q-col-gutter-xs q-mb-md"
    >
      <div class="col-12 col-md-10">
        <q-input
          v-model="criterioBusquedaEmpleadosGrupo"
          placeholder="Nombres / Apellidos / Identificación"
          hint="Ingrese los datos del empleado y presione Enter para buscar"
          @keydown.enter="listarEmpleadosGrupo()"
          @blur="
            criterioBusquedaEmpleadosGrupo === '' ? limpiarTecnico() : null
          "
          :disable="disable"
          clearable
          outlined
          dense
        >
        </q-input>
      </div>

      <div class="col-12 col-md-2">
        <q-btn
          color="positive"
          class="full-width"
          :disable="disable"
          no-caps
          push
          @click="listarEmpleadosGrupo()"
        >
          <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>Buscar
          empleado
        </q-btn>
      </div>
    </div>

    <div class="col-12">
      <essential-table
        v-if="
          subtarea.modo_asignacion_trabajo ===
            modosAsignacionTrabajo.por_grupo && empleadosGrupo.length
        "
        ref="refEmpleadosGrupo"
        titulo="Empleados del grupo seleccionado"
        estilos="margin-bottom: 14px;"
        :configuracionColumnas="columnasEmpleado"
        :datos="empleadosGrupo"
        :accion1Header="btnCambiarResponsable"
        :accion2Header="btnConfirmarDesignarResponsable"
        :accion3Header="btnCancelarDesignacionResponsable"
        :accion1="quitarEmpleado"
        :mostrarBotones="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :alto-fijo="false"
        :mostrar-header="true"
        :permitir-buscar="false"
        :tipo-seleccion="tipoSeleccion"
        :mostrar-footer="!empleadosGrupo.length"
        @selected="entidadSeleccionadaResponsable"
      >
      </essential-table>
    </div>

    <!-- <div class="col-12">
      <essential-table
        v-if="
          subtarea.modo_asignacion_trabajo ===
            modosAsignacionTrabajo.por_grupo && empleadosAdicionales.length
        "
        ref="refEmpleadosGrupo"
        titulo="Empleados adicionales"
        estilos="margin-bottom: 14px;"
        :configuracionColumnas="columnasEmpleado"
        :datos="empleadosAdicionales"
        :accion1="quitarEmpleadoAdicional"
        :mostrarBotones="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :alto-fijo="false"
        :mostrar-header="true"
        :permitir-buscar="false"
        :mostrar-footer="!empleadosAdicionales.length"
      >
      </essential-table>
    </div> -->
  </div>

  <essential-selectable-table
    ref="refListadoSeleccionableEmpleadosGrupo"
    :configuracion-columnas="configuracionColumnasEmpleadoGrupo"
    :datos="listadoEmpleadosGrupo"
    tipo-seleccion="multiple"
    @selected="seleccionarEmpleadosGrupo"
  ></essential-selectable-table>
</template>

<script src="./DesignarResponsableTrabajo.ts"></script>
