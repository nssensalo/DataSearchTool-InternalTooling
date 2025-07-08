import {Box,Button} from '@mui/material';

function ExportButtons({ handleExport, isExporting }) {
    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
                variant="contained"
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                sx={{
                    backgroundColor: '#10b981', // Equivalent to green-600
                    '&:hover': { backgroundColor: '#047857' }, // Equivalent to green-700
                    borderRadius: '9999px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isExporting ? 'Exporting CSV...' : 'Export to CSV'}
            </Button>
            <Button
                variant="contained"
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                sx={{
                    backgroundColor: '#3b82f6', // Equivalent to blue-600
                    '&:hover': { backgroundColor: '#2563eb' }, // Equivalent to blue-700
                    borderRadius: '9999px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                startIcon={isExporting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isExporting ? 'Exporting Excel...' : 'Export to Excel'}
            </Button>
        </Box>
    );
}

export default ExportButtons;
