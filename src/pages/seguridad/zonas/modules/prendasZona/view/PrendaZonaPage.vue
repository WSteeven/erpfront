<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasPrendaZona"
    paginate
    full
  >
    <template #formulario>
      <q-expansion-item
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Agregar productos a la zona seleccionada"
        header-class="text-bold bg-solid text-primary"
        default-opened
        icon="bi-box-seam-fill"
      >
        <div class="row q-col-gutter-sm q-mb-md q-pa-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione una zona</label>
            <q-select
              v-model="prendaZona.zona"
              :options="zonas"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled || accion === acciones.editar"
              options-dense
              dense
              outlined
              :input-debounce="0"
              use-input
              @filter="filtrarZonas"
              @popup-show="ordenarLista(zonas, 'nombre')"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              :error="!!v$.zona.$errors.length || !!errorExisteZona"
              @blur="v$.zona.$touch"
              @update:model-value="consultarMiembrosZona(prendaZona.zona)"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Aún no se han agregado zonas
                  </q-item-section>
                </q-item>
              </template>

              <template #after>
                <q-btn
                  color="positive"
                  :icon="iconos.recargar"
                  @click="recargarListados()"
                  unelevated
                  dense
                >
                  <q-tooltip>Recargar zonas</q-tooltip>
                </q-btn>
              </template>

              <template v-slot:error>
                <small class="text-negative">
                  {{ errorExisteZona }}
                </small>
                <div v-for="error of v$.zona.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-9">
            <label class="q-mb-sm block"
              >Restricción de acceso a las prendas asignadas a la zona</label
            >
            <q-btn-toggle
              v-model="prendaZona.tiene_restricciones"
              class="toggle-button-primary"
              :disable="disabled || !!errorExisteZona"
              spread
              no-caps
              rounded
              toggle-color="primary"
              unelevated
              :options="[
                {
                  label:
                    'Todos los miembros tienen acceso a todos los productos asignados.',
                  value: false
                },
                {
                  label: 'Restringir acceso a los productos asignados.',
                  value: true
                }
              ]"
            />
          </div>

          <div
            v-if="listadosAuxiliares.miembrosZona.length"
            class="col-12 q-mb-md"
          >
            <div class="q-mb-md">
              Empleados asignados a la zona
              <q-icon name="bi-check-circle-fill" color="positive" />
            </div>
            <essential-table
              :configuracionColumnas="ccEmpleadoDesignado"
              :datos="listadosAuxiliares.miembrosZona"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitir-eliminar="false"
              :permitir-buscar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
              :mostrar-footer="false"
              :mostrar-header="false"
            >
            </essential-table>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Empleado propietario</label>
            <q-input
              v-model="criterioBusquedaEmpleado"
              placeholder="Escriba y presione enter para buscar"
              hint="Puede buscar por nombre, apellido o identificación"
              :disable="disabled"
              @keydown.enter="listarEmpleado"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon
                  :name="
                    prendaZona.empleado_id
                      ? 'bi-check-circle-fill'
                      : 'bi-check-circle'
                  "
                  :color="prendaZona.empleado_id ? 'positive' : 'grey-6'"
                  size="xs"
                ></q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Seleccione un cliente</label>
            <q-select
              v-model="prendaZona.cliente_id"
              :options="listadosAuxiliares.clientesMaterialesEmpleado"
              transition-show="scale"
              transition-hide="scale"
              use-input
              input-debounce="0"
              options-dense
              dense
              outlined
              :option-label="item => item.razon_social"
              :option-value="item => item.cliente_id"
              @update:model-value="seleccionarCliente()"
              emit-value
              map-options
            >
              <!-- <template v-slot:after>
                <q-btn
                  color="positive"
                  unelevated
                  dense
                  :disable="!prendaZona.empleado_id"
                  icon="bi-arrow-clockwise"
                  @click="consultarClientesMaterialesEmpleado('clientes')"
                >
                  <q-tooltip>Recargar clientes</q-tooltip>
                </q-btn>
              </template> -->

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Primero seleccione un empleado propietario
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12">
            <label class="q-mb-sm block"
              >Agregar productos a la zona seleccionada</label
            >
          </div>
          <div class="col-12 q-mb-md">
            <q-input
              v-model="criterioBusquedaDetalleProducto"
              :disable="disabled"
              placeholder="Nombre de producto"
              hint="Presiona Enter para seleccionar un producto"
              @keydown.enter="
                listarDetalleProducto({
                  empleado_id: prendaZona.empleado_id,
                  cliente_id: prendaZona.cliente_id,
                  search: criterioBusquedaDetalleProducto
                })
              "
              @blur="
                criterioBusquedaDetalleProducto === ''
                  ? limpiarProducto()
                  : null
              "
              outlined
              clearable
              dense
            >
              <template #after>
                <q-btn
                  @click="
                    listarDetalleProducto({
                      empleado_id: prendaZona.empleado_id,
                      cliente_id: prendaZona.cliente_id,
                      search: criterioBusquedaDetalleProducto
                    })
                  "
                  icon="search"
                  unelevated
                  color="positive"
                  :disable="disabled"
                  no-caps
                  >Buscar</q-btn
                >
              </template>
            </q-input>
          </div>

          <!-- Tabla -->
          <div class="col-12">
            <essential-table
              titulo="Productos asignados a la zona"
              :configuracionColumnas="
                configuracionColumnasProductosSeleccionados
              "
              :datos="prendaZona.detalles_productos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitir-buscar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
              @eliminar="eliminarDetalleProductoSeleccionado"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        v-if="prendaZona.tiene_restricciones"
        class="overflow-hidden q-mb-md rounded bg-desenfoque-2"
        label="Restringir acceso a los productos asignados a la zona."
        header-class="text-bold bg-solid text-primary"
        default-opened
        icon="bi-shield-fill-check"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <label class="q-mb-sm block"
              >Seleccione un miembro de la zona</label
            >
            <q-select
              v-model="prendaZona.miembro_zona"
              :options="listadosAuxiliares.miembrosZona"
              transition-show="scale"
              transition-hide="scale"
              @update:model-value="
                obtenerPrendasAsignadas(prendaZona.miembro_zona)
              "
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              :option-label="v => v.empleado"
              :option-value="v => v.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Aún no se han agregado miembros a la zona
                  </q-item-section>
                </q-item>
              </template>

              <template #after>
                <q-btn
                  color="positive"
                  :icon="iconos.recargar"
                  @click="consultarMiembrosZona(prendaZona.zona)"
                  unelevated
                  dense
                >
                  <q-tooltip>Recargar miembros de la zona</q-tooltip>
                </q-btn>
              </template>
            </q-select>
          </div>
        </div>

        <div
          v-show="prendaZona.miembro_zona"
          class="row q-col-gutter-sm q-mb-md q-pa-md"
        >
          <div class="col-12 col-md-5 q-gutter-y-sm">
            <div class="q-mb-sm text-center">
              <q-icon name="bi-person-fill-dash" color="negative" size="sm" />
            </div>
            <essential-table
              titulo="Listado de prendas no asignadas"
              :configuracionColumnas="
                configuracionColumnasRestriccionPrendaZona
              "
              :datos="prendasSinAsignar"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarFooter="true"
              :mostrarColumnasVisibles="false"
              ajustar-celdas
              :mostrar-exportar="false"
              ref="refPrendasSinAsignar"
              @selected="asignarPrenda"
              tipo-seleccion="multiple"
            >
            </essential-table>
          </div>

          <div class="col-md-2 column justify-center q-gutter-y-sm">
            <q-btn
              class="full-width block"
              color="positive"
              @click="btnAsignarPrendas()"
              unelevated
              glossy
              rounded
              ><q-icon name="bi-arrow-right"></q-icon
            ></q-btn>
            <q-btn
              class="full-width block"
              color="negative"
              @click="btnQuitarPrendas()"
              glossy
              unelevated
              rounded
              ><q-icon name="bi-arrow-left"></q-icon
            ></q-btn>
          </div>

          <div class="col-12 col-md-5 q-mb-md">
            <div class="q-mb-sm text-center">
              <q-icon name="bi-person-fill-check" color="positive" size="sm" />
            </div>
            <essential-table
              titulo="Listado de prendas asignadas"
              :configuracionColumnas="
                configuracionColumnasRestriccionPrendaZona
              "
              :mostrarColumnasVisibles="false"
              :datos="prendasAsignadas"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrar-exportar="false"
              ajustar-celdas
              ref="refPrendasAsignadas"
              @selected="quitarPrendas"
              tipo-seleccion="multiple"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>
    </template>

    <template #modales>
      <!-- Modal de seleccion de detalles -->
      <essential-selectable-table
        ref="refListadoSeleccionableDetalleProducto"
        :configuracion-columnas="configuracionColumnasDetallesModal"
        :datos="listadoDetalleProducto"
        tipo-seleccion="multiple"
        @selected="seleccionarDetalleProducto"
      ></essential-selectable-table>

      <essential-selectable-table
        ref="refListadoSeleccionableEmpleado"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listadoEmpleado"
        @selected="
          d => {
            seleccionarEmpleado(d)
            consultarClientesMaterialesEmpleado({
              empleado_id: prendaZona.empleado_id
            })
          }
        "
        tipo-seleccion="single"
      ></essential-selectable-table>
    </template>
  </tab-layout>
</template>

<script src="./PrendaZonaPage.ts"></script>
