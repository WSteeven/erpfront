<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores Internacionales"
    :tab-options="tabOptions"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarProveedores"
    puedeExportar
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información General"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Nombre del proveedor -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Razón Social</label>
              <q-input
                v-model="proveedor.nombre"
                placeholder="Obligatorio"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!--Tipo de contribuyente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Tipo de Contribuyente</label>
              <q-select
                v-model="proveedor.tipo"
                :options="opcionesTipoContribuyente"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.tipo.$errors.length"
                error-message="Debes seleccionar un elemento"
                :option-value="v => v.value"
                :option-label="v => v.label"
                emit-value
                map-options
              >
                <template v-slot:error>
                  <div v-for="error of v$.tipo.$errors" :key="error.$uid">
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

            <!-- identificacion-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Identificacion/RUC</label>
              <q-input
                v-model="proveedor.ruc"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!--Pais -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">País</label>
              <q-select
                v-model="proveedor.pais"
                :options="paises"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarPaises"
                :option-value="v => v.id"
                :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
                :error="!!v$.pais.$errors.length"
                emit-value
                map-options
                ><template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.pais }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.abreviatura
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:error>
                  <div v-for="error of v$.pais.$errors" :key="error.$uid">
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

            <!-- Direccion -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="proveedor.direccion"
                placeholder="Obligatorio"
                :disable="disabled"
                 :error="!!v$.direccion.$errors.length"
                dense
                outlined
              >
              <template v-slot:error>
                  <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
            </q-input>
            </div>

            <!-- telefono -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Telefono
                <q-tooltip>Con codigo de país, ejm (+593)</q-tooltip></label
              >
              <q-input
                v-model="proveedor.telefono"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!-- Correo -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Correo</label>
              <q-input
                type="email"
                v-model="proveedor.correo"
                placeholder="Obligatorio"
                :disable="disabled"
                :error="!!v$.correo.$errors.length"
                dense
                outlined
              >
              <template v-slot:error>
                  <div v-for="error of v$.correo.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template></q-input>
            </div>

            <!-- Sitio web -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Página web</label>
              <q-input
                v-model="proveedor.sitio_web"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Datos Bancarios"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <div class="col-12 col-md-3" v-if="!mostrarSegundaFilaCuentaBancaria">
              <q-btn
                color="positive"
                unelevated
                @click="() => (mostrarSegundaFilaCuentaBancaria = true)"
                ><q-icon name="bi-plus" /> Agregar</q-btn
              >
            </div>
            <div class="col-12 col-md-3" v-if="mostrarSegundaFilaCuentaBancaria">
              <q-btn
                color="negative"
                unelevated
                @click="() => (mostrarSegundaFilaCuentaBancaria = false)"
                ><q-icon name="bi-dash" /> Quitar</q-btn
              >
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Nombre del banco -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Banco</label>
              <q-input
                v-model="proveedor.banco1"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!-- numero de cuenta -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">N° Cuenta</label>
              <q-input
                v-model="proveedor.numero_cuenta1"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- codigo swift -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código SWIFT</label>
              <q-input
                v-model="proveedor.codigo_swift1"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!-- moneda -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Moneda</label>
              <q-input
                v-model="proveedor.moneda1"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>
          </div>

          <!-- Segunda fila de datos bancarios -->
          <div class="row q-col-gutter-sm q-pa-sm" v-if="mostrarSegundaFilaCuentaBancaria">
            <!-- Nombre del banco -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Banco</label>
              <q-input
                v-model="proveedor.banco2"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!-- numero de cuenta -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">N° Cuenta</label>
              <q-input
                v-model="proveedor.numero_cuenta2"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- codigo swift -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código SWIFT</label>
              <q-input
                v-model="proveedor.codigo_swift2"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>

            <!-- moneda -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Moneda</label>
              <q-input
                v-model="proveedor.moneda2"
                placeholder="Opcional"
                :disable="disabled"
                dense
                outlined
              ></q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./ProveedorInternacionalPage.ts" />
