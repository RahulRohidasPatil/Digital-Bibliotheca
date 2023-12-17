import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';

export default function ChatItem({name, target}){
    return(
        <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
                <Avatar
                    alt={name}
                    sx={{
                    width: 36,
                    height: 36,
                    border: (theme) => `solid 2px ${theme.palette.background.default}`,
                    background: 'darkgrey',
                    }}
                 />
                <Typography sx={{mx: 2}} variant='caption'>
                    <Link href={`/chats/${target}`} color="inherit" underline="hover" variant="subtitle2" noWrap>
                        {name}
                    </Link>
                </Typography>
        </Box>
        
    )
}

ChatItem.propTypes = {
    name: PropTypes.any,
    target: PropTypes.any
};