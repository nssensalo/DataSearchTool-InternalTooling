import { useState,useEffect} from 'react'
import './App.css'
import { Container,Box,Typography, TextField,Button} from '@mui/material';
import FilterForm from './components/FilterForm.jsx';
import DataTable from './components/DataTable.jsx';
import ExportButtons from './components/ExportButtons.jsx';
import MessageSnackbar from './components/MessageSnackbar.jsx';
import {CircularProgress} from '@mui/material';



function App() {
  
  //const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const API_URL = import.meta.env.VITE_API_URL


  const [filters, setFilters] = useState({
    startDate:'',
    endDate:'',
    selectedParty:'',
    selectedStatus:'',
    voterInput:'',
    sipCodeInput:'',
  });

  const [voterDataPreview,setVoterDataPreview]=useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isExporting, setIsExporting] =useState(false);
  const [userQuery, setUserQuery] = useState(''); 
  const [llmAnswer, setLlmAnswer] = useState('');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const[snackbar, setSnackbar] = useState({
    open: false,
    message:'',
    type:'success',
  })

  const showSnackbar = (message,type) => {
    setSnackbar({open:true,message,type})
  }

  const handleCloseSnackbar =() => {
    setSnackbar(prev => ({...prev,open:false}))
  }//copy previous state and change open to false

   
  const fetchVoterDataPreview = async () => {
    setIsLoadingData(true);
    setVoterDataPreview([]); // Clear previous preview data

    try {
        // Construct query parameters from current filters
        console.log("#1 app")
        const queryParams = new URLSearchParams(filters).toString();
         console.log("#2app")
        console.log(`Fetching data from: ${API_URL}/api/voter-data-preview?${queryParams}`); // Debugging line
        const response = await fetch(`${API_URL}/api/voter-data-preview?${queryParams}`);
         console.log("#3 app")
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
         console.log("#4 app")
        setVoterDataPreview(data);
         console.log("#5 app")

        if (data.length === 0) {
            showSnackbar("No data found for the selected filters.", "info");
        } else {
            showSnackbar("Data preview loaded successfully!", "success");
        }
    } catch (error) {
        console.error("Error fetching voter data preview (app):", error);
        showSnackbar(`Failed to load data: ${error.message}. Please check backend.`, "error");
    } finally {
        setIsLoadingData(false);
    }
  };
  

  useEffect(() => {
    fetchVoterDataPreview(); // This will now show the info message
  }, [filters]);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
        // Construct query parameters including filters and desired format
        const queryParams = new URLSearchParams({ ...filters, format }).toString();
        // Open a new tab/window for the download, as the backend will send a file
        window.open(`${API_URL}/api/voter-data-export?${queryParams}`, '_blank');
        showSnackbar(`Export initiated for ${format.toUpperCase()}!`, "success");
    } catch (error) {
        console.error(`Error initiating export to ${format}:`, error);
        showSnackbar(`Failed to initiate export to ${format.toUpperCase()}. Please try again.`, "error");
    } finally {
        setIsExporting(false);
    }
  };

  // --- UPDATED LLM Query Handler to call backend ---
  const handleLLMQuery = async () => {
    if (!userQuery.trim()) {
        setLlmAnswer("Please enter a question.");
        return;
    }

    setIsProcessingQuery(true);
    setLlmAnswer(''); // Clear previous answer

    try {
        const response = await fetch(`${API_URL}/api/ask-llm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userQuery }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLlmAnswer(data.answer);
        showSnackbar("Query processed successfully!", "success");

    } catch (error) {
        console.error('Error sending query to backend:', error);
        setLlmAnswer(`Error: ${error.message}`);
        showSnackbar(`Failed to get answer: ${error.message}`, "error");
    } finally {
        setIsProcessingQuery(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 3 }}>
          Data Search Tool
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Apply filters OR Ask a question about the data.
        </Typography>
      </Box>

      <FilterForm
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={fetchVoterDataPreview}
      />
     {/* --- LLM Query Section --- */}
      <Box sx={{ mt: 6, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
          Ask a Question about the Data
        </Typography>
        <TextField
          fullWidth
          label="Enter your question (e.g., 'How many voters are there total?' or 'What percent voted between April 2020 and April 2025?')"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLLMQuery();
            }
          }}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleLLMQuery}
          disabled={isProcessingQuery}
          sx={{
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#115293' },
            borderRadius: '9999px',
            padding: '10px 20px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isProcessingQuery ? <CircularProgress size={24} color="inherit" /> : 'Get Answer'}
        </Button>

        {llmAnswer && (
          <Box sx={{ mt: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#f5f5f5' }}>
            <Typography variant="body1" color="text.primary">
              ANSWER: {llmAnswer}
            </Typography>
          </Box>
        )}
      </Box>

      <MessageSnackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={handleCloseSnackbar}
      />
      
      <Box sx={{ mt: 4, p: 3, borderRadius: 2, boxShadow: 3, bgcolor: 'background.paper' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 3 }} color='text.secondary'>
          Data Preview (First 20 Rows) then Export (CSV,Excel)
        </Typography>
        <DataTable data={voterDataPreview} isLoading={isLoadingData} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <ExportButtons handleExport={handleExport} isExporting={isExporting} />
        </Box>
      </Box>
    </Container>
  );
}

export default App;