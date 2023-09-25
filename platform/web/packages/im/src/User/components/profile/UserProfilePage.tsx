import { Page, Section, LinkButton, Button } from '@smartb/g2';
import { UserFactory, useUserDisable, User } from 'connect-im';
import { LanguageSelector, PageHeaderObject, useExtendedAuth, useRoutesDefinition } from "components";
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Box } from "@mui/material"
import { useDeleteUserPopUp } from '../../hooks/useDeleteUserPopUp';
import { useQueryClient } from '@tanstack/react-query';
import { useUserFunctionnalities } from './useUserFunctionnalities';

export interface UserProfilePageProps {
    myProfile?: boolean
}

export const UserProfilePage = (props: UserProfilePageProps) => {
    const { myProfile = false } = props
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { service, policies } = useExtendedAuth()
    const { userId =   service.getUserId() } = useParams();

    const queryClient = useQueryClient()
    const { usersUserIdEdit, users } = useRoutesDefinition()

    const userDisable = useUserDisable({
    })

    const onDeleteClick = useCallback(
        async (user: User) => {
            const result = await userDisable.mutateAsync({
                id: user.id,
                anonymize: true
            })

            queryClient.invalidateQueries({ queryKey: ["userPage"] })
            queryClient.invalidateQueries({ queryKey: ["userGet"] })
            if (result) {
                navigate(users())
            }
        }, [queryClient.invalidateQueries, users]
    )

    const { popup, open } = useDeleteUserPopUp({
        onDeleteClick
    })

    const {formState, user, isLoading, getOrganizationUrl, fieldsOverride} = useUserFunctionnalities({
        myProfile,
        userId
    })

    const headerRightPart = useMemo(() => {
        if (!user) {
            return []
        }

        return [
            policies.user.canDelete(user) ? <Button onClick={() => open(user)} color="error" key="deleteButton">{t("delete")}</Button> : undefined,
            policies.user.canUpdate(user) ? <LinkButton to={usersUserIdEdit(user.id)} key="pageEditButton">{t("update")}</LinkButton> : undefined,
        ]
    }, [user, myProfile, usersUserIdEdit, open, userId, policies.user])

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myProfile ? t("profil") : t("users"),
                titleProps: { sx: { flexShrink: 0 } },
                rightPart: headerRightPart
            })}
        >
            <Section sx={{
                width: "100%",
                gap: (theme) => theme.spacing(2),
                position: "relative"
            }}>
                {myProfile && <Box
                    sx={{
                        position: "absolute",
                        top: "5px",
                        right: "15px"
                    }}
                >
                    <LanguageSelector />
                </Box>}
                <UserFactory
                    readOnly={true}
                    formState={formState}
                    isLoading={isLoading}
                    user={user}
                    userId={userId}
                    multipleRoles={false}
                    getOrganizationUrl={getOrganizationUrl}
                    fieldsOverride={fieldsOverride}
                />
            </Section>
            {popup}
        </Page>
    )
}
