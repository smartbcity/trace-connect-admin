import { useTranslation } from "react-i18next";
import { IconButton, Stack } from "@mui/material";
import { Tooltip } from "@smartb/g2";
import { DeleteRounded, Download, EditRounded, GridOn } from "@mui/icons-material";

export interface TableCellAdminProps {
    onDelete?: () => void
    onEdit?: () => void
    onVectorize?: () => void
    onDownload?: () => void
}

export const TableCellAdmin = (props: TableCellAdminProps) => {
    const {onDelete, onEdit, onVectorize, onDownload} = props;
    const { t } = useTranslation();

    return (
        <Stack direction="row">
            {onDelete ?
                <Tooltip helperText={t("delete")}>
                    <IconButton onClick={
                        (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onDelete()
                        }}>
                        <DeleteRounded />
                    </IconButton>
                </Tooltip>
                : ''}
            {onEdit ?
                <Tooltip helperText={t("edit")}>
                    <IconButton onClick={
                        (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onEdit()
                        }
                    }>
                        <EditRounded />
                    </IconButton>
                </Tooltip>
                : ''}
            {onDownload ? 
                <Tooltip helperText={t("upload")}>
                    <IconButton onClick={
                        (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onDownload()
                        }    
                    }>
                        <Download />
                    </IconButton>
                </Tooltip>
                : ''}
            {onVectorize ? 
                <Tooltip helperText={t("vectorize")}>
                    <IconButton onClick={
                        (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation()
                            onVectorize()
                        }
                    }>
                        <GridOn />
                    </IconButton>
                </Tooltip>
                : ''}
        </Stack>
    );
};
