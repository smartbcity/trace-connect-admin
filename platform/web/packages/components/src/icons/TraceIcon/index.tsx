import React from 'react'
import { ReactComponent } from './icon.svg'
import { MergeReactElementProps } from '@smartb/g2-utils'

interface TraceIconProps {
  color?: string
}

type Props = MergeReactElementProps<'svg', TraceIconProps>

export const TraceIcon = React.forwardRef(
  (props: Props, ref: React.Ref<SVGSVGElement>) => {
    const { color = '#EDBA27' } = props
    return <ReactComponent fill={color} ref={ref} {...props} />
  }
)
