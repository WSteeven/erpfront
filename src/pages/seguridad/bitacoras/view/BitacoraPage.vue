<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasBitacora"
    :mostrar-button-submits="tabsPage == 1"
    :accion1="btnRegistrarActividades"
    :accion2="btnFinalizarBitacora"
    :permitir-editar="false"
    paginate
    full
  >
    <template #formulario>
      <multiple-page-layout :mixin="mixin" regresar-principio>
        <template #tab1>
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
                  transition-show="jump-up"
                  transition-hide="jump-down"
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
                    <q-btn
                      color="positive"
                      :icon="iconos.recargar"
                      @click="recargarZonas()"
                      unelevated
                      dense
                    >
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

              <div class="col-12 col-md-3">
                <fecha-hora-automatica-input
                  v-model="bitacora.fecha_hora_inicio_turno"
                  :disable="disabled"
                  label="Fecha y hora de inicio de turno"
                  :validador="v$"
                  clave="fecha_hora_inicio_turno"
                ></fecha-hora-automatica-input>
              </div>

              <div class="col-12 col-md-3">
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

              <div class="col-12 col-md-3">
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
                Selección de prendas recibidas
                <q-separator class="q-my-xs"></q-separator>
              </div>

              <i v-if="!listadosAuxiliares.prendas.length"
                >Seleccione una zona para mostrar el listado de prendas.</i
              >

              <div
                v-for="prenda in listadosAuxiliares.prendas"
                :key="prenda.id"
                class="col-6 col-md-3"
              >
                <q-checkbox
                  v-model="bitacora.prendas_recibidas"
                  :label="prenda.descripcion"
                  :val="prenda.id"
                  :disable="disabled"
                ></q-checkbox>
              </div>

              <div class="col-12 q-pt-xl">
                <voice-input
                  v-model="bitacora.observaciones"
                  :v$="v$"
                  key-error="observaciones"
                  label="Observaciones o Novedades acerca de las prendas recibidas"
                  :disable="disabled"
                  placeholder="Opcional"
                ></voice-input>
              </div>
            </div>
          </q-form>
        </template>

        <template #tab2>
          <div class="row">
            <div class="col-12 q-mb-sm">
              <callout
                tipo="info"
                mensaje="Las actividades registradas se guardan automáticamente."
              ></callout>
            </div>

            <div class="col-12">
              <callout
                v-if="!!bitacora.fecha_hora_fin_turno"
                mensaje="Ya no tiene permitido registrar actividades debido a que la bitácora ha sido finalizada."
              ></callout>
            </div>

            <div class="col-12 text-pdrimary text-bold q-py-sm q-my-sm">
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
                permitirEditarModal
                :editar-fila-local="false"
                permitir-editar-celdas
                @guardar-fila-nueva="guardarActividad"
              ></essential-table>
            </div>
          </div>
        </template>
      </multiple-page-layout>
    </template>

    <template #custom-buttons>
      <q-btn
        v-if="tabsPage == 1 && bitacora.id"
        color="teal"
        label="Registrar actividades"
        icon="bi-list"
        @click="
          () => {
            listarActividadBitacora({ bitacora_id: bitacora.id })
            tabsPage = '2'
          }
        "
        no-caps
        push
      ></q-btn>
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
