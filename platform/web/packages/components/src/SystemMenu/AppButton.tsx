import {ButtonProps, Button} from '@mui/material'

export const AppButton = (props: ButtonProps) => {
  return (
    <Button 
    {...props}
    sx={{
        color: "#666560",
        flexDirection: "column",
        textTransform: 'none',
        gap: "5px",
        padding: 0,
        width: "90px",
        height: "60px",
        "& .MuiButton-startIcon": {
            margin: 0
        },
        ...props.sx
    }}
    variant='text'
    />
  )
}
