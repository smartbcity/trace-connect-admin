import {CommandParams, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import { city } from "@smartb/apikey-domain"

export interface ApikeyRemoveCommand extends city.smartb.im.apikey.domain.command.ApikeyRemoveCommandDTO {}

export interface ApikeyRemoveEvent extends city.smartb.im.apikey.domain.command.ApikeyRemoveEventDTO {}

export type ApikeyRemoveFunctionOptions = Omit<CommandParams<ApikeyRemoveCommand, ApikeyRemoveEvent>,
    'jwt' | 'apiUrl'
>
export const useApikeyRemoveFunction = (params?: ApikeyRemoveFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApikeyRemoveCommand, ApikeyRemoveEvent>(
        "apiKeyRemove", requestProps, params
    )
}