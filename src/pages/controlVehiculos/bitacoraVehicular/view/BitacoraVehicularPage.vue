<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control diario de vehículos"
    ajustarCeldas
    :tab-options="tabOptionsBitacoras"
    :tabDefecto="tabDefecto"
    :permitirEditar="puedeEditar"
    :filtrar="filtrarBitacoras"
    :accion1="btnMarcarFinalizada"
    :accion2="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-select
              v-model="bitacora.vehiculo"
              :options="vehiculos"
              :error="!!v$.vehiculo.$errors.length"
              :disable="disabled"
              options-dense
              outlined
              dense
              @filter="filtrarVehiculos"
              @update:model-value="vehiculoSeleccionado"
              use-input
              input-debounce="0"
              :option-value="(v) => v.id"
              :option-label="(v) => v.placa"
              emit-value
              map-options
            >
            <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.marca }}:
                      {{ scope.opt.modelo }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template></q-select>
          </div>
          <!-- Chofer -->
          <div
            class="col-12 col-md-3 q-mb-md"
            v-if="accion == acciones.nuevo || bitacora.chofer"
          >
            <label class="q-mb-sm block">Chofer</label>
            <q-input
              v-model="bitacora.chofer"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Fecha de registro -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="bitacora.fecha"
              placeholder="Obligatorio"
              :error="!!v$.fecha.$errors.length"
              :disable="disabled"
              mask="####-##-##"
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
                      v-model="bitacora.fecha"
                      :mask="maskFecha"
                      :options="optionsFecha"
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
                <div
                  style="clear: inherit"
                  v-for="error of v$.fecha.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de inicio -->
          <div class="col-3 col-md-3">
            <label class="q-mb-sm block">Hora inicio labores vehículo</label>
            <q-input
              v-model="bitacora.hora_salida"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.hora_salida.$errors.length"
              type="time"
              outlined
              clearable
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_salida.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Hora de llegada -->
          <div class="col-3 col-md-3">
            <label class="q-mb-sm block">Hora fin labores vehículo</label>
            <q-input
              v-model="bitacora.hora_llegada"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.hora_llegada.$errors.length"
              type="time"
              outlined
              clearable
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.hora_llegada.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- km inicial -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Km inicial</label>
            <q-input
              type="number"
              v-model="bitacora.km_inicial"
              placeholder="Obligatorio"
              :disable="disabled || bloquear_km_tanque"
              :readonly="disabled"
              :error="!!v$.km_inicial.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_inicial.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Fotografía
              <i class="bi bi-info-circle" />
              <q-tooltip
                >Fotografía del inicio del día donde se muestre el kilometraje y combustible al inicio del día </q-tooltip
              >
            </label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="bitacora.imagen_inicial"
              :comprimir="true"
              :disable="disabled"
              :error="!!v$.imagen_inicial.$errors.length"
              :alto="'200px'"
              @update:model-value="(data) => (bitacora.imagen_inicial = data)"
            ></selector-imagen>
          </div>
          <!-- km final -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Km final</label>
            <q-input
              type="number"
              v-model="bitacora.km_final"
              placeholder="Obligatorio"
              :disable="disabled"
              :readonly="disabled"
              :error="!!v$.km_final.$errors.length"
              @blur="v$.km_final.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.km_final.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Tanque inicio -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Tanque inicio</label>
            <q-input
              v-if="!$q.screen.xs"
              v-model="bitacora.tanque_inicio"
              type="number"
              :disable="disabled || bloquear_km_tanque"
              mask="###"
              :error="!!v$.tanque_inicio.$errors.length"
              dense
              outlined
              ><template v-slot:error>Ingresa un valor entre 0 y 100</template>
              <template v-slot:prepend
                ><q-icon name="bi-fuel-pump-fill"></q-icon
              ></template>
              <template v-slot:append
                ><q-icon
                  name="bi-percent"
                  size="xs"
                  color="black"
                ></q-icon></template
            ></q-input>
            <q-knob
              v-if="$q.platform.is.android || $q.screen.xs"
              show-value
              class="text-white q-ma-md"
              v-model="bitacora.tanque_inicio"
              size="90px"
              :disable="disabled || bloquear_km_tanque"
              :thickness="0.2"
              :color="bitacora.tanque_inicio > 50 ? 'green-5' : 'red-5'"
              :center-color="
                bitacora.tanque_inicio > 50 ? 'positive' : 'negative'
              "
              track-color="transparent"
              instant-feedback
            >
              <template v-slot:default>
                <!-- <q-icon name="bi-fuel-pump-fill"/> -->
                {{ bitacora.tanque_inicio }}%
              </template>
            </q-knob>
          </div>

          <!-- Tanque final -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Tanque final</label>
            <q-input
              v-if="!$q.screen.xs"
              ref="tFinal"
              type="number"
              v-model="bitacora.tanque_final"
              :disable="disabled"
              mask="###"
              :error="!!v$.tanque_final.$errors.length"
              @blur="v$.tanque_final.$touch"
              dense
              outlined
            >
              <template v-slot:error>Ingresa un valor entre 25 y 100</template>
              <template v-slot:prepend
                ><q-icon name="bi-fuel-pump-fill"></q-icon
              ></template>
              <template v-slot:append
                ><q-icon name="bi-percent" size="xs" color="black"></q-icon
              ></template>
            </q-input>
            <q-knob
              v-if="$q.platform.is.android || $q.screen.xs"
              show-value
              class="text-white q-ma-md"
              v-model="bitacora.tanque_final"
              size="90px"
              :thickness="0.2"
              :color="bitacora.tanque_final > 50 ? 'green-5' : 'red-5'"
              :center-color="
                bitacora.tanque_final > 50 ? 'positive' : 'negative'
              "
              track-color="transparent"
              instant-feedback
              >{{ bitacora.tanque_final }}%</q-knob
            >
          </div>

          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="accion == acciones.editar || accion == acciones.consultar">
            <label class="q-mb-sm block">Tareas</label>
            <q-select
              v-model="bitacora.tareas"
              :options="tareas"
              :disable="disabled"
              options-dense
              clearable
              dense
              outlined
              use-input
              use-chips
              input-debounce="0"
              @filter="filtrarTareas"
              multiple
              :option-label="(item) => item.codigo_tarea"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo_tarea }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.titulo }}</q-item-label>
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
          <!-- Tickets -->
          <div class="col-12 col-md-3" v-if="accion == acciones.editar || accion == acciones.consultar">
            <label class="q-mb-sm block">Tickets</label>
            <q-select
              v-model="bitacora.tickets"
              :options="tickets"
              options-dense
              :disable="disabled"
              clearable
              dense
              outlined
              use-input
              use-chips
              input-debounce="0"
              @filter="filtrarTickets"
              multiple
              :option-label="(item) => item.codigo"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.codigo }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.asunto }}</q-item-label>
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
        </div>

        <!-- Marcar como finalizada (firmada) -->
        <div
          class="col-12 col-md-3 q-mb-xl"
          v-if="accion === acciones.editar || bitacora.firmada"
        >
          <q-checkbox
            class="q-mt-lg q-pt-md"
            v-model="bitacora.firmada"
            label="¿Marcar como finalizada?"
            :disable="disabled"
            outlined
            dense
          ></q-checkbox>
          <!-- @update:model-value="checkFinalizada" -->
        </div>

        <!-- Actividades realizadas -->
        <q-expansion-item
          v-if="accion == acciones.editar || accion == acciones.consultar"
          class="overflow-hidden q-mb-md expansion"
          label="Actividades Realizadas"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12">
              <essential-popup-editable-table
                titulo="Actividades realizadas"
                :configuracionColumnas="
                  accion === acciones.editar
                    ? [...columnasActividades, accionesTabla]
                    : columnasActividades
                "
                :datos="bitacora.actividadesRealizadas"
                :permitirConsultar="false"
                :permitirEditarCeldas="
                  accion == acciones.nuevo || accion == acciones.editar
                "
                :permitirEditarModal="true"
                :permitirEditar="$q.screen.xs"
                :permitirEliminar="false"
                :altoFijo="false"
                :accion1Header="btnAgregarActividad"
                :accion1="btnEliminar"
              ></essential-popup-editable-table>
            </div>
          </div>
        </q-expansion-item>
        <!-- Checklist del vehículo -->
        <q-expansion-item
          v-if="accion == acciones.editar || accion == acciones.consultar"
          class="overflow-hidden q-mb-md expansion"
          label="Checklist del Vehículo"
          header-class="text-bold bg-header-collapse"
          default-opened
          group="checklist"
        >
          <div
            class="col-12 col-md-12 rounded-card q-ma-sm q-py-sm text-center bg-light-blue-2"
          >
            <div>
              <q-icon
                name="bi-info-circle-fill"
                class="q-mr-xs q-ml-xs"
                size="1em"
              /><b> Información </b>Las opciones se marcan con colores:
            </div>
            <div>
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                color="green"
                disable
                val="1"
                label="OK"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                color="orange"
                disable
                val="1"
                label="Puede requerir atención"
              />
              <q-radio
                v-model="accepted"
                checked-icon="bi-check-circle-fill"
                color="red"
                disable
                val="1"
                label="Requiere atención inmediata"
              />
            </div>
          </div>
          <div class="col-12 col-md-12 q-ma-sm">
            <q-expansion-item
              class="overflow-hidden q-mb-md expansion"
              label="1. Interior"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <!-- parabrisas -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block"
                    >Parabrisas/ Vidrios Ventanas</label
                  >
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.parabrisas"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- limpiaparabrisas -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Limpiaparabrisas</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.limpiaparabrisas"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- luces interiores -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block"
                    >Luces interiores y tablero</label
                  >
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.luces_interiores"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- Aire acondicionado -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Aire Acondicionado</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.aire_acondicionado"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <div class="col-12">
                  <label class="q-mb-sm block">Observación</label>
                  <q-input
                    autogrow
                    v-model="
                      bitacora.checklistVehiculo.observacion_checklist_interior
                    "
                    placeholder="Opcional"
                    :disable="disabled"
                    hint="Ingresa alguna observación o novedad presentada en el interior del vehículo"
                    outlined
                    dense
                  ></q-input>
                </div>
              </div>
            </q-expansion-item>

            <q-expansion-item
              class="overflow-hidden q-mb-md expansion"
              label="2. Bajo el capó"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <!-- aceite de motor -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Aceite de motor</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.aceite_motor"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- Aceite Hidraulico -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Aceite Hidraulico</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.aceite_hidraulico"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- Liquido de freno -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Liquído de freno</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.liquido_freno"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- liquido refrigerante -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Líquido refrigerante</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.liquido_refrigerante"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- agua -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Agua Plumas/Radiador</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.agua_plumas_radiador"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- filtro de combustible -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Filtro de combustible</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.filtro_combustible"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>
                <!-- baterias -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Batería</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.bateria"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>
                <!-- cables y conexiones-->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Cables y Conexiones</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.cables_conexiones"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <div class="col-12">
                  <label class="q-mb-sm block">Observación</label>
                  <q-input
                    autogrow
                    v-model="
                      bitacora.checklistVehiculo.observacion_checklist_bajo_capo
                    "
                    :disable="disabled"
                    placeholder="Opcional"
                    hint="Ingresa alguna observación o novedad presentada bajo el capó del vehículo"
                    outlined
                    dense
                  ></q-input>
                </div>
              </div>
            </q-expansion-item>

            <q-expansion-item
              class="overflow-hidden q-mb-md expansion"
              label="3. Bajo el vehículo y exterior"
              header-class="text-bold bg-header-collapse"
              default-opened
            >
              <div class="row q-col-gutter-sm q-pa-sm">
                <!-- luces exteriores -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Luces exteriores</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.luces_exteriores"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- frenos -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block"
                    >Frenos (pastillas/zapatas)</label
                  >
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.frenos"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- Amortiguadores -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Amortiguadores</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.amortiguadores"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- 4 llantas -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Llantas </label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.checklistVehiculo.llantas"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <div class="col-12">
                  <label class="q-mb-sm block">Observación</label>
                  <q-input
                    autogrow
                    v-model="
                      bitacora.checklistVehiculo.observacion_checklist_exterior
                    "
                    :disable="disabled"
                    placeholder="Opcional"
                    hint="Ingresa alguna observación o novedad presentada bajo el vehículo y en el exterior"
                    outlined
                    dense
                  ></q-input>
                </div>
              </div>
            </q-expansion-item>
          </div>
        </q-expansion-item>

        <!-- Accesorios del vehículo -->
        <q-expansion-item
          v-if="accion == acciones.editar || accion == acciones.consultar"
          class="overflow-hidden q-mb-md expansion"
          label="Checklist de Accesorios Vehículo"
          header-class="text-bold bg-header-collapse"
          group="checklist"
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- botiquín -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Botiquín</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.botiquin"
                placeholder="Obligatorio"
                :options="optionsEstadosCualitativos"
                keep-color
                :inline="
                  ($q.screen.xs && $q.screen.width > 540) ||
                  ($q.screen.sm && $q.screen.width > 780) ||
                  ($q.screen.md && $q.screen.width > 1024) ||
                  $q.screen.lg ||
                  $q.screen.xl
                "
              >
              </q-option-group>
            </div>

            <!-- caja de herramientas -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Caja de Herramientas</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.caja_herramientas"
                placeholder="Obligatorio"
                :options="optionsEstadosCualitativos"
                keep-color
                :inline="
                  ($q.screen.xs && $q.screen.width > 540) ||
                  ($q.screen.sm && $q.screen.width > 780) ||
                  ($q.screen.md && $q.screen.width > 1024) ||
                  $q.screen.lg ||
                  $q.screen.xl
                "
              >
              </q-option-group>
            </div>

            <!-- triangulos de seguridad -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Triángulos de Seguridad</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.triangulos"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
            </div>

            <!-- llanta de emergencia -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Llanta Emergencia</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.llanta_emergencia"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
            </div>

            <!-- cinturon de seguridad -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Cinturones de Seguridad</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.cinturones"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
            </div>
            <!-- gata -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Gata Hidráulica</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.gata"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
            </div>

            <!-- portaescalera -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Portaescalera</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.portaescalera"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
            </div>

            <!-- extintor -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Extintor</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.checklistAccesoriosVehiculo.extintor"
                placeholder="Obligatorio"
                :options="optionsEstadosExtintor"
                keep-color
                inline
              >
              </q-option-group>
            </div>

            <div class="col-12">
              <label class="q-mb-sm block">Observación</label>
              <q-input
                autogrow
                v-model="
                  bitacora.checklistAccesoriosVehiculo
                    .observacion_accesorios_vehiculo
                "
                :disable="disabled"
                placeholder="Opcional"
                hint="Ingresa alguna observación o novedad acerca de los accesorios del vehículo"
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>

        <!-- Imágenes -->
        <q-expansion-item
          v-if="accion == acciones.editar || accion == acciones.consultar"
          class="overflow-hidden q-mb-md expansion"
          label="Checklist de Imágenes del vehículo"
          header-class="text-bold bg-header-collapse"
          group="checklist"
        >
          <div
            class="col-12 col-md-12 rounded-card q-ma-sm q-py-sm text-center bg-light-blue-2"
          >
            <div>
              <q-icon
                name="bi-info-circle-fill"
                class="q-mr-xs q-ml-xs"
                size="1em"
              /><b> Información </b>Todas las imágenes son obligatorias en cada
              bitácora
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- frente del vehiculo -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Delantera</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_frontal"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_frontal.$errors.length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_frontal = data)
                "
              ></selector-imagen>
            </div>

            <!-- parte trasera del vehiculo-->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte trasera</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_trasera"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_trasera.$errors.length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_trasera = data)
                "
              ></selector-imagen>
            </div>

            <!-- parte lateral izquierda -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Lateral Izq.</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="
                  bitacora.checklistImagenVehiculo.imagen_lateral_izquierda
                "
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_lateral_izquierda.$errors
                    .length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_lateral_izquierda =
                      data)
                "
              ></selector-imagen>
            </div>

            <!-- parte lateral derecha -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Lateral Der.</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="
                  bitacora.checklistImagenVehiculo.imagen_lateral_derecha
                "
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_lateral_derecha.$errors
                    .length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_lateral_derecha =
                      data)
                "
              ></selector-imagen>
            </div>

            <!-- Tablero -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Tablero (kilometraje)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_tablero_km"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_tablero_km.$errors.length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_tablero_km = data)
                "
              ></selector-imagen>
            </div>

            <!-- Tablero -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Tablero (radio)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_tablero_radio"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_tablero_radio.$errors
                    .length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_tablero_radio =
                      data)
                "
              ></selector-imagen>
            </div>

            <!-- asientos -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Asientos</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_asientos"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_asientos.$errors.length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_asientos = data)
                "
              >
              </selector-imagen>
            </div>
            <!-- herramientas y accesorios -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block"
                >Herramientas y accesorios
                <q-tooltip class="bg-dark"
                  >La imágen debe incluir triángulos, extintor, gata, conos,
                  caja de herramientas</q-tooltip
                ></label
              >
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.checklistImagenVehiculo.imagen_accesorios"
                :comprimir="true"
                :disable="disabled"
                :error="
                  !!v$.checklistImagenVehiculo.imagen_accesorios.$errors.length
                "
                :alto="'200px'"
                @update:model-value="
                  (data) =>
                    (bitacora.checklistImagenVehiculo.imagen_accesorios = data)
                "
              ></selector-imagen>
            </div>

            <div class="col-12">
              <label class="q-mb-sm block">Observación</label>
              <q-input
                autogrow
                v-model="bitacora.checklistImagenVehiculo.observacion"
                :disable="disabled"
                placeholder="Opcional"
                hint="Ingresa alguna observación o novedad presentada en el vehículo"
                outlined
                dense
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./BitacoraVehicularPage.ts"></script>
