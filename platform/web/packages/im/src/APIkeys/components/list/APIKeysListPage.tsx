import {useTranslation} from "react-i18next";
import {IconButton, Stack, Typography} from "@mui/material";
import {Button, Page, TextField} from "@smartb/g2";
import {APIKeysTable} from "../APIKeysTable";
import {useCallback, useMemo, useState} from "react";
import {Offset, OffsetPagination} from "template";
import {useCreatedConfirmationPopUp} from "../../hooks";
import { VisibilityRounded } from "@mui/icons-material";

interface APIKeysListPageProps { }

export const APIKeysListPage = (props: APIKeysListPageProps) => {
    const { } = props;
    const { t } = useTranslation();
    // const { apiKeysAdd } = useRoutesDefinition()
    const pagination = useMemo((): OffsetPagination => ({ offset: Offset.default.offset, limit: Offset.default.limit }), [])
    const [isHidden, setHidden] = useState(true)
    const createdConfirmation = useCreatedConfirmationPopUp({
        title: t("apiKeysList.created"),
        component :
            <Stack gap={(theme) => `${theme.spacing(4)}`} sx={{margin : (theme) => `${theme.spacing(4)} 0`}}>
                <Typography>{t("apiKeysList.createdMessage")}</Typography>
                <TextField hidden={isHidden} iconPosition='end' inputIcon={<IconButton onClick={useCallback(() => {setHidden(!isHidden)}, [],)}><VisibilityRounded /></IconButton>} />
            </Stack>
    });


    return (
        <Page
            headerProps={{
                content: [{
                    leftPart: [
                        <Typography variant="h5" key="pageTitle">{t("manageAPIKeys")}</Typography>
                    ],
                    rightPart: [
                        // LinkButton to={apiKeysAdd()}
                        <><Button onClick={() => createdConfirmation.handleOpen()} key="pageAddButton">{t("apiKeysList.create")}</Button>{createdConfirmation.popup}</>
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
                            created: 10

                        },
                            {
                                name: "yoayo",
                                identifier: "yaaya",
                                created: 10
                            }
                        ],
                        total: 10
                    }}
                    pagination={pagination}
                    isLoading={false}
                />
            </Stack>
        </Page>
    )
}
