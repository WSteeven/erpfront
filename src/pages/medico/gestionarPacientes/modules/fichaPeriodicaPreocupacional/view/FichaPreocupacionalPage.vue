<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="row full-width q-col-gutter-sm justify-end" v-if="true">
        <div class="q-pl-md" v-if="accion == acciones.consultar">
          <q-btn outline dense @click="btnEditarFicha()" color="secondary">
            <q-tooltip class="bg-dark">Editar</q-tooltip>
            <q-icon class="bi-pencil-square" size="xs" />
          </q-btn>
        </div>
        <div v-if="accion == acciones.editar">
          <q-btn
            outline
            dense
            class="q-pl-sm"
            @click="btnCancelarEditarFicha"
            color="negative"
          >
            <q-tooltip class="bg-dark">Cancelar Editar</q-tooltip>
            <q-icon class="bi-x" size="sm" />
          </q-btn>
        </div>
      </div>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Datos del empleado"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-md block">Religión:</label>
            <div class="q-gutter-sm">
              <q-select
                v-model="fichaPreocupacional.religion"
                :options="mapearOptionsSelect(listadosAuxiliares.religiones)"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Obligatorio"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
                :error="!!v$.religion.$errors.length"
                @blur="v$.religion.$touch"
              >
                <template v-slot:error>
                  <error-component clave="religion" :v$="v$" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block q-mb-md">Orientaciones sexuales:</label>
            <div class="q-gutter-sm">
              <q-select
                v-model="fichaPreocupacional.orientacion_sexual"
                :options="
                  mapearOptionsSelect(listadosAuxiliares.orientacionesSexuales)
                "
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Obligatorio"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
                :error="!!v$.orientacion_sexual.$errors.length"
                @blur="v$.orientacion_sexual.$touch"
              >
                <template v-slot:error>
                  <error-component clave="orientacion_sexual" :v$="v$" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block q-mb-md">Identidad género:</label>
            <div class="q-gutter-sm">
              <q-select
                v-model="fichaPreocupacional.identidad_genero"
                :options="
                  mapearOptionsSelect(listadosAuxiliares.identidadesGeneros)
                "
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :input-debounce="0"
                use-input
                hint="Obligatorio"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
                :error="!!v$.identidad_genero.$errors.length"
                @blur="v$.identidad_genero.$touch"
              >
                <template v-slot:error>
                  <error-component clave="identidad_genero" :v$="v$" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Número de archivo</label>
            <q-input
              v-model="fichaPreocupacional.numero_archivo"
              placeholder="Obligatorio"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Grupo sanguíneo</label>
            <q-select
              v-model="fichaPreocupacional.grupo_sanguineo"
              :options="tipos_sangre"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              hint="Opcional"
              :option-value="v => v.nombre"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lateralidad</label>
            <q-input
              v-model="fichaPreocupacional.lateralidad"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.lateralidad.$errors.length"
              @blur="v$.lateralidad.$touch"
            >
              <template v-slot:error>
                <error-component clave="lateralidad" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!--Cargo -->
          <div class="col-12 col-md-3 col-sm-3">
            <label class="q-mb-sm block">Cargo</label>
            <q-select
              v-model="fichaPreocupacional.cargo"
              :options="cargos"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @blur="v$.cargo.$touch"
              @filter="filtrarCargos"
              :error="!!v$.cargo.$errors.length"
              error-message="Debes seleccionar un cargo"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="cargo" :v$="v$" />
              </template>
            </q-select>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Motivo de consulta"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.motivo_consulta"
              placeholder="Anotar la causa del problema en la versión del informante"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes personales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="text-bold q-mb-md">
            ANTECEDENTES CLÍNICOS Y QUIRÚRGICOS
          </div>
          <div class="col-12 q-mb-md">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedente_clinico_quirurgico
              "
              placeholder="Anotar la causa del problema en la versión del informante"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">
            {{
              mostrarMasculino
                ? 'ANTECEDENTES REPRODUCTIVOS MASCULINOS'
                : 'ANTECEDENTES GINECO OBSTÉTRICOS'
            }}
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Menarquía</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.menarquia
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Ciclos</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.ciclos
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Fecha de última menstruación</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos
                  .fecha_ultima_menstruacion
              "
              placeholder="Opcional"
              outlined
              :disable="disabled"
              type="datetime"
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
                      v-model="
                        fichaPreocupacional.antecedentes_gineco_obstetricos
                          .fecha_ultima_menstruacion
                      "
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
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Gestas</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.gestas
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Partos</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.partos
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Cesáreas</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.cesareas
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div v-if="mostrarFemenino" class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Abortos</label>
            <q-input
              v-model="
                fichaPreocupacional.antecedentes_gineco_obstetricos.abortos
              "
              placeholder="Opcional"
              type="number"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hijos vivos</label>
            <q-input
              v-model="fichaPreocupacional.antecedente_personal.hijos_vivos"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.antecedente_personal.hijos_vivos.$errors.length"
              @blur="v$.antecedente_personal.hijos_vivos.$touch"
            >
              <template v-slot:error>
                <error-component
                  clave="antecedente_personal.hijos_vivos"
                  :v$="v$"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Hijos muertos</label>
            <q-input
              v-model="fichaPreocupacional.antecedente_personal.hijos_muertos"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.antecedente_personal.hijos_muertos.$errors.length"
              @blur="v$.antecedente_personal.hijos_muertos.$touch"
            >
              <template v-slot:error>
                <error-component
                  clave="antecedente_personal.hijos_muertos"
                  :v$="v$"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Vida sexual activa</label>
            <div class="q-gutter-sm">
              <q-radio
                v-model="
                  fichaPreocupacional.antecedente_personal.vida_sexual_activa
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPreocupacional.antecedente_personal.vida_sexual_activa
                "
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block"
              >Método de planificación familiar</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="
                  fichaPreocupacional.antecedente_personal
                    .tiene_metodo_planificacion_familiar
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPreocupacional.antecedente_personal
                    .tiene_metodo_planificacion_familiar
                "
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="
              fichaPreocupacional.antecedente_personal
                .tiene_metodo_planificacion_familiar
            "
            class="col-12 col-md-3 q-mb-md"
          >
            <label class="q-mb-sm block"
              >Tipo de método de planificación familiar</label
            >
            <q-input
              v-model="
                fichaPreocupacional.antecedente_personal
                  .tipo_metodo_planificacion_familiar
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div
            v-for="examen of listadosAuxiliares.examenes_realizados"
            :key="examen.id"
            class="col-12 q-mb-md"
          >
            <div>
              <q-separator></q-separator>
            </div>
            <div v-if="[acciones.nuevo, acciones.editar].includes(accion)" class="row q-col-gutter-x-sm">
              <div class="row col-12">
                <div class="col-6 col-md-6 col-sm-12">
                  Previamente me he realizado el examen:
                  <strong>{{ examen.examen.toUpperCase() }}</strong
                  >?
                </div>
                <div class="col-6 col-md-6 col-sm-12">
                  <option-group-component
                    v-model="examen.se_realizo_examen"
                    :disable="disabled"
                  />
                </div>
              </div>
              <div
                class="col-md-6 col-md-3 q-mb-md"
                v-if="examen.se_realizo_examen"
              >
                <label class="q-mb-sm block">Fecha de realización</label>
                <q-input
                  v-model="examen.tiempo"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div
                class="col-md-6 col-md-3 q-mb-md"
                v-if="examen.se_realizo_examen"
              >
                <label class="q-mb-sm block">Resultado</label>
                <q-input
                  v-model="examen.resultado"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-12 q-mb-md" v-if="accion === acciones.consultar">
            <essential-table
              :configuracionColumnas="
                configuracionColumnasResultadoExamenPreocupacional
              "
              :datos="listadosAuxiliares.examenes_realizados"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>

          <div class="col-12 text-bold q-mb-md">HÁBITOS TÓXICOS</div>
          <div class="text-grey-8 q-mb-md">(Opcional)</div>
          <div
            v-for="habito of listadosAuxiliares.habitos_toxicos"
            :key="habito.id"
            class="col-12 q-mb-md"
          >
            <div class="col-12" v-if="[acciones.nuevo, acciones.editar].includes(accion)">
              <q-separator />
            </div>
            <div v-if="[acciones.nuevo, acciones.editar].includes(accion)" class="row q-col-gutter-x-sm">
              <div class="row col-12">
                <div class="col-md-6 col-sm-12 col-xs-12">
                  He consumido:
                  <strong>{{ habito.tipo_habito_toxico.toUpperCase() }}</strong
                  >?
                </div>
                <div class="col-md-6 col-sm-12">
                  <option-group-component
                    v-model="habito.consume"
                    :disable="disabled"
                  />
                </div>
              </div>
              <div class="col-md-6 col-md-3 q-mb-md" v-if="habito.consume">
                <label class="q-mb-sm block">Tiempo de consumo</label>
                <q-input
                  v-model="habito.tiempo_consumo_meses"
                  placeholder="Obligatorio"
                  hint="Ingrese un valor en meses"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 q-mb-md" v-if="habito.consume">
                <label class="q-mb-sm block">Cantidad</label>
                <q-input
                  v-model="habito.cantidad"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  outlined
                  dense
                >
                </q-input>
              </div>
              <div class="col-md-6 col-sm-12 q-mb-md" v-if="habito.consume">
                ¿Soy ex-consumidor?
                <option-group-component
                  v-model="habito.ex_consumidor"
                  :disable="disabled"
                />
              </div>
              <div
                class="col-md-6 col-sm-12 q-mb-md"
                v-if="habito.ex_consumidor"
              >
                <label class="q-mb-sm block">Tiempo de abstinencia</label>
                <q-input
                  v-model="habito.tiempo_abstinencia_meses"
                  placeholder="Obligatorio"
                  :disable="disabled"
                  hint="Ingrese un valor en meses"
                  outlined
                  dense
                >
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-12 q-mb-md" v-if="accion === acciones.consultar">
            <essential-table
              :configuracionColumnas="
                configuracionColumnasResultadoHabitoToxico
              "
              :datos="listadosAuxiliares.habitos_toxicos"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer.="false"
              :grid="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>

          <div class="col-12 text-bold q-mb-md">ESTILO DE VIDA</div>
          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaActividadFisica()"
              >Insertar fila
            </q-btn>
            <span class="text-grey-8"
              >(Inserte un máximo de 1 fila) (Opcional)</span
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasActividadFisica,
                accionesTabla
              ]"
              :datos="fichaPreocupacional.actividades_fisicas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
              :accion1="btnEliminarActividadFisica"
            >
            </essential-table>
          </div>

          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaMedicacionHabitual()"
              >Insertar fila
            </q-btn>
            <span class="text-grey-8"
              >(Inserte un máximo de 3 filas) (Opcional)</span
            >
            <essential-table
              :configuracionColumnas="[
                ...configuracionColumnasMedicacionHabitual,
                accionesTabla
              ]"
              :datos="fichaPreocupacional.medicaciones"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
              :accion1="btnEliminarMedicacionHabitual"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes de trabajo"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 text-bold q-mb-md">
            ANTECEDENTES DE EMPLEOS ANTERIORES
          </div>

          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaAntecedenteTrabajoAnterior()"
              >Insertar fila
            </q-btn>
            <span class="text-grey-8">(Opcional)</span>
            <essential-table
              v-if="mostrarTablaAntecedenteTrabajoAnteriorReactive"
              :configuracionColumnas="[
                ...configuracionColumnasAntecedenteTrabajoAnteriorReactive,
                accionesTabla
              ]"
              :datos="fichaPreocupacional.antecedentes_empleos_anteriores"
              :v$="v$"
              key-error="antecedentes_empleos_anteriores"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
              :accion1="btnEliminarAntecedenteTrabajoAnterior"
            >
            </essential-table>
          </div>

          <div class="col-12 text-bold q-mb-md">
            ACCIDENTES DE TRABAJO (DESCRIPCIÓN)
          </div>
          <div class="col-md-12 col-xs-12">
            <label>Ha tenido algún accidente de trabajo?</label>
            <option-group-component
              v-model="fichaPreocupacional.tiene_accidente_trabajo"
              :disable="disabled"
            />
          </div>
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_accidente_trabajo"
          >
            <label class="q-mb-sm block"
              >Fue calificado por el Instituto de Seguridad Social
              correspondiente</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="fichaPreocupacional.accidente_trabajo.calificado_iss"
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="fichaPreocupacional.accidente_trabajo.calificado_iss"
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPreocupacional.accidente_trabajo.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="
                fichaPreocupacional.accidente_trabajo.instituto_seguridad_social
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_accidente_trabajo"
          >
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaPreocupacional.accidente_trabajo.fecha"
              placeholder="Opcional"
              outlined
              :disable="disabled"
              type="datetime"
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
                      v-model="fichaPreocupacional.accidente_trabajo.fecha"
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
            </q-input>
          </div>

          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_accidente_trabajo"
          >
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="fichaPreocupacional.accidente_trabajo.observacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 text-bold q-mb-md">
            ENFERMEDADES PROFESIONALES (DESCRIPCIÓN)
          </div>
          <div class="col-md-12 col-xs-12">
            <label>Ha tenido alguna enfermedad profesional?</label>
            <option-group-component
              v-model="fichaPreocupacional.tiene_enfermedad_profesional"
              :disable="disabled"
            />
          </div>
          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_enfermedad_profesional"
          >
            <label class="q-mb-sm block"
              >Fue calificado por el Instituto de Seguridad Social
              correspondiente</label
            >
            <div class="q-gutter-sm">
              <q-radio
                v-model="
                  fichaPreocupacional.enfermedad_profesional.calificado_iss
                "
                :val="true"
                label="Si"
                :disable="disabled"
              />
              <q-radio
                v-model="
                  fichaPreocupacional.enfermedad_profesional.calificado_iss
                "
                :val="false"
                label="No"
                :disable="disabled"
              />
            </div>
          </div>

          <div
            v-if="fichaPreocupacional.enfermedad_profesional.calificado_iss"
            class="col-12 col-md-6 q-mb-md"
          >
            <label class="q-mb-sm block">Especificar</label>
            <q-input
              v-model="
                fichaPreocupacional.enfermedad_profesional
                  .instituto_seguridad_social
              "
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>

          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_enfermedad_profesional"
          >
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="fichaPreocupacional.enfermedad_profesional.fecha"
              placeholder="Opcional"
              outlined
              :disable="disabled"
              type="datetime"
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
                      v-model="fichaPreocupacional.enfermedad_profesional.fecha"
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
            </q-input>
          </div>

          <div
            class="col-12 col-md-6 q-mb-md"
            v-if="fichaPreocupacional.tiene_enfermedad_profesional"
          >
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="fichaPreocupacional.enfermedad_profesional.observacion"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Antecedentes familiares (Detallar parentesco)"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <div class="text-grey-8 q-mb-md">(Opcional)</div>
            <!-- {{ fichaPreocupacional.antecedentes_familiares }} -->
            <essential-table
              :configuracionColumnas="configuracionColumnasAntecedenteFamiliar"
              :datos="listadosAuxiliares.antecedentes_familiares"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Factores de riesgo del puesto de trabajo actual"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <q-btn
              color="primary"
              class="q-mb-sm q-mr-sm"
              icon="bi-arrow-down"
              :disable="disabled"
              no-caps
              unelevated
              @click="insertarFilaFrPuestoTrabajoActualReactive()"
              >Insertar fila
            </q-btn>
            <span class="text-grey-8">(Opcional)</span>
            <essential-table
              v-if="mostrarTablaFrPuestoTrabajoActualReactive"
              :configuracionColumnas="[
                ...configuracionColumnasFrPuestoTrabajoActualReactive,
                accionesTabla
              ]"
              :datos="fichaPreocupacional.fr_puestos_trabajos_actuales"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="false"
              separador="cell"
              :accion1="btnEliminarFrPuestoTrabajoActual"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Actividades extra laborales"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.actividades_extralaborales"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Enfermedad actual"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.enfermedad_actual"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Revisión actual de órganos y sistemas"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12 q-mb-md">
            <div class="text-grey-8 q-mb-md">(Opcional)</div>
            <essential-table
              :configuracionColumnas="
                configuracionColumnasRevisionActualOrganoSistema
              "
              :datos="listadosAuxiliares.revisiones_actuales_organos_sistemas"
              :permitirConsultar="false"
              :permitirEliminar="false"
              :permitirEditar="false"
              :mostrarBotones="false"
              :disable="disabled"
              :permitir-editar-celdas="true"
              :mostrar-header="false"
              :mostrar-footer="false"
              :alto-fijo="false"
              :ajustarCeldas="true"
              separador="cell"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Constantes vitales y antropometría"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <contantes-vitales
            :constante-vital="fichaPreocupacional.constante_vital"
            :disable="disabled"
            @update:model-value="hidratarConstanteVital"
            :validador="v$"
          ></contantes-vitales>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Examen físico regional"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="q-pa-md">
          <examen-fisico-regional-component
            :datos="fichaPreocupacional.examenes_fisicos_regionales"
            :disable="disabled"
            @update:model-value="hidratarExamenFisicoRegional"
          ></examen-fisico-regional-component>
          <!-- :validador="v$" -->
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Aptitud médica para el trabajo"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <aptitud-medica-trabajo
          :aptitud-medica="fichaPreocupacional.aptitud_medica"
          :disable="disabled"
          @update:model-value="hidratarAptitudMedica"
        >
        </aptitud-medica-trabajo>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Recomendaciones y/o tratamiento"
        header-class="text-bold bg-desenfoque text-primary"
        default-opened
      >
        <div class="row q-col-gutter-x-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="fichaPreocupacional.recomendaciones_tratamiento"
              placeholder="Opcional"
              :disable="disabled"
              outlined
              dense
            >
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <div
        v-if="[acciones.consultar, acciones.editar].includes(accion)"
        class="q-mb-md q-pa-sm border-grey-6 rounded-field"
      >
        <gestor-archivos
          ref="refArchivo"
          label="Ficha preocupacional firmada"
          :mixin="mixin"
          :listarAlGuardar="true"
          :idModelo="fichaPreocupacional.id"
        >
          <template #boton-subir>
            <q-btn
              v-if="quieroSubirArchivos"
              color="primary"
              push
              no-caps
              class="full-width q-mb-lg"
              @click="subirFichaMedicaFirmada"
            >
              <q-icon name="bi-upload" class="q-mr-sm" size="xs" />
              Subir ficha médica firmada
            </q-btn>
          </template>
        </gestor-archivos>
      </div>
    </template>

    <template #custom-buttons>
      <div class="row q-gutter-x-xs">
        <q-btn
          v-if="fichaPreocupacional.id && mostrarDescargarPdf && accion==acciones.consultar"
          class="bg-white text-pink-10"
          no-caps
          push
          @click="descargarPdf()"
        >
          <q-icon name="bi-file-earmark-pdf" size="xs" class="q-mr-sm"></q-icon>
          Descargar PDF
        </q-btn>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./FichaPreocupacionalPage.ts"></script>
