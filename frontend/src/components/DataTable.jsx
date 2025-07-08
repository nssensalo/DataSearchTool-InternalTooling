import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress, Box, Typography } from '@mui/material';

function DataTable({ data, isLoading }) {
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>Loading Data...</Typography>
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography variant="h6" color="text.secondary">No data found for the selected filters.</Typography>
            </Box>
        );
    }

    // Extract headers dynamically from the first object
    const headers = Object.keys(data[0]);

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table sx={{ minWidth: 650 }} aria-label="voter data table">
                <TableHead sx={{ bgcolor: '#e0e0e0' }}>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header.replace(/_/g, ' ')}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {headers.map((header) => (
                                <TableCell key={header}>{row[header]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Showing first {data.length} results.
                </Typography>
            </Box>
        </TableContainer>
    );
}

export default DataTable;