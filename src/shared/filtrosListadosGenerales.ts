import { Empresa } from "pages/administracion/empresas/domain/Empresa";
import { Ref, ref } from "vue";
import { ordenarLista, ordernarListaString } from "./utils";
import { Banco } from "pages/recursosHumanos/banco/domain/Banco";
import { CategoriaOferta } from "pages/comprasProveedores/categoriaOfertas/domain/CategoriaOferta";
import { Producto } from "pages/bodega/productos/domain/Producto";
import { Canton } from "sistema/ciudad/domain/Canton";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { Cliente } from "sistema/clientes/domain/Cliente";

export const useFiltrosListadosSelects = (listadosAuxiliares, entidad?: Ref<any>) => {
  /**************************************************************
   * Variables
   **************************************************************/
  const paises = ref(listadosAuxiliares.paises)
  const productos = ref(listadosAuxiliares.productos)
  const provincias = ref(listadosAuxiliares.provincias)
  const cantones = ref(listadosAuxiliares.cantones)
  const parroquias = ref(listadosAuxiliares.parroquias)
  const empresas = ref(listadosAuxiliares.empresas)
  const proveedores = ref(listadosAuxiliares.proveedores)
  const clientes = ref(listadosAuxiliares.clientes)
  const empleados = ref(listadosAuxiliares.empleados)
  const bancos = ref(listadosAuxiliares.bancos)
  const categorias = ref(listadosAuxiliares.categorias)

  //bodega
  const sucursales = ref(listadosAuxiliares.sucursales)
  const motivos = ref(listadosAuxiliares.motivos)

  // tareas
  const proyectos = ref(listadosAuxiliares.proyectos)
  const etapas = ref(listadosAuxiliares.etapas)
  const tareas = ref(listadosAuxiliares.tareas)
  const tareasDestino = ref(listadosAuxiliares.tareasDestino)


  /**************************************************************
   * Funciones
   **************************************************************/

  /**
   * Esta función filtra una lista de países en función de una consulta de búsqueda y actualiza la
   * lista en consecuencia.
   * @param val - val es un parámetro de cadena que representa el valor que se utilizará para filtrar
   * la lista de países.
   * @param update - "actualizar" es una función que se utiliza para actualizar el valor de la variable
   * reactiva "paises". Es probable que sea una función proporcionada por un marco Vue.js o React.
   * @returns Si el parámetro `val` es una cadena vacía, la función no devuelve nada (`undefined`). De
   * lo contrario, actualiza el valor de `paises` y no devuelve nada (`undefined`).
   */
  function filtrarPaises(val, update) {
    if (val === '') {
      update(() => paises.value = listadosAuxiliares.paises)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      paises.value = listadosAuxiliares.paises.filter((v) => v.pais.toLowerCase().indexOf(needle) > -1)
    })
  }


  /**
   * La función filtra una lista de provincias en función de un valor de búsqueda determinado.
   * @param val - El valor de entrada para filtrar la lista de provincias.
   * @param update - update es una función que se utiliza para actualizar el valor de la variable
   * reactiva "provincias". Toma como argumento una función de devolución de llamada, que se ejecuta
   * para actualizar el valor de "provincias". La función de devolución de llamada se ejecuta de forma
   * asíncrona, lo que significa que el valor actualizado de "provincias
   * @returns La función no devuelve nada, actualiza el valor de la variable `provincias`.
   */
  function filtrarProvincias(val, update) {
    if (val === '') {
      update(() => provincias.value = listadosAuxiliares.provincias)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.provincias) provincias.value = listadosAuxiliares.provincias.filter((v) => v.provincia.toLowerCase().indexOf(needle) > -1)
    })
  }


  /**
   * Esta función filtra una lista de cantones en función de un valor determinado y actualiza la lista
   * en consecuencia.
   * @param val - val es un parámetro de cadena que representa el valor que se va a filtrar.
   * @param update - update es una función que se utiliza para actualizar el valor de la variable
   * cantones. Toma una función de devolución de llamada como argumento, que se ejecuta para actualizar
   * el valor de los cantones. El propósito de usar update es asegurar que el valor de los cantones se
   * actualice de forma reactiva, de modo que
   * @returns La función no devuelve nada explícitamente, pero devuelve el control a la función de
   * llamada después de ejecutar su lógica.
   */
  function filtrarCantones(val, update) {
    if (val === '') {
      update(() => cantones.value = listadosAuxiliares.cantones)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.cantones) cantones.value = listadosAuxiliares.cantones.filter(
        (v) => v.canton.toLowerCase().indexOf(needle) > -1
      )
    })
  }
  function ordenarCantones() {
    cantones.value.sort((a: Canton, b: Canton) => ordernarListaString(a.canton!, b.canton!))
  }


  /**
   * Esta función filtra una lista de parroquias según un valor de búsqueda dado.
   * @param val - Un valor de cadena que representa la consulta de búsqueda para filtrar la lista de
   * parroquias.
   * @param update - una función que actualiza el valor de la variable reactiva "parroquias". Se pasa
   * como parámetro a la función "filtrarParroquias" y se llama usando la función "update" de Vue.js.
   * @returns La función no devuelve nada explícitamente, pero devuelve el control a la función de
   * llamada después de ejecutar su lógica.
   */
  function filtrarParroquias(val, update) {
    if (val === '') {
      update(() => parroquias.value = listadosAuxiliares.parroquias)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.parroquias) parroquias.value = listadosAuxiliares.parroquias.filter(
        (v) => v.parroquia.toLowerCase().indexOf(needle) > -1
      )
    })
  }

  function filtrarProductos(val, update) {
    if (val === '' || val === undefined) {
      update(() => productos.value = listadosAuxiliares.productos)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.productos) productos.value = listadosAuxiliares.productos.filter((v: Producto) => v.nombre!.toLowerCase().indexOf(needle) > -1)
    })
  }

  /**
   * La función filtra una lista de empresas en función de un valor de búsqueda y actualiza la lista en
   * consecuencia.
   * @param val - val es un parámetro que representa el valor que se busca en la lista de empresas. Es
   * una cadena que se convierte a minúsculas antes de usarse en la función de filtro.
   * @param update - `update` es una función que se utiliza para actualizar el valor de `empresas`. Se
   * pasa como parámetro a `filtrarEmpresas` para que pueda ser llamado después de que se complete la
   * operación de filtrado. Esto es necesario porque `empresas` es probablemente una variable reactiva
   * que está siendo
   * @returns La función no devuelve nada explícitamente, pero devuelve el control a la función de
   * llamada después de ejecutar su lógica.
   */
  function filtrarEmpresas(val, update) {
    if (val === '') {
      update(() => empresas.value = listadosAuxiliares.empresas)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.empresas) empresas.value = listadosAuxiliares.empresas.filter((v) => v.razon_social.toLowerCase().indexOf(needle) > -1 || v.nombre_comercial?.toLowerCase().indexOf(needle) > -1)
    })
  }

  function ordenarEmpresas() {
    empresas.value.sort((a: Empresa, b: Empresa) => ordernarListaString(a.razon_social!, b.razon_social!))
  }

  /**
   * Esta función filtra una lista de proveedores en función de un valor de búsqueda y actualiza la
   * lista filtrada.
   * @param val - El valor que se utilizará para filtrar la lista de proveedores. Es una cadena que se
   * convertirá a minúsculas para el filtrado que no distingue entre mayúsculas y minúsculas.
   * @param update - update es una función que se utiliza para actualizar el valor de la variable
   * "proveedores". Se pasa como parámetro a la función "filtrarProveedores" y se llama usando la
   * sintaxis de la función flecha para actualizar el valor de "proveedores" según los criterios de
   * filtrado.
   * @returns nada (indefinido). Está utilizando la función `update` para modificar el valor de
   * `proveedores` en función de la entrada `val` y la matriz `listadosAuxiliares.proveedores`.
   */
  function filtrarProveedores(val, update) {
    if (val == '') {
      update(() => proveedores.value = listadosAuxiliares.proveedores)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      if (listadosAuxiliares.proveedores) proveedores.value = listadosAuxiliares.proveedores.filter((v) => v.razon_social.toLowerCase().indexOf(needle) > -1 || v.sucursal.toLowerCase().indexOf(needle) > -1 || v.nombre_comercial?.toLowerCase().indexOf(needle) > -1)
    })
  }

  /* The `filtrarClientes` function is used to filter a list of clients based on a given search value. */
  clientes.value = listadosAuxiliares.clientes
  function filtrarClientes(val, update) {
    return filtrarLista(val, update, clientes, 'razon_social', listadosAuxiliares.clientes)
  }
  function ordenarClientes() {
    ordenarLista(clientes.value, 'razon_social')
  }

  function filtrarEmpleados(val, update) {
    if (val === '') {
      update(() => {
        empleados.value = listadosAuxiliares.empleados
      })
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
    })
  }
  function ordenarEmpleados() {
    empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
  }

  function filtrarBancos(val, update) {
    if (val === '') {
      update(() => {
        bancos.value = listadosAuxiliares.bancos
      })
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      bancos.value = listadosAuxiliares.bancos.filter((v: Banco) => v.nombre!.toLowerCase().indexOf(needle) > -1)
    })
  }

  function filtrarCategoriasProveedor(val, update) {
    if (val === '') {
      update(() => categorias.value = listadosAuxiliares.categorias)
      return
    }
    update(() => {
      const needle = val.toLowerCase()
      categorias.value = listadosAuxiliares.categorias.filter((v: CategoriaOferta) => v.nombre!.toLowerCase().indexOf(needle) > -1)
    })
  }
  function ordenarCategorias() {
    categorias.value.sort((a: CategoriaOferta, b: CategoriaOferta) => ordernarListaString(a.nombre!, b.nombre!))
  }

  function filtrarMotivos(val, update) {
    return filtrarLista(val, update, motivos, 'nombre', listadosAuxiliares.motivos)
  }
  function filtrarSucursales(val, update) {
    return filtrarLista(val, update, sucursales, 'lugar', listadosAuxiliares.sucursales)
  }

  function filtrarProyectos(val, update) {
    return filtrarLista(val, update, proyectos, 'codigo_proyecto', listadosAuxiliares.proyectos)
  }
  function filtrarEtapas(val, update) {
    return filtrarLista(val, update, etapas, 'nombre', listadosAuxiliares.etapas)
  }
  function filtrarTareas(val, update) {
    return filtrarLista(val, update, tareas, 'codigo_tarea', listadosAuxiliares.tareas)
  }
  function filtrarTareasDestino(val, update) {
    return filtrarLista(val, update, tareasDestino, 'codigo_tarea', listadosAuxiliares.tareasDestino)
  }


  function filtrarLista(val, update, lista, clave, defaultValue = []) {
    if (val === '') {
      update(() => lista.value = defaultValue)
    }
    update(() => {
      const needle = val.toLowerCase()
      lista.value = defaultValue.filter(
        (v: any) => v[clave].toLowerCase().indexOf(needle) > -1
      )
    })
  }




  return {
    paises, filtrarPaises,
    provincias, filtrarProvincias,
    cantones, filtrarCantones, ordenarCantones,
    parroquias, filtrarParroquias,
    empresas, filtrarEmpresas, ordenarEmpresas,
    proveedores, filtrarProveedores,
    clientes, filtrarClientes, ordenarClientes,
    empleados, filtrarEmpleados, ordenarEmpleados,
    bancos, filtrarBancos,
    categorias, filtrarCategoriasProveedor, ordenarCategorias,
    productos, filtrarProductos,
    motivos, filtrarMotivos,
    sucursales, filtrarSucursales,

    tareas, filtrarTareas,
    proyectos, filtrarProyectos,
    etapas, filtrarEtapas,
    tareasDestino, filtrarTareasDestino,
  }
}
