import { Box, IconButton } from "@mui/material"
import { Link } from "react-router-dom"
import { TraceIcon } from "../icons";
import { Menu } from "@mui/icons-material";
import { LanguageSelector } from "../LanguageSelector";

export interface PermanentHeaderProps {
    toggleOpenDrawer: () => void
}

export const PermanentHeader = (props: PermanentHeaderProps) => {
    const {toggleOpenDrawer} = props
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                padding: "16px",
                gap: "16px",
                alignItems: "center",
            }}
        >
            <LanguageSelector />
            <Link
                to="/"
                style={{
                    flexGrow: 1,
                    display: "flex",
                }}
            >
                <TraceIcon style={{ width: "100%", height: "40px" }} />
            </Link>
            <IconButton onClick={toggleOpenDrawer}>
                <Menu />
            </IconButton>
        </Box>
    );
};