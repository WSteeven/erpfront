<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasBitacora"
    :mostrar-button-submits="tabsPage == 1"
    :mostrarColumnasVisibles="!$q.screen.xs"
    :accion1="btnRegistrarActividades"
    :accion2="btnFinalizarBitacora"
    :permitir-editar="false"
    :puede-filtrar="true"
    paginate
    full
  >
    <template #formulario>
      <multiple-page-layout
        :mixin="mixin"
        :tabsOptions="tabsOptions"
        regresar-principio
        :mostrarRegresar="false"
      >
        <template #tab1>
          <callout
            mensaje="La <b>selección de prendas recibidas</b> se activará luego de que <b>seleccione la zona</b>."
            tipo="info"
            class="q-mb-xl"
          ></callout>
          <q-form @submit.prevent>
            <div class="row q-col-gutter-sm q-mb-md">
              <div class="col-12 text-bold q-py-sm">
                <q-icon
                  name="bi-x-diamond"
                  class="q-mr-sm"
                  color="primary"
                ></q-icon>
                Información general
                <q-separator class="q-my-xs"></q-separator>
              </div>

              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Zona</label>
                <q-select
                  v-model="bitacora.zona"
                  :options="zonas"
                  :disable="disabled"
                  options-dense
                  dense
                  outlined
                  :input-debounce="0"
                  use-input
                  @filter="filtrarZonas"
                  @popup-show="ordenarLista(zonas, 'nombre')"
                  @update:model-value="consultarPrendasPermitidas()"
                  :option-value="v => v.id"
                  :option-label="v => v.nombre"
                  :error="!!v$.zona.$errors.length"
                  @blur="v$.zona.$touch"
                  emit-value
                  map-options
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay resultados
                      </q-item-section>
                    </q-item>
                  </template>

                  <template #after>
                    <q-btn color="primary" @click="recargarZonas()" dense>
                      <q-icon :name="iconos.recargar" class="q-pad-xs"></q-icon>
                      <q-tooltip>Recargar zonas</q-tooltip>
                    </q-btn>
                  </template>

                  <template v-slot:error>
                    <div v-for="error of v$.zona.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Jornada</label>
                <q-select
                  v-model="bitacora.jornada"
                  :options="jornadas"
                  :disable="disabled"
                  :error="!!v$.jornada.$errors.length"
                  @blur="v$.jornada.$touch"
                  options-dense
                  outlined
                  dense
                >
                  <template v-slot:error>
                    <div v-for="error of v$.jornada.$errors" :key="error.$uid">
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-select>
              </div>

              <div v-if="accion === acciones.consultar" class="col-12 col-md-3">
                <fecha-hora-automatica-input
                  v-model="bitacora.fecha_hora_inicio_turno"
                  :disable="disabled"
                  label="Fecha y hora de inicio de turno"
                  :validador="v$"
                  clave="fecha_hora_inicio_turno"
                ></fecha-hora-automatica-input>
              </div>

              <div v-if="accion === acciones.consultar" class="col-12 col-md-3">
                <label class="q-mb-sm block"
                  >Fecha y hora de fin de turno</label
                >
                <q-input
                  v-model="bitacora.fecha_hora_fin_turno"
                  hint="Se calcula automáticamente al finalizar la bitácora"
                  disable
                  outlined
                  dense
                ></q-input>
              </div>

              <div v-if="accion === acciones.consultar" class="col-12 col-md-3">
                <label class="q-mb-sm block">Agente de turno</label>
                <q-input
                  v-model="criterioBusqueda"
                  placeholder="Escriba y presione enter para buscar"
                  hint="Puede buscar por nombre, apellido o identificación"
                  disable
                  @keydown.enter="listar"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon
                      :name="
                        bitacora.agente_turno
                          ? 'bi-check-circle-fill'
                          : 'bi-check-circle'
                      "
                      :color="bitacora.agente_turno ? 'positive' : 'grey-6'"
                      size="xs"
                    ></q-icon>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Protector</label>
                <q-input
                  v-model="criterioBusquedaProtector"
                  placeholder="Escriba y presione enter para buscar"
                  hint="Puede buscar por nombre, apellido o identificación"
                  :disable="disabled"
                  @keydown.enter="listarProtector"
                  :error="!!v$.protector.$errors.length"
                  @blur="v$.protector.$touch"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon
                      :name="
                        bitacora.protector
                          ? 'bi-check-circle-fill'
                          : 'bi-check-circle'
                      "
                      :color="bitacora.protector ? 'positive' : 'grey-6'"
                      size="xs"
                    ></q-icon>
                  </template>

                  <template #after>
                    <q-btn color="primary" @click="listarProtector" dense>
                      <q-icon :name="iconos.buscar"></q-icon>
                      <q-tooltip>Recargar protector</q-tooltip>
                    </q-btn>
                  </template>

                  <template v-slot:error>
                    <div
                      v-for="error of v$.protector.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-3">
                <label class="q-mb-sm block">Conductor</label>
                <q-input
                  v-model="criterioBusquedaConductor"
                  placeholder="Escriba y presione enter para buscar"
                  hint="Puede buscar por nombre, apellido o identificación"
                  :disable="disabled"
                  @keydown.enter="listarConductor"
                  :error="!!v$.conductor.$errors.length"
                  @blur="v$.conductor.$touch"
                  outlined
                  dense
                >
                  <template v-slot:append>
                    <q-icon
                      :name="
                        bitacora.conductor
                          ? 'bi-check-circle-fill'
                          : 'bi-check-circle'
                      "
                      :color="bitacora.conductor ? 'positive' : 'grey-6'"
                      size="xs"
                    ></q-icon>
                  </template>

                  <template #after>
                    <q-btn color="primary" @click="listarConductor" dense>
                      <q-icon :name="iconos.buscar"></q-icon>
                      <q-tooltip>Recargar protector</q-tooltip>
                    </q-btn>
                  </template>

                  <template v-slot:error>
                    <div
                      v-for="error of v$.conductor.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-mb-md">
              <div class="col-12 text-bold q-py-sm">
                <q-icon
                  name="bi-x-diamond"
                  class="q-mr-sm"
                  color="primary"
                ></q-icon>
                <span class="inline-block q-mr-sm q-mb-sm"
                  >Selección de prendas recibidas</span
                >
                <q-btn
                  v-if="bitacora.zona && accion === acciones.nuevo"
                  color="positive"
                  :icon="iconos.recargar"
                  @click="consultarPrendasPermitidas()"
                  unelevated
                  dense
                  rounded
                  no-caps
                  label="Recargar prendas asignadas"
                  class="q-px-sm"
                >
                </q-btn>
                <q-separator class="q-my-xs"></q-separator>
              </div>

              <span v-if="!prendas.length" class="bg-body q-pa-md rounded"
                >Seleccione una zona para mostrar el listado de prendas.</span
              >

              <div
                v-for="prenda in prendas"
                :key="prenda.id"
                class="col-12 col-md-3 q-mb-md"
              >
                <q-checkbox
                  v-model="bitacora.prendas_recibidas"
                  :label="prenda.descripcion"
                  :val="prenda.id"
                  :disable="disabled"
                ></q-checkbox>
              </div>

              <div class="col-12 q-pt-md">
                <voice-input
                  v-model="bitacora.observaciones"
                  :v$="v$"
                  key-error="observaciones"
                  label="Observaciones o Novedades acerca de las prendas recibidas"
                  :disable="disabled"
                  placeholder="Opcional"
                ></voice-input>
              </div>

              <div
                v-if="bitacora.revisado_por_supervisor"
                class="col-12 q-mt-lg"
              >
                <q-separator class="q-my-md" />
                <div class="text-bold q-mb-sm">
                  <q-icon
                    name="bi-chat-square-quote"
                    class="q-mr-sm"
                    color="teal"
                  />
                  Retroalimentación del supervisor
                </div>

                <q-input
                  v-model="bitacora.retroalimentacion_supervisor"
                  type="textarea"
                  outlined
                  autogrow
                  dense
                  disable
                />
              </div>
            </div>
          </q-form>
        </template>

        <template #tab2>
          <div v-if="bitacora.id" class="row">
            <div class="col-12 q-mb-sm">
              <callout
                tipo="info"
                mensaje="Las actividades registradas <b>se guardan automáticamente</b>."
              ></callout>
            </div>

            <div class="col-12 q-mb-md">
              <callout
                v-if="!!bitacora.fecha_hora_fin_turno"
                mensaje="<b>Ya no tiene permitido registrar actividades</b> debido a que la <b>bitácora ha sido finalizada</b>."
              ></callout>
            </div>

            <div class="col-12 text-bold q-py-sm q-my-sm">
              <q-icon
                name="bi-x-diamond"
                class="q-mr-sm"
                color="primary"
              ></q-icon>
              Registro de actividades
            </div>

            <div class="col-12">
              <essential-table
                ref="refActividades"
                titulo="Actividades"
                :configuracionColumnas="ccActividadBitacora"
                :datos="listadoActividadBitacora"
                ajustar-celdas
                :alto-fijo="false"
                :accion1Header="btnAgregarActividad"
                :accion1="btnVerActividadBitacora"
                :accion2="btnConfirmarNotificado"
                :accion3="btnEstablecerHoraFin"
                :permitir-consultar="false"
                :permitir-editar="false"
                :permitir-eliminar="false"
                :mostrar-footer="false"
                permitirEditarModal
                :editar-fila-local="false"
                permitir-editar-celdas
                :mostrarColumnasVisibles="!$q.screen.xs"
                @guardar-fila-nueva="guardarActividad"
              ></essential-table>
            </div>
          </div>

          <div v-else class="column">
            <callout
              tipo="info"
              mensaje="Primero <b>cree una bitácora</b> para poder <b>registrar actividades</b>."
              class="q-mb-md"
            ></callout>
            <q-btn
              color="primary"
              label="Ir a formulario para crear bitácora"
              icon="bi-list"
              @click="tabsPage = '1'"
              no-caps
              unelevated
            ></q-btn>
          </div>
        </template>
      </multiple-page-layout>
    </template>

    <template #custom-buttons>
      <q-btn
        v-if="
          bitacora.id &&
          accion === acciones.consultar &&
          bitacora.fecha_hora_fin_turno &&
          !bitacora.revisado_por_supervisor &&
          esSupervisor
        "
        color="green"
        icon="bi-check"
        label="Marcar Bitácora como revisada"
        @click="marcarRevisadoDesdeTabla"
        no-caps
        unelevated
      />
    </template>

    <template #modales>
      <essential-selectable-table
        ref="refListadoSeleccionable"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listado"
        @selected="seleccionar"
        tipo-seleccion="single"
      ></essential-selectable-table>

      <essential-selectable-table
        ref="refListadoSeleccionableProtector"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listadoProtector"
        @selected="seleccionarProtector"
        tipo-seleccion="single"
      ></essential-selectable-table>

      <essential-selectable-table
        ref="refListadoSeleccionableConductor"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listadoConductor"
        @selected="seleccionarConductor"
        tipo-seleccion="single"
      ></essential-selectable-table>

      <solicitar-archivo
        :mostrar="mostrarSolicitarArchivoActividad"
        @cerrar="mostrarSolicitarArchivoActividad = false"
        :mixin="mixin"
        tipo-archivo="ADJUNTO"
      ></solicitar-archivo>

      <modales-entidad
        :comportamiento="modales"
        :mixin-modal="mixin"
        :persistent="false"
      />
      <!-- @guardado="listar" -->
    </template>
  </tab-layout>
</template>

<script src="./BitacoraPage.ts"></script>
