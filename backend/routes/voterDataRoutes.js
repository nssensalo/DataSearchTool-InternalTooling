const {stringify} =require('csv-stringify');
const XLSX = require('xlsx'); // be sure to install this
const mockVoterData = require('../data/mockVoterData');
const applyFilters = require('../utils/filterFunction');


const express = require('express');

const router = express.Router();


//API routing for previewing feature
router.get('/voter-data-preview', (req, res) => {
    try {
        const filters = req.query; // Filters come from query parameters
        console.log("#1 routes")
        // Apply filters to the full mock data
        const filteredData = applyFilters(mockVoterData, filters);
        console.log("#2 routes")
        // Limit the data for preview purposes (e.g., first 20 records)
        const previewData = filteredData.slice(0, 20);
        console.log("#3 routes")
        res.json(previewData);
    } catch (error) {
        console.error('Error fetching voter data preview (routes):', error);
        res.status(500).json({ error: 'Failed to fetch voter data preview.' });
    }
});



//API routing for exporting data feature
router.get('/voter-data-export', async (req, res) => {
    try {
        const filters = req.query; // Filters come from query parameters
        const format = filters.format || 'csv'; // Default to CSV if not specified

        // Apply filters to the full mock data for export
        const dataToExport = applyFilters(mockVoterData, filters);

        if (dataToExport.length === 0) {
            return res.status(404).send('No data found for the selected filters to export.');
        }

        const filename = `voter_data_${new Date().toISOString().slice(0, 10)}`;

        if (format === 'csv') {
            stringify(dataToExport, { header: true }, (err, output) => {
                if (err) {
                    console.error('Error stringifying CSV:', err);
                    return res.status(500).send('Failed to generate CSV.');
                }
                res.header('Content-Type', 'text/csv');
                res.attachment(`${filename}.csv`);
                res.send(output);
            });
        } else if (format === 'excel') {
            const ws = XLSX.utils.json_to_sheet(dataToExport);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Voter Data");
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }); // Use type: 'buffer' for Express response

            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment(`${filename}.xlsx`);
            res.send(wbout);
        } else {
            res.status(400).send('Invalid export format. Only "csv" and "excel" are supported.');
        }

    } catch (error) {
        console.error('Error exporting voter data:', error);
        res.status(500).json({ error: 'Failed to export voter data.' });
    }
});

module.exports = router;