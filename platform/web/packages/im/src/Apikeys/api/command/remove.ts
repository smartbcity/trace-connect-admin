import {CommandParams, OrganizationId, useCommandRequest} from "@smartb/g2";
import {useAuthenticatedRequest} from "../../config";
import {ApiKeyId} from "../model";

interface ApikeyRemoveCommandDTO {
    id: ApiKeyId
    organizationId: OrganizationId
}

interface ApikeyRemovedEventDTO {
    id: OrganizationId
    keyId: string
}

export interface ApikeyRemoveCommand extends ApikeyRemoveCommandDTO{ }
export interface ApikeyRemovedEvent extends ApikeyRemovedEventDTO{ }

export type ApikeyRemoveFunctionOptions = Omit<CommandParams<ApikeyRemoveCommand, ApikeyRemovedEvent>,
    'jwt' | 'apiUrl'
>
export const useApikeyRemoveFunction = (params?: ApikeyRemoveFunctionOptions) => {
    const requestProps = useAuthenticatedRequest()
    return useCommandRequest<ApikeyRemoveCommand, ApikeyRemovedEvent>(
        "apiKeyRemove", requestProps, params
    )
}