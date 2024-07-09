<template>
  <!-- <div class="q-pa-md"  style="position: sticky">
    <q-btn fab color="primary" @click="onClick" icon="mail" label="Email" />
  </div> -->
  <q-expansion-item
    class="overflow-hidden q-mb-md expansion"
    label="Información de Licencia"
    header-class="text-bold bg-header-collapse"
    default-opened
  >
    <div class="row q-col-gutter-sm q-pa-sm">
      <!-- Puntos y tipo de licencia -->
      <div class="col-12 col-md-3">
        <!-- puntos -->
        <div class="col-12 col-md-12" v-if="validar">
          <label class="q-mb-sm block">Puntos</label>
          <q-input
            v-model="conductor.puntos"
            type="number"
            step=".5"
            :disable="disabled"
            :error="!!v$.puntos.$errors.length"
            hint="Todo conductor debe tener un puntaje mayor o igual a 20 pts"
            error-message="Debe ingresar un valor entre 0 y 30"
            @blur="v$.puntos.$touch"
            outlined
            dense
            ><template v-slot:error>
              <div v-for="error of v$.puntos.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
        <!--Tipo de Licencia -->
        <div class="col-12 col-md-12 q-mt-lg" v-if="validar">
          <label class="q-mb-sm block">Tipo de Licencia</label>
          <q-select
            v-model="conductor.tipo_licencia"
            :options="tiposLicencias"
            transition-show="jump-up"
            transition-hide="jump-down"
            hint="Obligatorio"
            :disable="disabled"
            options-dense
            dense
            outlined
            use-chips
            multiple
            :error="!!v$.tipo_licencia.$errors.length"
            error-message="Debes seleccionar un tipo de licencia"
            @add="agregarLicencia"
            @remove="quitarLicencia"
            :option-value="(v) => v.value"
            :option-label="(v) => v.label"
            emit-value
            map-options
          >
            <template
              v-slot:option="{ itemProps, opt, selected, toggleOption }"
            >
              <q-item v-bind="itemProps">
                <q-item-section>
                  <q-item-label
                    ><strong>{{ opt.label }}</strong> -
                    {{ opt.caption }}</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :model-value="selected"
                    @update:model-value="toggleOption(opt)"
                  />
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:error>
              <div v-for="error of v$.tipo_licencia.$errors" :key="error.$uid">
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
      </div>

      <q-separator
        class="q-mx-sm block"
        vertical
        v-if="conductor.licencias !== undefined"
      ></q-separator>
      <!-- Foreach de los diferentes tipos de licencia -->
      <div class="col-12 col-md-8" v-if="validar">
        <div class="col-12 col-md-12" v-if="conductor.licencias !== undefined">
          <div
            class="row q-col-gutter-sm"
            v-for="(licencia, index) in conductor.licencias"
            :key="licencia.tipo_licencia!"
          >
            <div class="col-2 col-md-2">
              <label class="q-mb-sm block">Tipo</label>
              <q-chip>{{ licencia.tipo_licencia }}</q-chip>
            </div>
            <!-- Fecha Inicio Vigencia -->
            <div class="col-6 col-md-4">
              <label class="q-mb-sm block">Fecha Inicial Vigencia</label>
              <q-input
                v-model="licencia.inicio_vigencia"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="
                  !!v$.licencias.$each.$response.$errors[index].inicio_vigencia
                    .length
                "
                outlined
                dense
              >
                <!-- :error="!!v$.inicio_vigencia.$errors.length" -->
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="licencia.inicio_vigencia"
                        :mask="maskFecha"
                        today-btn
                        @update:model-value="calcularFechaFinal(index)"
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
                <!-- v-for="error in v$.collection.$each.$response.$errors[index].name" -->
                <template v-slot:error>
                  <div
                    v-for="error of v$.licencias.$each.$response.$errors[index]
                      .inicio_vigencia"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Fecha Fin Vigencia -->
            <div class="col-6 col-md-4">
              <label class="q-mb-sm block">Fecha Final Vigencia</label>
              <q-input
                v-model="licencia.fin_vigencia"
                placeholder="Obligatorio"
                :error="
                  !!v$.licencias.$each.$response.$errors[index].fin_vigencia
                    .length
                "
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
                        v-model="licencia.fin_vigencia"
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

                <template v-slot:error>
                  <div
                    v-for="error of v$.licencias.$each.$response.$errors[index]
                      .fin_vigencia"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>

      <!-- Boton consultar RUC -->
      <div class="col-12 col-md-12">
        <q-btn
          color="primary"
          dense
          rounded
          no-caps
          no-wrap
          unelevated
          class="q-px-sm"
          @click="consultarMultasANT"
        >
          <q-icon name="bi-search" size="xs" class="q-mr-xs" />
          <span>Consultar multas </span>
          <q-tooltip
            >Consultar puntos y vigencia de licencia del chofer</q-tooltip
          >
        </q-btn>
      </div>
      <!-- Tabla de multas -->
      <div
        class="col-12 col-md-12"
        v-if="accion == acciones.editar || accion == acciones.consultar"
      >
        <essential-table
          ref="refMultas"
          titulo="Multas del Conductor"
          :configuracionColumnas="
            accion == acciones.editar
              ? [...configuracionColumnasMultasConductores, accionesTabla] as any
              : configuracionColumnasMultasConductores as any
          "
          :datos="conductor.multas"
          :accion1Header="abrirModalMultaConductor"
          :permitirBuscar="false"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarBotones="false"
          :mostrarCantidadElementos="false"
          :permitirEditarModal="true"
          :modalMaximized="false"
          :alto-fijo="false"
          ajustarCeldas
          :mostrarFooter="false"
          :accion1="btnEditarMulta"
        ></essential-table>
      </div>
    </div>
    <solicitar-fecha
      :mostrar="mostrarSolicitarFecha"
      reason="mask"
      label="Fecha de pago"
      :confirmar="fechaIngresada"
      @cerrar="mostrarSolicitarFecha = false"
    ></solicitar-fecha>
    <modales-entidad
      :comportamiento="modales"
      :persistente="false"
      @guardado="(data) => guardado(data)"
    ></modales-entidad>
  </q-expansion-item>
