/* eslint-disable */
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import _without from 'lodash/without';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function SelectInputWithChip({ formData, setFormData, label, name, items }) {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    setPersonName(items[event.target.value - 1]);

    setFormData({...formData, [name]: event.target.value})
  };

  const handleDelete = (e, value) => {
    e.preventDefault();
    setPersonName((current) => _without(current, value) || []);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip
                  key={selected}
                  label={selected}
                  clickable
                  onMouseDown={(e) => e.stopPropagation()}
                  onDelete={(e) => handleDelete(e, selected)}
                />
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items.map((name) => (
            <MenuItem key={name} value={items.indexOf(name) + 1} style={getStyles(name, personName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
/* eslint-disable */