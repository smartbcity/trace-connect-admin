import React, { useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import {
  AutomatedOrganizationTable,
  AutomatedOrganizationTableBasicProps as AutomatedOrganizationTableProps
} from './AutomatedOrganizationTable'

import { g2Config, KeycloakProvider, useAuth } from '@smartb/g2-providers'
import { Typography } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Organization } from '../OrganizationFactory'

export default {
  title: 'I2V2/AutomatedOrganizationTable',
  component: AutomatedOrganizationTable
} as Meta

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000000
    }
  }
})

export const AutomatedOrganizationTableStory: StoryFn<
  AutomatedOrganizationTableProps<Organization>
> = (args: AutomatedOrganizationTableProps<Organization>) => {
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

const Following = (args: AutomatedOrganizationTableProps<Organization>) => {
  const { keycloak } = useAuth()

  if (!keycloak.authenticated) return <></>
  return <AutomatedOrganizationTable {...args} />
}

AutomatedOrganizationTableStory.args = {}

AutomatedOrganizationTableStory.storyName = 'AutomatedOrganizationTable'
