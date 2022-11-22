<template>
  <div class="q-pa-md">
    <!-- encabezado -->
    <div class="row q-col-gutter-sm q-py-lg">
      <!-- N° transaccion -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Transacción N°</label></strong>
        <q-input v-model="transaccion.id" readonly borderless dense />
      </div>
      <!-- Fecha de transaccion -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Fecha de solicitud</label></strong>
        <q-input v-model="transaccion.created_at" readonly borderless dense />
      </div>
      <!-- fecha límite -->
      <div v-if="(transaccion.fecha_limite = !'N/A')" class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Tipo</label></strong>
        <q-input v-model="transaccion.fecha_limite" dense readonly borderless />
      </div>
      <!-- tipo -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Tipo</label></strong>
        <q-select
          v-model="transaccion.tipo"
          :options="opciones_tipos"
          :option-label="(v) => v.nombre"
          :option-value="(v) => v.id"
          emit-value
          map-options
          dense
          borderless
          readonly
        >
        </q-select>
      </div>
      <!-- subtipo -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Subtipo</label> </strong>
        <q-select
          v-model="transaccion.subtipo"
          :options="opciones_subtipos"
          :option-label="(v) => v.nombre"
          :option-value="(v) => v.id"
          emit-value
          map-options
          dense
          borderless
          readonly
        />
      </div>
      <!-- Solicitante -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Solicitante</label></strong>
        <q-input v-model="transaccion.solicitante" readonly borderless dense />
      </div>
      <!-- autorizacion -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Autorización</label> </strong>
        <q-select
          v-model="transaccion.autorizacion"
          :options="opciones_autorizaciones"
          :option-label="(v) => v.nombre"
          :option-value="(v) => v.id"
          emit-value
          map-options
          dense
          borderless
          readonly
        />
      </div>
      <!-- sucursal -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Sucursal</label> </strong>
        <q-select
          v-model="transaccion.sucursal"
          :options="opciones_sucursales"
          :option-label="(v) => v.lugar"
          :option-value="(v) => v.id"
          emit-value
          map-options
          dense
          borderless
          readonly
        />
      </div>
      <!-- Justificacion -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Justificación</label></strong>
        <q-input
          v-model="transaccion.justificacion"
          readonly
          borderless
          dense
        />
      </div>
      <!-- Persona que retira -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Persona que retira</label></strong>
        <q-select
          v-model="transaccion.per_retira"
          :options="opciones_empleados"
          :option-label="(v) => v.nombres + ' ' + v.apellidos"
          :option-value="(v) => v.id"
          map-options
          borderless
          dense
          readonly
        />
      </div>
      <!-- Estado -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Estado</label></strong>
        <q-select
          v-model="transaccion.estado"
          :options="opciones_estados"
          :option-label="(v) => v.nombre"
          :option-value="(v) => v.id"
          map-options
          borderless
          dense
          readonly
          options-dense
        />
      </div>
      <!-- Cliente -->
      <div class="col-12 col-md-2">
        <strong><label class="q-mb-sm block">Cliente</label></strong>
        <q-select
          v-model="cliente"
          :options="opciones_clientes"
          error-message="Debes seleccionar el propietario de los materiales"
          :option-label="(v) => v.razon_social"
          :option-value="(v) => v.id"
          @update:model-value="clienteSeleccionado"
          emit-value
          borderless
          map-options
          dense
          filled
          options-dense
        >
        </q-select>
      </div>
      <!-- Listado del pedido -->
      <div class="col-12 col-md-12">
            <q-table
              flat
              title="Listado"
              class="bg-white custom-border"
              :rows="transaccion.listadoProductosSeleccionados"
              :columns="configuracionColumnasListadoProductosSeleccionados"
              row-key="id"
              selection="single"
              :hide-bottom="true"
              dense
              v-model:selected="selected"
              @selection="buscarProductoEnInventario"
            />
          </div>
    </div>
    <!-- fin de encabezado -->
    <q-stepper v-model="step" ref="stepper" color="primary" header-nav animated @click="onComplete">
      <q-step
        :name="1"
        title="Selecciona los items del inventario"
        icon="settings"
        :error="
          transaccion.listadoProductosSeleccionados.length > selected2.length
        "
        :done="step > 1"
      >
        <!-- :error="step<3" -->
        <!-- listados -->
        <div class="row q-col-gutter-sm q-py-lg">
          <!-- Listado de coincidencias -->
          <div class="col-12 col-md-12">
            <q-table
              flat
              title="Coincidencias"
              class="bg-white custom-border"
              :rows="resultadosInventario"
              :columns="configuracionColumnasItemsEncontradosInventario"
              row-key="id"
              selection="multiple"
              dense
              v-model:selected="selected2"
            />
            <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected2) }}</div> -->
            Cantidad de items: {{ selected2.length }}
          </div>
        </div>
      </q-step>
      <q-step
        :name="2"
        title="Crea el movimiento"
        icon="create_new_folder"
        :done="step > 2"
      >
        <q-table
          flat
          title="Movimiento"
          class="bg-white custom-border"
          :rows="selected2"
          :columns="configuracionColumnasItemsMovimiento"
          row-key="id"
          dense :hide-bottom="true"
          >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="producto" :props="props">{{ props.row.producto }}</q-td>
              <q-td key="detalle_id" :props="props">{{ props.row.detalle_id }}</q-td>
              <q-td key="cliente_id" :props="props">{{ props.row.cliente_id }}</q-td>
              <q-td key="sucursal_id" :props="props">{{ props.row.sucursal_id }}</q-td>
              <q-td key="cantidad" :props="props">
                {{ props.row.cantidad }}
                <q-popup-edit v-model="props.row.cantidad" title="Update cantidad" buttons v-slot="scope">
                  <q-input type="number" v-model="scope.value" dense autofocus />
                </q-popup-edit>
              </q-td>
              <q-td key="precio_unitario" :props="props">
                {{ props.row.precio_unitario }}
                <q-popup-edit v-model="props.row.precio_unitario" title="Update Precio de venta" v-slot="scope">
                  <q-input type="number" v-model="scope.value" dense autofocus/>
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-step>
      <!-- <q-step :name="3" title="Create an ad" icon="add_comment">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam cupiditate
        adipisci perferendis earum, tenetur ad officiis nemo maiores libero a
        excepturi, ullam vel. Maxime iusto, laboriosam eos similique corrupti
        autem.</q-step
      > -->
      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="$refs.stepper.next"
            @click="$refs.stepper.next()"
            color="primary"
            :label="step === 2 ? 'Finish' : 'Continue'"
          />
          <q-btn v-if="step===2" color="primary" @click="onComplete()" label="Finalizar"/>
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>
<script src="./DespacharPage.ts" />
