import { city } from "@smartb/apikey-domain"
import { Role } from "components"

export interface ApiKeyDTO extends city.smartb.im.apikey.domain.model.ApiKeyDTO {
    roles?: Role[]
}
