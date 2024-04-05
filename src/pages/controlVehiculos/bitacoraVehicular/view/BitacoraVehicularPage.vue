<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Control diario de vehículos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Vehiculo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vehículo</label>
            <q-input
              v-model="bitacora.vehiculo"
              placeholder="Obligatorio"
              :error="!!v$.vehiculo.$errors.length"
              disable
              outlined
              dense
            ></q-input>
            <!-- <q-select
              v-model="bitacora.vehiculo"
              :options="vehiculos"
              hint="Agregue elementos desde el panel de vehículos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              clearable
              dense
              outlined
              :readonly="disabled"
              :disable="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarVehiculos"
              :option-label="(item) => item.placa"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.placa }}</q-item-label>
                    <q-item-label caption>{{
                      scope.opt.marca + ' ' + scope.opt.modelo
                    }}</q-item-label>
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
            </q-select> -->
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
            <!-- <q-select
              v-model="bitacora.chofer"
              :options="choferes"
              hint="Agregue rol de chofer a un empleado para mostrar en este listado"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :readonly="disabled"
              use-input
              input-debounce="0"
              @filter="filtrarChoferes"
              :option-label="(item) => item.nombres + ' ' + item.apellidos"
              :option-value="(item) => item.id"
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
            </q-select> -->
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
              :disabled="disabled"
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
              :disabled="disabled"
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
              :disabled="disabled"
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
          <!-- km final -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Km final</label>
            <q-input
              type="number"
              v-model="bitacora.km_final"
              placeholder="Obligatorio"
              :disabled="disabled"
              :readonly="disabled"
              :error="!!v$.km_final.$errors.length"
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
              v-model="bitacora.tanque_inicio"
              type="number"
              mask="###"
              :rules="[
                (val) =>
                  (val <= 100 && val >= 0) || 'Ingresa un valor entre 0 y 100',
              ]"
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
              show-value
              class="text-white q-ma-md"
              v-model="bitacora.tanque_inicio"
              size="90px"
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
              ref="tFinal"
              type="number"
              v-model="bitacora.tanque_final"
              mask="###"
              :rules="[
                (val) =>
                  (val <= 100 && val >= 0) || 'Ingresa un valor entre 0 y 100',
              ]"
              dense
              outlined
            >
              <template v-slot:error>Ingresa un valor entre 0 y 100</template>
              <template v-slot:prepend
                ><q-icon name="bi-fuel-pump-fill"></q-icon
              ></template>
              <template v-slot:append
                ><q-icon name="bi-percent" size="xs" color="black"></q-icon
              ></template>
            </q-input>
            <q-knob
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
        </div>
        <!-- Actividades realizadas -->
        <!-- <q-expansion-item
          v-if="accion == acciones.editar || accion == acciones.consultar"
          class="overflow-hidden q-mb-md expansion"
          label="Actividades Realizadas"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12">
              <essential-table
              titulo="Actividades realizadas"
              :configuracionColumnas="accion === acciones.editar
                  ? [columnasActividades,...accionesTabla]
                  : columnasActividades
              "
              :datos="bitacoras.actividadesRealizadas"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
            ></essential-table>
            </div>
          </div>
        </q-expansion-item> -->
        <!-- Mantenimientos -->
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
                    v-model="bitacora.parabrisas"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.limpiaparabrisas"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.luces_interiores"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.aire_acondicionado"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <div class="col-12">
                  <label class="q-mb-sm block">Observacion</label>
                  <q-input
                    v-model="bitacora.aire_acondicionado"
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
                    v-model="bitacora.aceite_motor"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.aceite_hidraulico"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.liquido_freno"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.liquido_refrigerante"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.cables_conexiones"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.filtro_combustible"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.bateria"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.cables_conexiones"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
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
                    v-model="bitacora.luces_exteriores"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.frenos"
                    placeholder="Obligatorio"
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
                    v-model="bitacora.amortiguadores"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- llanta delantera derecha -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Llanta delantera derecha</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.tire_rf"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- llanta delantera izquierda -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block"
                    >Llanta delantera izquierda</label
                  >
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.tire_lf"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>

                <!-- llanta trasera derecha -->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Llanta trasera derecha</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.tire_rr"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
                </div>
                <!-- llanta trasera izquiera-->
                <div class="col-md-3 col-sm-4 col-xs-6">
                  <label class="q-mb-sm block">Llanta trasera izquierda</label>
                  <q-option-group
                    :disable="disabled"
                    v-model="bitacora.tire_lr"
                    placeholder="Obligatorio"
                    :options="optionsDefault"
                    keep-color
                    inline
                  >
                  </q-option-group>
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
                v-model="bitacora.botiquin"
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

            <!-- extintor -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Extintor</label>
              <q-option-group
                :disable="disabled"
                v-model="bitacora.extintor"
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
                v-model="bitacora.caja_herramientas"
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
                v-model="bitacora.triangulos"
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
                v-model="bitacora.tire_emergencia"
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
                v-model="bitacora.cinturones"
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
                v-model="bitacora.gata"
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
                v-model="bitacora.portaescalera"
                placeholder="Obligatorio"
                :options="optionsEstados"
                keep-color
                inline
              >
              </q-option-group>
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
              bitácora:
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- frente del vehiculo -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Delantera</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- parte trasera del vehiculo-->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte trasera</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- parte lateral izquierda -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Lateral Izq.</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- parte lateral derecha -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Parte Lateral Der.</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- Tablero -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Tablero (kilometraje)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- Tablero -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Tablero (radio)</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>

            <!-- asientos -->
            <div class="col-md-3 col-sm-4 col-xs-6">
              <label class="q-mb-sm block">Asientos</label>
              <selector-imagen
                file_extensiones=".jpg, image/*"
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
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
                :imagen="bitacora.imagen_frontal"
                :comprimir="true"
                :alto="'200px'"
                @update:model-value="(data) => (bitacora.imagen_frontal = data)"
              ></selector-imagen>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>
</template>
<!-- :error="v$.nombre.$errors"  -->

<script src="./BitacoraVehicularPage.ts"></script>
