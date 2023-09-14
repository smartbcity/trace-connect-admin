import { Meta, StoryFn } from '@storybook/react'
import React from 'react'
import {
  UserResetPasswordForm,
  UserResetPasswordFormProps
} from './UserResetPasswordForm'

import { styles, classes } from '../../Domain'

export default {
  title: 'I2V2/UserResetPasswordForm',
  component: UserResetPasswordForm,
  argTypes: {
    classes: {
      table: {
        type: {
          summary: 'UserResetPasswordFormClasses',
          detail: classes
        }
      }
    },
    styles: {
      table: {
        type: {
          summary: 'UserResetPasswordFormStyles',
          detail: styles
        }
      }
    }
  }
} as Meta

export const UserResetPasswordFormStory: StoryFn<UserResetPasswordFormProps> = (
  args: UserResetPasswordFormProps
) => {
  return <UserResetPasswordForm {...args} />
}

UserResetPasswordFormStory.args = {
  onSubmit: (cmd) => {
    console.log(cmd)
    return true
  },
  userId: 'userId'
}

UserResetPasswordFormStory.storyName = 'UserResetPasswordForm'
