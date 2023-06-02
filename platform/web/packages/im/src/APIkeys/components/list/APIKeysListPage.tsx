import {useTranslation} from "react-i18next";
import {useRoutesDefinition} from "components";
import {Stack, Typography} from "@mui/material";
import {LinkButton, Page} from "@smartb/g2";
import {useAPIKeysListPage} from "../../hooks";
import {AutomatedUserTable} from "@smartb/g2-i2-v2";

interface APIKeysListPageProps { }

export const APIKeysListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();

    const { additionalColumns } = useAPIKeysListPage()

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
                <AutomatedUserTable
                    columnsExtander={{
                        additionalColumns,
                    }}
                    noDataComponent={<Typography align="center">{t("apiKeysList.noKeys")}</Typography>}
                />
            </Stack>
        </Page>
    )
};


// <AutomatedAPIKeysTable
//     columnsExtander={{
//         additionalColumns
//     }}
//     noDataComponent={<Typography align="center">{t("apiKeysList.noKeys")}</Typography>}
// />
