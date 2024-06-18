import { CategoriaTipoTicket } from 'pages/gestionTickets/categoriasTiposTickets/domain/CategoriaTipoTicket'
import { DestinatarioTicket } from '../domain/DestinatarioTicket'
import { TipoTicket } from 'pages/gestionTickets/tiposTickets/domain/TipoTicket'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { Ref, ref } from 'vue'

export function useDestinatariosTickets(listadosAuxiliares: any) {
  const destinatarios: Ref<DestinatarioTicket[]> = ref([])

  function obtenerCategorias(idDepartamento: number) {
    return listadosAuxiliares.categoriasTiposTickets.filter((categoria: CategoriaTipoTicket) => categoria.departamento_id === idDepartamento)
  }

  function obtenerTiposTickets(idDepartamento: number, categoria_tipo_ticket: number) {
    const destinatario = destinatarios.value.find((destinatario: DestinatarioTicket) => destinatario.departamento_id === idDepartamento)
    if (destinatario) {
      console.log('dentro de if')
      destinatario.tipos_tickets = listadosAuxiliares.tiposTickets.filter((tipo: TipoTicket) => tipo.categoria_tipo_ticket_id === categoria_tipo_ticket)
    } else {
      console.log('dentro de else')
      return listadosAuxiliares.tiposTickets.filter((tipo: TipoTicket) => tipo.categoria_tipo_ticket_id === categoria_tipo_ticket)
    }
  }

  function agregarDestinatario(idDepartamento: number) {
    const destinario = new DestinatarioTicket()
    destinario.departamento_id = idDepartamento
    destinario.departamento = listadosAuxiliares.departamentos.filter((departamento: Departamento) => departamento.id === idDepartamento)[0].nombre
    destinario.categorias = obtenerCategorias(idDepartamento)
    destinatarios.value.push(destinario)
  }

  function quitarDestinatario(idDepartamento: number) {
    destinatarios.value = destinatarios.value.filter((destinatario: DestinatarioTicket) => destinatario.departamento_id !== idDepartamento)
  }

  function mapearIdsDestinatarios() {
    return destinatarios.value.map((destinatario: DestinatarioTicket) => {
      const destinarioIds = new DestinatarioTicket()
      destinarioIds.departamento_id = destinatario.departamento_id
      destinarioIds.categoria_id = destinatario.categoria_id
      destinarioIds.tipo_ticket_id = destinatario.tipo_ticket_id

      delete destinarioIds.categorias
      delete destinarioIds.tipos_tickets
      delete destinarioIds.departamento

      return destinarioIds
    })
  }

  function reestablecerDestinatarios() {
    destinatarios.value = []
  }

  function setDestinatarios(destinatariosTickets: DestinatarioTicket[]) {
    destinatarios.value = destinatariosTickets.map((destinatario: DestinatarioTicket) => {
      const dest = new DestinatarioTicket()
      dest.departamento = listadosAuxiliares.departamentos.filter((departamento: Departamento) => departamento.id === destinatario.departamento_id)[0].nombre
      dest.categorias = destinatario.departamento_id ? obtenerCategorias(destinatario.departamento_id) : []
      dest.tipos_tickets = destinatario.categoria_id && destinatario.departamento_id ? obtenerTiposTickets(destinatario.departamento_id, destinatario.categoria_id) : []
      dest.categoria_id = destinatario.categoria_id
      dest.tipo_ticket_id = destinatario.tipo_ticket_id
      dest.departamento_id = destinatario.departamento_id
      return dest
    })

    console.log(destinatarios)
  }

  return {
    // filtrarCategorias,
    agregarDestinatario,
    destinatarios,
    obtenerTiposTickets,
    mapearIdsDestinatarios,
    reestablecerDestinatarios,
    setDestinatarios,
    quitarDestinatario,
  }
}
