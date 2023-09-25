import { Page, Section, } from '@smartb/g2';
import { UserFactory } from 'connect-im';
import { PageHeaderObject, useExtendedAuth } from "components";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useUserFunctionnalities } from './useUserFunctionnalities';

export interface UserUpdatePageProps {
    myProfile?: boolean
}

export const UserUpdatePage = (props: UserUpdatePageProps) => {
    const { myProfile = false } = props
    const { t } = useTranslation();
    const { service } = useExtendedAuth()
    const { userId =  service.getUserId() } = useParams();

    const isAdmin = service.is_im_user_write()

    const { checkEmailValidity, fieldsOverride, formState, formActions, isLoading, user } = useUserFunctionnalities({
        isUpdate: true,
        myProfile,
        userId
    })

    return (
        <Page
            headerProps={PageHeaderObject({
                title: myProfile ? t("profil") : t("users"),
                titleProps: { sx: { flexShrink: 0 } }
            })}
            bottomActionsProps={{
                actions: formActions
            }}
        >
            <Section >
                <UserFactory
                    readOnly={false}
                    formState={formState}
                    update={true}
                    isLoading={isLoading}
                    user={user}
                    userId={userId}
                    resetPasswordType={myProfile ? 'email' : isAdmin ? "forced" : undefined}
                    multipleRoles={false}
                    fieldsOverride={fieldsOverride}
                    checkEmailValidity={checkEmailValidity}
                />
            </Section>
        </Page>
    )
}
