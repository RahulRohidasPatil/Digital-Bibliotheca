import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';

export default function MessageItem({ content, sender, name }) {
  return (
    <Grid item xs={12} sm={12}>
      <Typography sx={{
        float: `${sender ? 'right' : 'left'}`,
        clear: `${sender ? 'right' : 'left'}`,
        color: 'grey',
        fontSize: '0.5em'
      }}>
        {name}
      </Typography>
      <Card
        sx={{
          float: `${sender ? 'right' : 'left'}`,
          clear: `${sender ? 'right' : 'left'}`,
          backgroundColor: `${sender ? 'lightblue' : 'grey'}`,
          borderRadius: 1,
          minHeight: '30px',
          minWidth: 'content',
          top: '0',
          maxWidth: '50%',
          display: 'flex',
          justifyContent: `${sender ? 'right' : 'left'}`,
        }}
      >
        <Typography sx={{ mx: 1, my: 1, fontSize: '1em' }} variant="caption">
          {content}
        </Typography>
      </Card>
    </Grid>
  );
}

MessageItem.propTypes = {
  content: PropTypes.any,
  sender: PropTypes.any,
  name: PropTypes.any
};
