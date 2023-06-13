import { useTranslation } from "react-i18next";
import { IconButton, Stack } from "@mui/material";
import { Tooltip } from "@smartb/g2";
import { DeleteRounded, EditRounded } from "@mui/icons-material";

export interface TableCellAdminProps {
    onDelete?: () => void
    onEdit?: () => void
}

export const TableCellAdmin = (props: TableCellAdminProps) => {
    const {onDelete, onEdit} = props;
    const { t } = useTranslation();

    return (
        <Stack direction="row">
            {onDelete ?
                <Tooltip helperText={t("delete")}>
                    <IconButton onClick={onDelete}>
                        <DeleteRounded />
                    </IconButton>
                </Tooltip>
                : ''}
            {onEdit ?
                <Tooltip helperText={t("edit")}>
                    <IconButton onClick={onEdit}>
                        <EditRounded />
                    </IconButton>
                </Tooltip>
                : ''}
        </Stack>
    );
};
