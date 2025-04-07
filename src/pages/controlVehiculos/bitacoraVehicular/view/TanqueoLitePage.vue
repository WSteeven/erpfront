<script setup lang="ts">
import SimpleLayout from 'shared/contenedor/modules/simple/view/SimpleLayout.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Tanqueo } from 'vehiculos/tanqueoCombustible/domain/Tanqueo'
import { TanqueoController } from 'vehiculos/tanqueoCombustible/infraestructure/TanqueoController'
import { CombustibleController } from 'vehiculos/combustible/infraestructure/CombustibleController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import SelectorImagen from 'components/SelectorImagen.vue'
import { useAuthenticationStore } from 'stores/authentication'
import { obtenerFechaActual } from 'shared/utils'
import { maskFecha } from 'config/utils'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'

const mixin = new ContenedorSimpleMixin(Tanqueo, new TanqueoController())
const {
  entidad: tanqueo,
  listadosAuxiliares,
  disabled
} = mixin.useReferencias()
const { cargarVista, obtenerListados, setValidador, guardar } =
  mixin.useComportamiento()

const props = defineProps({
  datos: Object
})
const emit = defineEmits(['guardado', 'cerrar-modal'])
const store = useAuthenticationStore()
const { combustibles, filtrarCombustibles } =
  useFiltrosListadosSelects(listadosAuxiliares)
const vehiculo = props.datos.vehiculo

cargarVista(async () => {
  await obtenerListados({
    combustibles: new CombustibleController()
  })

  combustibles.value = listadosAuxiliares.combustibles

  datosDefault()
})
//Reglas de validacion
const reglas = {
  fecha_hora: { required },
  km_tanqueo: { required },
  monto: { required },
  combustible: { required },
  imagen_comprobante: { required },
  imagen_tablero: { required }
}

const v$ = useVuelidate(reglas, tanqueo)
setValidador(v$.value)

function datosDefault() {
  tanqueo.vehiculo = props.datos.vehiculo_id
  tanqueo.bitacora = props.datos.bitacora_id
  tanqueo.solicitante = store.nombreUsuario
  tanqueo.fecha_hora = obtenerFechaActual(maskFecha)
}

async function guardarTanqueo() {
  const response = await guardar(tanqueo, false)
  console.log(response)
  emit('guardado', { formulario: 'TanqueoLitePage', modelo: response})
  emit('cerrar-modal', false)
}
</script>

<template>
  <simple-layout :mixin="mixin" :mostrarButtonSubmits="false">
    <template #formulario>
      <div class="row q-col-gutter-sm q-py-md">
        <!-- vehículo -->
        <div class="col-12 col-md-3 col-sm-6">
          <label class="q-mb-sm block">Vehículo</label>
          <q-input v-model="vehiculo" disable outlined dense autogrow />
        </div>

        <!-- Solicitante -->
        <div v-if="tanqueo.solicitante" class="col-12 col-md-3 col-sm-6">
          <label class="q-mb-sm block">Solicitante</label>
          <q-input
            v-model="tanqueo.solicitante"
            disable
            outlined
            dense
            autogrow
          />
        </div>

        <!-- Fecha y hora -->
        <div class="col-12 col-md-3 col-sm-6">
          <label class="q-mb-sm block">Fecha</label>
          <q-input
            v-model="tanqueo.fecha_hora"
            placeholder="Obligatorio"
            :error="!!v$.fecha_hora.$errors.length"
            @blur="v$.fecha_hora.$touch"
            outlined
            disable
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
                    v-model="tanqueo.fecha_hora"
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
              <div v-for="error of v$.fecha_hora.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Km Tanqueo -->
        <div class="col-12 col-md-3 col-sm-6">
          <label class="q-mb-sm block">Km Tanqueo</label>
          <q-input
            type="number"
            v-model="tanqueo.km_tanqueo"
            placeholder="Obligatorio"
            :readonly="disabled"
            :error="!!v$.km_tanqueo.$errors.length"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.km_tanqueo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Valor -->
        <div class="col-12 col-md-3 col-sm-6">
          <label class="q-mb-sm block">Monto</label>
          <q-input
            type="number"
            v-model="tanqueo.monto"
            placeholder="Obligatorio"
            :readonly="disabled"
            :error="!!v$.monto.$errors.length"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.monto.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- Combustible -->
        <div class="col-12 col-md-3 col-sm-6 q-mb-md">
          <label class="q-mb-sm block">Tipo de combustible</label>
          <q-select
            v-model="tanqueo.combustible"
            :options="combustibles"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :disable="disabled"
            :error="!!v$.combustible.$errors.length"
            use-input
            input-debounce="0"
            @filter="filtrarCombustibles"
            :option-label="item => item.nombre"
            :option-value="item => item.id"
            emit-value
            map-options
          >
            <template v-slot:error>
              <div v-for="error of v$.combustible.$errors" :key="error.$uid">
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
        <!-- Imagen num_comprobante -->
        <div class="col-12 col-md-3 col-sm-6">
          <label for="q-mb-sm block">Imagen Comprobante</label>
          <selector-imagen
            file_extensiones=".jpg, image/*"
            placeholder="Obligatorio"
            :imagen="tanqueo.imagen_comprobante"
            :error="!!v$.imagen_comprobante.$errors.length"
            :alto="'200px'"
            @update:model-value="data => (tanqueo.imagen_comprobante = data)"
          ></selector-imagen>
        </div>

        <!-- Imagen tablero -->
        <div class="col-12 col-md-3 col-sm-6">
          <label for="q-mb-sm block">Imagen Tablero</label>
          <selector-imagen
            file_extensiones=".jpg, image/*"
            placeholder="Obligatorio"
            :imagen="tanqueo.imagen_tablero"
            :error="!!v$.imagen_tablero.$errors.length"
            :alto="'200px'"
            @update:model-value="data => (tanqueo.imagen_tablero = data)"
          ></selector-imagen>
        </div>
      </div>
    </template>
    <template #custom-buttons>
      <div class="row q-gutter-xs">
        <!-- Boton guardar -->
        <q-btn
          color="primary"
          type="submit"
          push
          no-caps
          :disable="disabled"
          @click="guardarTanqueo"
        >
          <q-icon name="save" size="xs" class="q-pr-sm"></q-icon>
          <span>Guardar</span>
        </q-btn>
        <!-- Boton cancelar -->
        <!-- data-bs-dismiss="modal" -->
        <q-btn
          color="negative"
          push
          no-caps
          @click="
            () => {
              $emit('cancelar', true)
              $emit('cerrar-modal', false)
            }
          "
        >
          <q-icon name="bi-x-lg" size="xs" class="q-pr-sm"></q-icon>
          <span>Cancelar</span>
        </q-btn>
      </div>
    </template>
  </simple-layout>
</template>
