export {
  flatUserToUser,
  userToFlatUser,
} from './Domain'

export type {
  User,
  UserPageQuery,
  UserPageResult,
  UserResetPasswordCommand,
  UserUpdateEmailCommand,
  UserUpdatePasswordCommand,
  UserUpdatePasswordResult,
  UserUpdatedEmailEvent,
  FlatUser,
  UserId
} from './Domain'

export * from './Api'

export {
  UserFactory,
  useUserFormFields,
  useUserFormState
} from './Components/UserFactory'

export type {
  UserFactoryProps,
  userFieldsName,
  UseUserFormStateProps,
  UseUserFormFieldsProps,
  UserFactoryFieldsOverride,
} from './Components/UserFactory'

export {
  AutomatedUserTable,
  UserTable,
  useUserTableState,
  useUserColumns,
} from './Components/UserTable'

export type {
  AutomatedUserTableProps,
  UserTableProps,
  useUserTableStateParams,
  userTableColumns,
  useUserColumnsParams
} from './Components/UserTable'

export {
  UserResetPasswordForm,
  UserResetPasswordFormAutomated,
} from './Components/UserResetPassword'

export type {
  UserResetPasswordFormProps,
  UserResetPasswordFormAutomatedProps,
  UserResetPasswordFormClasses,
  UserResetPasswordFormStyles
} from './Components/UserResetPassword'

export { UserSummary } from './Components/UserSummary'
export type { UserSummaryProps } from './Components/UserSummary'
