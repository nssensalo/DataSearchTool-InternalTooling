import React from 'react';
import { TextField, Button, MenuItem, FormControl,Paper, InputLabel, Select, Box, Grid } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

export default function FilterForm({ filters, setFilters, onApplyFilters }) {
    const handleDateChange = (name, date) => {
        setFilters(prev => ({
            ...prev,
            [name]: date ? format(date, 'yyyy-MM-dd') : '',
        }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Box sx={{ p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper', mb: 4 }}>
            <Grid container spacing={3}>
                {/* Date Range */}
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Registration Date (Start)"
                            value={filters.startDate ? new Date(filters.startDate) : null}
                            onChange={(date) => handleDateChange('startDate', date)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Registration Date (End)"
                            value={filters.endDate ? new Date(filters.endDate) : null}
                            onChange={(date) => handleDateChange('endDate', date)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>

                {/* Categories */}
                <Grid item xs={12} sm={6}>
                    <FormControl sx={{minWidth: 170}}>
                        <InputLabel id="party-select-label">Party Affiliation</InputLabel>
                        <Select
                            labelId="party-select-label"
                            id="selectedParty"
                            name="selectedParty"
                            value={filters.selectedParty}
                            label="Party Affiliation"
                            onChange={handleChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Democrat">Democrat</MenuItem>
                            <MenuItem value="Republican">Republican</MenuItem>
                            <MenuItem value="Independent">Independent</MenuItem>
                            <MenuItem value="No Party Preference">No Party Preference</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                   
                    <FormControl sx={{minWidth: 150}}>
                        <InputLabel id="status-select-label">Voter Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="selectedStatus"
                            name="selectedStatus"
                            value={filters.selectedStatus}
                            label="Voter Status"
                            onChange={handleChange}
                        >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            <MenuItem value="Provisional">Provisional</MenuItem>
                        </Select>
                    
                    </FormControl>
                    
                </Grid>

                {/* IDs */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Voter IDs (comma-separated)"
                        name="voterIdsInput"
                        value={filters.voterIdsInput}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Zip Codes (comma-separated)"
                        name="zipCodesInput"
                        value={filters.zipCodesInput}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={onApplyFilters}
                    sx={{
                        backgroundColor: '#4f46e5', // Equivalent to indigo-600
                        '&:hover': { backgroundColor: '#4338ca' }, // Equivalent to indigo-700
                        borderRadius: '9999px', // rounded-full
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-lg
                    }}
                >
                    Apply Filters
                </Button>
            </Box>
        </Box>
    );
}

