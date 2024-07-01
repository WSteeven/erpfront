import { Persona } from '../modules/informacionPersona/domain/Persona'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Cuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/Cuestionario'
import { FormularioCuestionario } from 'pages/medico/cuestionarioPsicosocial/domain/FormularioCuestionario'

export class CuestionarioPublico extends EntidadAuditable {
    persona: Persona
    formulario_cuestionario: FormularioCuestionario[] // Cuestionario[]
    cuestionario: Cuestionario[]
    preguntas: any[]

    constructor() {
        super()
        this.persona = new Persona()
        this.formulario_cuestionario = []
        this.cuestionario = []
        this.preguntas = []
    }
}