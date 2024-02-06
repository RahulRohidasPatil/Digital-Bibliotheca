import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

/* eslint-disable react/prop-types */
export default function ChatItem({name, target, isDiscussion }){
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
                <Icon  icon={isDiscussion ? "healthicons:group-discussion-meetingx3-outline" : "mdi:chat-outline"} fontSize={30} style={{ marginRight: 10 }} />
                <Typography sx={{mx: 2}} variant='caption'>
                    <Link href={isDiscussion ? `/discussion/${target}` : `/chats/${target}`} color="inherit" underline="hover" variant="subtitle2" noWrap>
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