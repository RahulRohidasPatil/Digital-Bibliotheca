import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppCategory({ category, title, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={3}
      maxWidth="80%"
      maxHeight="80%"
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        px: 2,
        pb: 5,
        pt: 5,
        borderRadius: 2,
        ...sx,
      }}
      {...other}
    >
      {icon && <Box>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppCategory.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  category: PropTypes.number,
};
