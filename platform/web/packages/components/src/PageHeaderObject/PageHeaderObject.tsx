import {HeaderProps} from "@smartb/g2-layout";
import {StatusTag} from "@smartb/g2";
import {StatusTagProps} from "@smartb/g2-notifications/dist/StatusTag/StatusTag";
import { Skeleton, Typography, TypographyProps } from "@mui/material";

export interface PageHeaderObjectProps {
  title?: string
  status?: StatusTagProps
  isLoading?: boolean
  rightPart?: (JSX.Element | undefined)[]
  leftPart?: (JSX.Element | undefined)[]
  titleProps?: TypographyProps
}

export const PageHeaderObject = (props: PageHeaderObjectProps): HeaderProps => {
  const {title, status, isLoading = false, rightPart = [], leftPart = [], titleProps} = props
  return {
    content: [{
      leftPart: [
        <Typography variant="h5" key="pageTitle" {...titleProps}>{isLoading ? <Skeleton key="loadingTitle" animation='wave' sx={{width:250}} /> : title}</Typography>,
        ...leftPart
      ],
      rightPart: [
        status ? (<StatusTag key="status" {...status}/>) : undefined,
        ...rightPart
      ]
    }]
  };
}