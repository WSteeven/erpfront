import { Persona } from '../modules/informacionPersona/domain/Persona'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Cuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/Cuestionario'

export class CuestionarioPublico extends EntidadAuditable{
    persona: Persona
    cuestionario: Cuestionario[]
    preguntas: any[]

    constructor() {
        super()
        this.persona = new Persona()
        this.cuestionario = []
        this.preguntas = []
    }
}