<template>
  <q-page padding>
    <b>Detalles del elemento</b>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Coordenada elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cooordenada del elemento</label>
        <q-input
          v-model="tendido.coordenada_del_elemento"
          outlined
          dense
          disable
          autogrow
        >
          <template #after>
            <q-btn
              color="positive"
              no-caps
              @click="ubicacionCoordenadaElemento()"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </template>
        </q-input>
      </div>

      <!-- Tipo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de elemento</label>
        <q-select
          v-model="tendido.tipo_elemento"
          :options="tiposElementos"
          options-dense
          dense
          outlined
        />
      </div>

      <!-- Numero elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Número del elemento</label>
        <q-input
          v-model="tendido.numero_poste"
          placeholder="Obligatorio"
          type="number"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Codigo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Código y numeración de poste o pozo</label>
        <q-input
          v-model="tendido.codigo_poste"
          placeholder="Obligatorio"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Propietario del elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Propietario del elemento</label>
        <q-select
          v-model="tendido.propietario_elemento"
          :options="propietariosElementos"
          :error="!!v$.propietario_elemento.$errors.length"
          options-dense
          dense
          outlined
        >
        </q-select>
      </div>

      <!-- Estado del elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estado del elemento</label>
        <q-select
          v-model="tendido.estado_elemento"
          :options="estadoElementos"
          options-dense
          dense
          outlined
        />
      </div>

      <!-- Progresiva de entrada -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de entrada</label>
        <q-input
          v-model="tendido.progresiva_entrada"
          placeholder="Obligatorio"
          type="number"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Progresiva de salida -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de salida</label>
        <q-input
          v-model="tendido.progresiva_salida"
          placeholder="Obligatorio"
          type="number"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Se instalo manga -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="tendido.instalo_manga"
          label="Se instaló manga"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Se instalo reserva -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="tendido.instalo_reserva"
          label="Se instaló reserva"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad reservas -->
      <div v-if="tendido.instalo_reserva" class="col-12 col-md-3">
        <label class="q-mb-sm block">Reservas (metros)</label>
        <q-input
          v-model="tendido.cantidad_reservas"
          placeholder="Obligatorio"
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
          :imagen="tendido.imagen"
          @update:modelValue="(data) => (tendido.imagen = data)"
        ></selector-imagen>
      </div>

      <!-- Poste tiene transformador -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="tendido.tiene_transformador"
          label="Poste tiene transformador"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad transformadores -->
      <div v-if="tendido.tiene_transformador" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad transformadores</label>
        <q-input
          v-model="tendido.cantidad_transformadores"
          placeholder="Obligatorio"
          type="number"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Americano -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="tendido.americano"
          label="Americano"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Tipo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tensión</label>
        <q-select
          v-model="tendido.tension"
          :options="tiposTension"
          clearable
          options-dense
          dense
          outlined
        />
      </div>

      <!-- Poste tiene retenidas -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="tendido.tiene_retenidas"
          label="Poste tiene retenidas"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad retenidas -->
      <div v-if="tendido.tiene_retenidas" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad retenidas</label>
        <q-input
          v-model="tendido.cantidad_retenidas"
          type="number"
          placeholder="Obligatorio"
          min="0"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Observaciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Observaciones</label>
        <q-input
          v-model="tendido.observaciones"
          type="textarea"
          autogrow
          outlined
          dense
        ></q-input>
      </div>

      <!-- Fecha -->
      <!--<div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha</label>
        <q-input v-model="tendido.fecha" outlined dense>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="tendido.fecha" mask="DD-MM-YYYY">
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
        <q-input v-model="tendido.hora" mask="time" outlined dense>
          <template v-slot:append>
            <q-icon name="bi-clock" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time v-model="tendido.hora" format24h now-btn>
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

    <div v-if="tendido.americano" class="row q-col-gutter-sm q-py-md">
      <div class="col-12">
        <div class="block text-bold q-mb-md">Americano</div>
      </div>

      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Propietario</label>
        <q-input v-model="tendido.propietario" outlined dense></q-input>
      </div>

      <!-- Coordenada cruce americano -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cooordenada del cruce americano</label>
        <q-input
          v-model="tendido.coordenada_cruce_americano"
          outlined
          dense
          disable
          autogrow
        >
          <template #after>
            <q-btn
              color="positive"
              no-caps
              @click="ubicacionCoordenadaAmericano()"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </template>
        </q-input>
      </div>

      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del cruce americano</label>
        <selector-imagen
          :imagen="tendido.imagen_cruce_americano"
          @update:modelValue="(data) => (tendido.imagen_cruce_americano = data)"
        ></selector-imagen>
      </div>

      <!-- Coordenada poste 1 -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cooordenada del poste de anclaje 1</label>
        <q-input
          v-model="tendido.coordenada_poste_anclaje1"
          outlined
          dense
          disable
          autogrow
        >
          <template #after>
            <q-btn
              color="positive"
              no-caps
              @click="ubicacionCoordenadaPosteAnclaje1()"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </template>
        </q-input>
      </div>

      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del poste de anclaje 1</label>
        <selector-imagen
          :imagen="tendido.imagen_poste_anclaje1"
          @update:modelValue="(data) => (tendido.imagen_poste_anclaje1 = data)"
        ></selector-imagen>
      </div>

      <!-- Coordenada poste 2 -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cooordenada del poste de anclaje 2</label>
        <q-input
          v-model="tendido.coordenada_poste_anclaje2"
          outlined
          dense
          disable
          autogrow
        >
          <template #after>
            <q-btn
              color="positive"
              no-caps
              @click="ubicacionCoordenadaPosteAnclaje2()"
            >
              <q-icon name="bi-geo-alt" size="xs" class="q-mr-xs"></q-icon>
              Actualizar ubicación</q-btn
            >
          </template>
        </q-input>
      </div>

      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fotografía del poste de anclaje 2</label>
        <selector-imagen
          :imagen="tendido.imagen_poste_anclaje2"
          @update:modelValue="(data) => (tendido.imagen_poste_anclaje2 = data)"
        ></selector-imagen>
      </div>
    </div>

    <div class="row">
      <!-- Selector de productos -->
      <!--<div class="col-12">
        <label class="q-mb-sm block">Agregar productos</label>
        <div class="row q-col-gutter-xs">
          <div class="col-12 col-md-10 q-mb-md">
            <q-input
              v-model="criterioBusquedaProducto"
              placeholder="Nombre de producto"
              @update:model-value="
                (v) => (criterioBusquedaProducto = v.toUpperCase())
              "
              hint="Presiona Enter para seleccionar un producto"
              @keydown.enter="listarProductos()"
              @blur="criterioBusquedaProducto === '' ? limpiarProducto() : null"
              outlined
              dense
            >
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-btn
              @click="listarProductos()"
              icon="search"
              color="secondary"
              class="full-width"
              style="height: 40px"
              unelevated
              no-caps
              >Buscar</q-btn
            >
          </div>
        </div>
      </div> -->

      <!-- Tabla -->
      <div class="col-12">
        <essential-table
          titulo="Materiales utilizados"
          :configuracionColumnas="
            configuracionColumnasProductosSeleccionadosAccion
          "
          :datos="tendido.listadoProductosSeleccionados"
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

    <essential-selectable-table
      ref="refListadoSeleccionableProductos"
      :configuracion-columnas="configuracionColumnasProductosSeleccionados"
      :datos="listadoProductos"
      @selected="seleccionarProducto"
      tipoSeleccion="multiple"
    >
    </essential-selectable-table>
  </q-page>
</template>

<script src="./RegistroTendidoPage.ts"></script>
