import {useTranslation} from "react-i18next";
import {useRoutesDefinition} from "components";
import {Stack, Typography} from "@mui/material";
import {LinkButton, Page} from "@smartb/g2";
import {APIKeysTable} from "../APIKeysTable";

interface APIKeysListPageProps { }

export const APIKeysListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    const { apiKeysAdd } = useRoutesDefinition()

    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography variant="h5" key="pageTitle">{t("manageAPIKeys")}</Typography>
                    ],
                    rightPart: [
                        <LinkButton to={apiKeysAdd()} key="pageAddButton">{t("apiKeysList.create")}</LinkButton>
                    ]
                }]
            }}
        >
            <Stack gap={4}>
                <Typography>{t('apiKeysList.headerText1')}</Typography>
                <Typography>{t('apiKeysList.headerText2')}</Typography>
                <APIKeysTable
                    page={{
                        items: [{
                            name: "yoyo",
                            identifier: "yaya",
                            created: "10"

                        },
                            {
                                name: "yoayo",
                                identifier: "yaaya",
                                created: "10"
                            }
                        ],
                        total: 10
                    }}


                />
            </Stack>
        </Page>
    )
}
