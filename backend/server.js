const express =require('express');
const cors = require('cors');
const voterDataRoutes = require('./routes/voterDataRoutes');
const llmRoutes = require('./routes/llmroutes');



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's actual URL if different
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use('/api', voterDataRoutes); // Your existing routes (now placeholders)
app.use('/api', llmRoutes);   // NEW: Mount the LLM routes under /api


app.get('/', (req,res) => {
    res.send('Backend API running...');
});

app.listen(PORT,()=>{
    console.log(`Backend server running on port:${PORT}...`);
});