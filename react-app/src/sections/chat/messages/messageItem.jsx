import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'

export default function MessageItem({content, sender}){
    return (
        <Grid item xs={12} sm={12}>
                    <Card sx={{float: `${sender ? 'right' : 'left'}`, clear: `${sender ? 'right' : 'left'}`, backgroundColor: `${sender ? 'lightblue' : 'grey'}`, borderRadius: 1, minHeight: '20px', minWidth: '25%', top: '0', maxWidth:'50%'}}>
                        <Typography sx={{ mx: 1, my: 1, fontSize: '1em' }} variant="caption">
                            {content}
                        </Typography>
                    </Card>
                    </Grid>
    )
}