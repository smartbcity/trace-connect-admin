import { Select, SelectChangeEvent } from '@mui/material'
import { makeG2STyles } from '@smartb/g2-themes'
import { useCallback } from 'react'
import { useExtendedI18n, Languages, languages } from '../..'

const useStyles = makeG2STyles()({
    label: {
        marginRight: "5px"
    },
    select: {
        padding: "2px 0px !important",
        paddingRight: "15px !important"
    },
    selectIcon: {
        marginRight: "-8px"
    }
})

export const LanguageSelector = () => {
    const { i18n } = useExtendedI18n()
    const { classes } = useStyles()

    const onLanguageChange = useCallback(
        (event: SelectChangeEvent<"fr" | "en">) => i18n.changeLanguage(event.target.value as keyof Languages),
        [i18n.changeLanguage],
    )

    return (
            <Select variant="standard" color="secondary" classes={{ select: classes.select, icon: classes.selectIcon }} native defaultValue={i18n.language} onChange={onLanguageChange} id="X2-languageSelector">
                {
                   Object.keys(languages).map((lng) => (
                        <option key={lng} value={lng}>{lng}</option>
                   ))
                }
            </Select>
    )
}
