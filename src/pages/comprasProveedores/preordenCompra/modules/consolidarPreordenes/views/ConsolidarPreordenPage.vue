<template>
    <essential-selectable-table
        ref="refListado"
        :configuracion-columnas="configuracionColumnasItemsPreorden"
        :datos="listado"
        tipo-seleccion="multiple"
        @selected="seleccionarProducto"
    />
</template>

<script src="./ConsolidarPreordenPage.ts"></script>