<template>
  <q-page padding>
    <b>Detalles del elemento</b>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Coordenada elemento -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Cooordenadas del elemento</label>
        <div class="row q-col-gutter-xs">
          <q-input
            v-model="registroTendido.coordenada_del_elemento_longitud"
            class="col-md-4"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            hint="Longitud"
            :error="!!v$.coordenada_del_elemento_longitud.$errors.length"
            outlined
            dense
            disable
          >
            <template v-slot:error>
              <div
                v-for="error of v$.coordenada_del_elemento_longitud.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>

          <q-input
            v-model="registroTendido.coordenada_del_elemento_latitud"
            class="col-md-4"
            hint="Latitud"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            :error="!!v$.coordenada_del_elemento_latitud.$errors.length"
            outlined
            dense
            disable
          >
            <template v-slot:error>
              <div
                v-for="error of v$.coordenada_del_elemento_latitud.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>

          <span
            class="col-md-4"
            :class="{ 'full-width text-center q-mb-xs': $q.screen.xs }"
          >
            <q-btn
              color="positive"
              no-caps
              :class="{ 'q-mb-xs': $q.screen.xs }"
              @click="ubicacionCoordenadaElemento()"
              :disable="disabled"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </span>
        </div>
      </div>

      <!-- Tipo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de elemento</label>
        <q-select
          v-model="registroTendido.tipo_elemento"
          :options="tiposElementos"
          :error="!!v$.tipo_elemento.$errors.length"
          options-dense
          dense
          outlined
          :disable="disabled"
        >
          <template v-slot:error>
            <div v-for="error of v$.tipo_elemento.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Numero elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Número del elemento</label>
        <q-input
          v-model="registroTendido.numero_elemento"
          placeholder="Obligatorio"
          type="number"
          :error="!!v$.numero_elemento.$errors.length"
          :disable="disabled"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.numero_elemento.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Codigo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Código y numeración de poste o pozo</label>
        <q-input
          v-model="registroTendido.codigo_elemento"
          placeholder="Obligatorio"
          :error="!!v$.codigo_elemento.$errors.length"
          :disable="disabled"
          outlined
          dense
        >
          <template v-slot:error>
            <div v-for="error of v$.codigo_elemento.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Propietario del elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Propietario del elemento</label>
        <q-select
          v-model="registroTendido.propietario_elemento"
          :options="propietariosElementos"
          :error="!!v$.propietario_elemento.$errors.length"
          :disable="disabled"
          options-dense
          dense
          outlined
        >
          <template v-slot:error>
            <div
              v-for="error of v$.propietario_elemento.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Estado del elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estado del elemento</label>
        <q-select
          v-model="registroTendido.estado_elemento"
          :options="estadoElementos"
          :error="!!v$.estado_elemento.$errors.length"
          :disable="disabled"
          options-dense
          dense
          outlined
        >
          <template v-slot:error>
            <div v-for="error of v$.estado_elemento.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-select>
      </div>

      <!-- Progresiva de entrada -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de entrada</label>
        <q-input
          v-model="registroTendido.progresiva_entrada"
          placeholder="Obligatorio"
          :error="!!v$.progresiva_entrada.$errors.length"
          :disable="disabled"
          type="number"
          outlined
          dense
        >
          <template v-slot:error>
            <div
              v-for="error of v$.progresiva_entrada.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Progresiva de salida -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de salida</label>
        <q-input
          v-model="registroTendido.progresiva_salida"
          placeholder="Obligatorio"
          :error="!!v$.progresiva_salida.$errors.length"
          :disable="disabled"
          type="number"
          outlined
          dense
        >
          <template v-slot:error>
            <div
              v-for="error of v$.progresiva_salida.$errors"
              :key="error.$uid"
            >
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>

      <!-- Se instalo manga -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="registroTendido.instalo_manga"
          label="Se instaló manga"
          :disable="disabled"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Se instalo reserva -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="registroTendido.instalo_reserva"
          label="Se instaló reserva"
          :disable="disabled"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad reservas -->
      <div v-if="registroTendido.instalo_reserva" class="col-12 col-md-3">
        <label class="q-mb-sm block">Reservas (metros)</label>
        <q-input
          v-model="registroTendido.cantidad_reserva"
          placeholder="Obligatorio"
          :disable="disabled"
          type="number"
          min="0"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del poste</label>
        <selector-imagen
          :imagen="registroTendido.imagen"
          @update:modelValue="(data) => (registroTendido.imagen = data)"
          :disable="disabled"
        ></selector-imagen>
      </div>

      <!-- Poste tiene transformador -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="registroTendido.tiene_transformador"
          label="Poste tiene transformador"
          :disable="disabled"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad transformadores -->
      <div v-if="registroTendido.tiene_transformador" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad transformadores</label>
        <q-input
          v-model="registroTendido.cantidad_transformadores"
          placeholder="Obligatorio"
          :disable="disabled"
          type="number"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Americano -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="registroTendido.tiene_americano"
          label="Americano"
          :disable="disabled"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Tension -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tensión</label>
        <q-select
          v-model="registroTendido.tension"
          :options="tiposTension"
          :disable="disabled"
          clearable
          options-dense
          dense
          outlined
        />
      </div>

      <!-- Poste tiene retenidas -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="registroTendido.tiene_retenidas"
          label="Poste tiene retenidas"
          :disable="disabled"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad retenidas -->
      <div v-if="registroTendido.tiene_retenidas" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad retenidas</label>
        <q-input
          v-model="registroTendido.cantidad_retenidas"
          type="number"
          placeholder="Obligatorio"
          :disable="disabled"
          min="0"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Observaciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Observaciones</label>
        <q-input
          v-model="registroTendido.observaciones"
          type="textarea"
          :disable="disabled"
          autogrow
          outlined
          dense
        ></q-input>
      </div>

      <!-- Fecha -->
      <!--<div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha</label>
        <q-input v-model="registroTendido.fecha" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="registroTendido.fecha" mask="DD-MM-YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div> -->

      <!-- Hora -->
      <!--<div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora</label>
        <q-input v-model="registroTendido.hora" mask="time" outlined dense>
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="registroTendido.hora" format24h now-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div> -->
    </div>

    <div
      v-if="registroTendido.tiene_americano"
      class="row q-col-gutter-sm q-py-md"
    >
      <div class="col-12">
        <div class="block text-bold q-mb-md">Americano</div>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Propietario</label>
        <q-input
          v-model="registroTendido.propietario"
          :disable="disabled"
          outlined
          dense
        ></q-input>
      </div>
    </div>

    <div
      v-if="registroTendido.tiene_americano"
      class="row q-col-gutter-sm q-py-md"
    >
      <!-- Foto americano -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del cruce americano</label>
        <selector-imagen
          :imagen="registroTendido.imagen_cruce_americano"
          @update:modelValue="
            (data) => (registroTendido.imagen_cruce_americano = data)
          "
          :disable="disabled"
        ></selector-imagen>
      </div>

      <div class="col-12 col-md-9">
        <label class="q-mb-sm block">Cooordenada del cruce americano</label>
        <div class="row q-col-gutter-xs">
          <q-input
            v-model="registroTendido.coordenada_cruce_americano_longitud"
            class="col-md-4"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            hint="Longitud"
            outlined
            dense
            disable
          >
          </q-input>

          <q-input
            v-model="registroTendido.coordenada_cruce_americano_latitud"
            class="col-md-4"
            hint="Latitud"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            outlined
            dense
            disable
          >
          </q-input>

          <span
            class="col-md-4"
            :class="{ 'full-width text-center q-mb-xs': $q.screen.xs }"
          >
            <q-btn
              color="positive"
              no-caps
              :class="{ 'q-mb-xs': $q.screen.xs }"
              @click="ubicacionCoordenadaAmericano()"
              :disable="disabled"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </span>
        </div>
      </div>
    </div>

    <!-- Poste anclaje 1 -->
    <div
      v-if="registroTendido.tiene_americano"
      class="row q-col-gutter-sm q-py-md"
    >
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del poste de anclaje 1</label>
        <selector-imagen
          :imagen="registroTendido.imagen_poste_anclaje1"
          @update:modelValue="
            (data) => (registroTendido.imagen_poste_anclaje1 = data)
          "
          :disable="disabled"
        ></selector-imagen>
      </div>

      <div class="col-12 col-md-9">
        <label class="q-mb-sm block">Cooordenadas del poste de anclaje 1</label>
        <div class="row q-col-gutter-xs">
          <q-input
            v-model="registroTendido.coordenada_poste_anclaje1_longitud"
            class="col-md-4"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            hint="Longitud"
            outlined
            dense
            disable
          >
          </q-input>

          <q-input
            v-model="registroTendido.coordenada_poste_anclaje1_latitud"
            class="col-md-4"
            hint="Latitud"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            outlined
            dense
            disable
          >
          </q-input>

          <span
            class="col-md-4"
            :class="{ 'full-width text-center q-mb-xs': $q.screen.xs }"
          >
            <q-btn
              color="positive"
              no-caps
              :class="{ 'q-mb-xs': $q.screen.xs }"
              @click="ubicacionCoordenadaPosteAnclaje1()"
              :disable="disabled"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </span>
        </div>
      </div>
    </div>

    <div
      v-if="registroTendido.tiene_americano"
      class="row q-col-gutter-sm q-py-md"
    >
      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del poste de anclaje 2</label>
        <selector-imagen
          :imagen="registroTendido.imagen_poste_anclaje2"
          @update:modelValue="
            (data) => (registroTendido.imagen_poste_anclaje2 = data)
          "
          :disable="disabled"
        ></selector-imagen>
      </div>

      <div class="col-12 col-md-9">
        <label class="q-mb-sm block">Cooordenadas del poste de anclaje 2</label>
        <div class="row q-col-gutter-xs">
          <q-input
            v-model="registroTendido.coordenada_poste_anclaje2_longitud"
            class="col-md-4"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            hint="Longitud"
            outlined
            dense
            disable
          >
          </q-input>

          <q-input
            v-model="registroTendido.coordenada_poste_anclaje2_latitud"
            class="col-md-4"
            hint="Latitud"
            :class="{ 'full-width q-mb-xs': $q.screen.xs }"
            outlined
            dense
            disable
          >
          </q-input>

          <span
            class="col-md-4"
            :class="{ 'full-width text-center q-mb-xs': $q.screen.xs }"
          >
            <q-btn
              color="positive"
              no-caps
              :class="{ 'q-mb-xs': $q.screen.xs }"
              @click="ubicacionCoordenadaPosteAnclaje2()"
              :disable="disabled"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </span>
        </div>
      </div>
    </div>
    {{ materiales }}
    <div class="row q-mb-md">
      <!-- Tabla -->
      <div class="col-12">
        <essential-table
          titulo="Materiales utilizados"
          :configuracionColumnas="configuracionColumnasMaterialOcupadoAccion"
          :datos="materiales"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarBotones="false"
          :alto-fijo="false"
          :accion1="botonEditarCantidad"
          @eliminar="eliminar"
        ></essential-table>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-fab
        icon="add"
        direction="up"
        vertical-actions-align="right"
        color="primary"
        label="Acciones"
        padding="sm lg"
      >
        <q-fab-action color="negative" @click="cerrar()" padding="sm md">
          <q-icon name="bi-x" size="xs" class="q-mr-sm"></q-icon>Cancelar
        </q-fab-action>

        <q-fab-action
          v-if="accion === acciones.editar"
          color="positive"
          @click="editarDatos(registroTendido)"
          padding="sm md"
        >
          <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>Guardar
          cambios
        </q-fab-action>

        <q-fab-action
          v-if="accion === acciones.nuevo"
          color="positive"
          @click="guardarDatos(registroTendido)"
          padding="sm md"
        >
          <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>Guardar
        </q-fab-action>
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script src="./RegistroTendidoPage.ts"></script>