</template>

<script lang="ts" setup>
//Components
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y Controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Conductor } from '../domain/Conductor'
import { acciones, accionesTabla, maskFecha } from 'config/utils'
import { configuracionColumnasMultasConductores } from '../domain/configuracionColumnasMultasConductores'
import { tiposLicencias } from 'config/vehiculos.utils'
import {
  maxValue,
  minValue,
  required,
  requiredIf,
} from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { ComportamientoModalesConductores } from '../application/ComportamientoModalesConductores'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { onMounted, onUnmounted, ref } from 'vue'
import { useConductorStore } from 'stores/vehiculos/conductor'
import { MultaConductorController } from '../modules/multas/infraestructure/MultaConductorController'
import { FechaLicencia } from '../domain/FechaLicencia'
import { helpers } from '@vuelidate/validators'
import { addDay, addYear, format } from '@formkit/tempo'

const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<any>,
    required: true,
  },
  conductor: {
    type: Object as () => Conductor,
    required: true,
  },
  identificacion: {
    type: String,
    required: false,
  },
  consultarMultas: {
    type: Boolean,
    default: true,
  },
  validar: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['guardado'])

const { disabled, accion } = props.mixin.useReferencias()
const { setValidador } = props.mixin.useComportamiento()
const { confirmar, prompt } = useNotificaciones()
const modales = new ComportamientoModalesConductores()
const conductorStore = useConductorStore()
const conductor = props.conductor
const mostrarSolicitarFecha = ref(false)
const dataMulta = {
  fecha_pago: null,
  comentario: null,
}
onMounted(() => console.log('InformacionLicencia -> Montado'))
onUnmounted(() => console.log('InformacionLicencia -> Desmontado'))

