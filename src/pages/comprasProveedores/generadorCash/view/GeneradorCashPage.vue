<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasGeneradorCash"
    :permitir-eliminar="false"
    :accion1="btnDuplicar"
    :accion2="btnGenerarCash"
    :accion3="btnGenerarCashTxt"
  >
    <template #formulario>
      <div class="row q-col-gutter-sm q-mb-md">
        <!-- Observacion -->
        <div class="col-12 col-md-4">
          <label class="q-mb-sm block">Titulo del documento</label>
          <q-input
            v-model="generador.titulo"
            placeholder="Obligatorio"
            :disable="disabled"
            outlined
            dense
            :error="!!v$.titulo.$errors.length"
            @blur="v$.titulo.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <essential-table
            titulo="Pagos"
            :configuracionColumnas="configuracionColumnasPagoAccion"
            :datos="generador.pagos"
            ajustar-celdas
            :disable="disabled"
            :grid="false"
            :alto-fijo="false"
            :accion1Header="btnAgregarPago"
            :accion2Header="btnGestionarBeneficiarios"
            permitirEditarCeldas
            :permitir-consultar="false"
            :permitir-editar="false"
            :permitir-eliminar="!disabled"
            :permitir-buscar="false"
            @eliminar="btnEliminarPago"
            :v$="v$"
            key-error="pagos"
          ></essential-table>
        </div>

        <div class="col-12">
          <callout
            tipo="info"
            mensaje="Use el método rápido de búsqueda presionando <b>ENTER</b> luego de escribir el texto a buscar. También puede buscar presionando el botón de lupa <img src='src\assets\img\boton-lupa.png' width='20px' />."
          ></callout>
        </div>
      </div>
    </template>
  </tab-layout>

  <essential-selectable-table
    ref="refListadoSeleccionable"
    :configuracion-columnas="configuracionColumnasBeneficiarios"
    :datos="listado"
    @selected="seleccionar"
    tipo-seleccion="single"
  ></essential-selectable-table>

  <essential-selectable-table
    ref="refListadoSeleccionableCuentasBancarias"
    :configuracion-columnas="configuracionColumnasCuentaBancariaSelectable"
    :datos="listadoCuentasBancarias"
    @selected="seleccionarCuentasBancarias"
    tipo-seleccion="single"
  ></essential-selectable-table>

  <modales-entidad
    :comportamiento="modales"
    :mixin-modal="mixin"
    :persistent="false"
    @guardado="listar"
  />
</template>

<script src="./GeneradorCashPage.ts"></script>
