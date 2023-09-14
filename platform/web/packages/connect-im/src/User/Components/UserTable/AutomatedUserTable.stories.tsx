import React, { useCallback, useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import {
  AutomatedUserTable,
  AutomatedUserTableProps
} from './AutomatedUserTable'

import { g2Config, KeycloakProvider } from '@smartb/g2-providers'
import { Typography } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default {
  title: 'I2V2/AutomatedUserTable',
  component: AutomatedUserTable
} as Meta

const queryClient = new QueryClient()

export const AutomatedUserTableStory: StoryFn<AutomatedUserTableProps> = (
  args: AutomatedUserTableProps
) => {
  return (
    <QueryClientProvider client={queryClient}>
      <KeycloakProvider
        config={g2Config().keycloak}
        loadingComponent={<Typography>Loading...</Typography>}
        initOptions={{ onLoad: 'login-required' }}
      >
        <Following {...args} />
      </KeycloakProvider>
    </QueryClientProvider>
  )
}

const Following = (args: AutomatedUserTableProps) => {
  return <AutomatedUserTable {...args} />
}

AutomatedUserTableStory.args = {}

AutomatedUserTableStory.storyName = 'AutomatedUserTable'
