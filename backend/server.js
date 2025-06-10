const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Connect to MongoDB using connection string from environment variables
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(3001, () => console.log('Server running on port 3001'));
});

// Route to handle chatbot queries
app.post('/api/chatbot', async (req, res) => {
    const userInput = req.body.userInput;

    // Logging user input for debugging
    console.log('User Input:', userInput);
    console.log('Request Body:', req.body);

    // Validate that user input is provided
    if (!userInput) {
        return res.status(400).json({ error: 'No user input provided' });
    }

    try {
        // Make a POST request to local AI model server with the user prompt
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt: userInput,
            stream: false
        });

        // Extract AI's reply from response
        const aiReply = response.data.response;

        // Send AI reply back to client
        res.json({ reply: aiReply });
    } catch (err) {
        console.error('Error from OpenAI:', err.message);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

// Route to summarize conversation history or text
app.post('/api/summarize', async (req, res) => {
    const { prompt } = req.body;

    // Validate that prompt is provided
    if(!prompt) {
        return res.status(400).json({error: 'No prompt provided for summarization'});
    }

    try {
        // Send summarization request to local AI model server with "Summarize this conversation:" prefix
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3',
            prompt: `Summarize this conversation: \n\n${prompt}`,
            stream: false
        });

        // Extract summary from response
        const summary = response.data.response;
        
        // Send summary back to client
        res.json({ summary });
    } catch (err) {

        // Handle errors during summarization
        console.error('Error during summarization:', err.message);
        res.status(500).json({error: 'Failed to summarize chat history'});
    }
})