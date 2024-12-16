import { useTheme } from '@/useTheme'
import * as React from 'react'

import {
    Paragraph,
    Subheading,
    Text as NativeText,
    Text,
} from 'react-native-paper'


type Props = React.ComponentProps<typeof NativeText> & {
    isSubheading?: boolean
}

export default function TextComponent({ isSubheading = false, ...props }: Props) {
    const theme = useTheme()

    if (theme.isV3) {
        return (
            <Text
                variant={isSubheading ? 'bodyLarge' : 'bodyMedium'}
                style={{ color: theme.colors.onSurfaceVariant }}
                {...props}
            />
        )
    } else if (isSubheading) {
        return <Subheading {...props} />
    }
    return <Paragraph {...props} />
}