/***********************
 * Reglas de validacion
 **********************/
const reglas = {
  tipo_licencia: { required: requiredIf(() => props.validar) },
  puntos: {
    required: requiredIf(() => props.validar),
    maximo: maxValue(30),
    minimo: minValue(0),
  },
  licencias: {
    $each: helpers.forEach({
      tipo_licencia: { required: requiredIf(() => props.validar) },
      inicio_vigencia: { required: requiredIf(() => props.validar) },
      fin_vigencia: { required: requiredIf(() => props.validar) },
    }),
  },
}
const v$ = useVuelidate(reglas, conductor)
setValidador(v$.value)

/***********************
 * Funciones
 **********************/
async function guardado(data) {
  switch (data) {
    case 'MultaConductorPage':
      if (props.consultarMultas) await consultarMultasConductor()
      emit('guardado', 'MultaConductorPage')
      break
    default:
      console.log('No se recibio data')
  }
}
function calcularFechaFinal(index) {
  conductor.licencias[index].fin_vigencia = format(
    addYear(conductor.licencias[index].inicio_vigencia!, 5),
    maskFecha
  )
  conductor.licencias[index].fin_vigencia = format(
    addDay(conductor.licencias[index].fin_vigencia!, -1),
    maskFecha
  )
}

function consultarMultasANT() {
  props.identificacion
    ? window.open(
        `https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_grid_citaciones.jsp?ps_tipo_identificacion=CED&ps_identificacion=${props.identificacion}&ps_placa=`,
        '_blank'
      )
    : window.open(
        'https://consultaweb.ant.gob.ec/PortalWEB/paginas/clientes/clp_criterio_consulta.jsp',
        '_blank'
      )
}

async function consultarMultasConductor() {
  const { result } = await new MultaConductorController().listar({
    empleado_id: conductor.empleado,
  })
  conductor.multas = result
}
async function fechaIngresada(fecha?) {
  // console.log('Fecha ingresada: ', fecha)
  dataMulta.fecha_pago = fecha
  if (await conductorStore.pagarMulta(dataMulta)) consultarMultasConductor()
}
function agregarLicencia(data) {
  // Aqui se recibe clave valor data = {index:1, value:'A'}
  console.log(data)

  const fecha = new FechaLicencia()
  fecha.tipo_licencia = data.value
  conductor.licencias.push(fecha)
}
function quitarLicencia(data) {
  conductor.licencias.splice(data.index, 1)
}

/**************************************************************
 * Botones de tablas
 **************************************************************/
const abrirModalMultaConductor: CustomActionTable = {
  titulo: 'Agregar multa',
  icono: 'bi-file-text',
  color: 'positive',
  tooltip: 'Agregar multa asociado al conductor',
  accion: () => {
    modales.abrirModalEntidad('MultaConductorPage')
  },
  visible: () => {
    return accion.value == acciones.editar
  },
}

const btnEditarMulta: CustomActionTable = {
  titulo: 'Editar',
  icono: 'bi-pencil-square',
  color: 'secondary',
  tooltip: 'Editar',
  accion: ({ entidad }) => {
    confirmar('¿Está seguro de marcar como pagada la multa?', async () => {
      const data: CustomActionPrompt = {
        titulo: 'Fecha de pago',
        mensaje: '¿Tienes alguna observación al respecto?',
        validacion: (val) => val != null,
        accion: async (data) => {
          conductorStore.idMulta = entidad.id
          dataMulta.comentario = data
          if (dataMulta.fecha_pago == null) mostrarSolicitarFecha.value = true
        },
      }
      prompt(data)
    })
    dataMulta.comentario = null
    dataMulta.fecha_pago = null
  },
  visible: ({ entidad }) => {
    return (
      (accion.value == acciones.nuevo || accion.value == acciones.editar) &&
      !entidad.estado
    )
  },
}
</script>
