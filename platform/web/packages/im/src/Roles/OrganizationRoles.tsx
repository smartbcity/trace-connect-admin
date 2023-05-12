import { Stack } from '@mui/material'
import { Chip } from '@smartb/g2'
import { useTranslation } from 'react-i18next'
import { OrgRoles, orgRolesColors } from 'components'

export interface OrganizationRoles {
    roles: OrgRoles[]
}

export const OrganizationRoles = (props: OrganizationRoles) => {
    const { roles } = props
    const {t} = useTranslation()
    const chips = roles.map((role) => (
        <Chip key={role} label={t("organizationRoles." + role)} color={orgRolesColors[role]} />
    ))
    return (
        <Stack
            direction="row"
            sx={{
                gap: "5px"
            }}
        >
            {chips}
        </Stack>
    )
}
