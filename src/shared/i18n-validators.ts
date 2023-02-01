import * as validators from '@vuelidate/validators'
import messages from 'config/lang/es-ES.json'
import { createI18n } from "vue-i18n"

const { createI18nMessage } = validators
const i18n = createI18n({
    locale: 'es-ES',
    globalInjection: true,
    messages: {
        'es-ES': messages
    },
})

const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) })

// wrap each validator.
export const required = withI18nMessage(validators.required)
export const requiredIf = withI18nMessage(validators.requiredIf, { withArguments: true })
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
// or you can provide the param at definition, statically
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })
export const numeric = withI18nMessage(validators.numeric)

export const helpers = validators.helpers 