// Client-side export functions (requires papaparse, xlsx, file-saver)
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

export const exportToCsv = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, filename || `voter_data_${Date.now()}.csv`);
};

export const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Voter Data");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, filename || `voter_data_${Date.now()}.xlsx`);
};

