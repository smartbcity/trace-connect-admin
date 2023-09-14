import { Stack, StackProps, Typography } from '@mui/material'
import { Chip, UserAvatar } from '@smartb/g2-components'
import { Option } from '@smartb/g2-forms'
import { BasicProps, MergeMuiElementProps } from '@smartb/g2-themes'
import { useMemo } from 'react'

export interface UserSummaryBasicProps extends BasicProps {
  /**
   * The full name of the user
   */
  fullName?: string
  /**
   * The role of the user
   */
  roles?: string[] | string
  /**
   * The roles options needed to display the label of the role
   */
  rolesOptions?: Option[]
  /**
   * The roles options needed to display the label of the role
   *
   * @default false
   */
  onlyAvatar?: boolean
}

export type UserSummaryProps = MergeMuiElementProps<
  StackProps,
  UserSummaryBasicProps
>

export const UserSummary = (props: UserSummaryProps) => {
  const { fullName, roles, rolesOptions, onlyAvatar } = props

  const renderTag = useMemo(() => {
    if (!roles || !rolesOptions) return undefined
    if (Array.isArray(roles)) {
      return roles.map((value) => {
        const option = rolesOptions.find((o) => o.key === value)
        if (!option?.label) return undefined
        return (
          <Chip
            key={option.key.toString()}
            label={`${option?.label}`}
            color={option?.color}
          />
        )
      })
    }
    const option = rolesOptions.find((o) => o.key === roles)
    if (!option?.label) return undefined
    return (
      <Chip
        key={option.key.toString()}
        label={`${option?.label}`}
        color={option?.color}
      />
    )
  }, [roles, rolesOptions])

  return (
    <Stack
      alignItems='center'
      sx={{
        gap: (theme) => theme.spacing(1)
      }}
    >
      <UserAvatar name={fullName} size='large' />
      {!onlyAvatar && (
        <Stack
          alignItems='center'
          sx={{
            gap: (theme) => theme.spacing(0.5)
          }}
        >
          <Typography variant='subtitle1'>{fullName}</Typography>
          <Stack
            direction='row'
            sx={{
              gap: (theme) => theme.spacing(0.5)
            }}
          >
            {renderTag}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
