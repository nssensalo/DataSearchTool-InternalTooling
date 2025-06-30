const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

const mockVoterData = require('../data/mockVoterData');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in your .env file!');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const applyFiltersForLLM = (data, filters) => {
    let filteredData = [...data];
    if (filters.startDate) {
        filteredData = filteredData.filter(voter =>
            voter.registration_date && voter.registration_date >= filters.startDate
        );
    }
    if (filters.endDate) {
        filteredData = filteredData.filter(voter =>
            voter.registration_date && voter.registration_date <= filters.endDate
        );
    }
    return filteredData;
};

router.post('/ask-llm', async (req, res) => {
    const userQuestion = req.body.question;

    if (!userQuestion) {
        return res.status(400).json({ error: 'Question is required.' });
    }

    try {
        const prompt = `
            You are a helpful assistant that understands natural language queries about voter data.
            Your task is to parse a user's question and extract their intent and any relevant parameters into a JSON object.

            Here are the intents you should recognize and their parameters:
            - "get_total_voters": When the user asks for the total count of voters.
            - "calculate_voter_turnout": When the user asks for the percentage of voters who voted, possibly within a date range. Parameters: "startDate" (YYYY-MM-DD), "endDate" (YYYY-MM-DD). If dates are not explicitly mentioned, infer a broad range like "2015-01-01" to current date.
            - "get_voters_by_party": When the user asks for the number of voters affiliated with a specific party. Parameter: "partyName" (e.g., "Democrat", "Republican", "Independent", "No Party Preference", "Green", "Other").
            - "get_voters_by_status": When the user asks for the number of voters with a specific status (e.g., "Active", "Inactive", "Provisional"). Parameter: "voterStatus".
            - "list_unique_values": When the user asks for a list of unique values from a specific data field. Parameter: "fieldName" (e.g., "registration_date", "party_affiliation", "voter_status", "zip_code", "last_voted_election"). If the user asks for "dates", assume they mean "registration_date" or "last_voted_election" and you can choose the most appropriate one or ask for clarification.

            If you cannot understand the query or extract a clear intent/parameters, use "unclear_query" intent and provide a "reason".

            ---
            User's question: "${userQuestion}"

            Respond ONLY with a JSON object. Do NOT include any other text, explanations, or conversational filler before or after the JSON.
            Example for total voters: {"intent": "get_total_voters"}
            Example for turnout: {"intent": "calculate_voter_turnout", "parameters": {"startDate": "2020-01-01", "endDate": "2020-12-31"}}
            Example for party: {"intent": "get_voters_by_party", "parameters": {"partyName": "Democrat"}}
            Example for status: {"intent": "get_voters_by_status", "parameters": {"voterStatus": "Active"}}
            Example for unique values (e.g., for "list all party affiliations" or "what parties are there?"): {"intent": "list_unique_values", "parameters": {"fieldName": "party_affiliation"}}
            Example for unique dates (e.g., for "list all registration dates" or "what are the dates in the dataset?"): {"intent": "list_unique_values", "parameters": {"fieldName": "registration_date"}}
            Example for unclear: {"intent": "unclear_query", "reason": "Could not understand specific request or parameters."}
            `;

        const generationConfig = {
            responseMimeType: "application/json",
        };

        const result = await model.generateContent(prompt, generationConfig);
        let rawResponseText = result.response.text();

        console.log("Gemini Raw Response:", rawResponseText);

        let cleanedResponseText = rawResponseText.trim();
        let llmParsed;

        try {
            const jsonBlockMatch = cleanedResponseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonBlockMatch && jsonBlockMatch[1]) {
                cleanedResponseText = jsonBlockMatch[1].trim();
            } else {
                cleanedResponseText = cleanedResponseText.replace(/^[`\s]*|[`\s]*$/g, '').trim();
            }

            console.log("Gemini Cleaned Response (before parse):", cleanedResponseText);

            llmParsed = JSON.parse(cleanedResponseText);

        } catch (parseError) {
            console.error("Error parsing Gemini JSON response:", parseError);
            console.error("Problematic (final cleaned) response text that failed parsing:", cleanedResponseText);
            return res.status(500).json({ error: 'Failed to parse LLM response. Invalid JSON.', llmResponse: cleanedResponseText });
        }

        let answer = "I'm sorry, I couldn't process that request.";

        // --- CORRECTLY PLACED LOGIC FOR list_unique_values ---
        if (llmParsed.intent === 'list_unique_values' && llmParsed.parameters && llmParsed.parameters.fieldName) {
            const { fieldName } = llmParsed.parameters;

            if (!mockVoterData[0].hasOwnProperty(fieldName)) {
                answer = `I'm sorry, I don't have a field named "${fieldName}" in the voter data. Available fields are: ${Object.keys(mockVoterData[0]).join(', ')}.`;
            } else {
                const uniqueValues = [...new Set(mockVoterData.map(voter => voter[fieldName]))]
                    .filter(value => value !== undefined && value !== null && value !== 'N/A')
                    .sort();

                if (uniqueValues.length > 0) {
                    answer = `Unique values for "${fieldName}": ${uniqueValues.join(', ')}.`;
                } else {
                    answer = `No unique values found for "${fieldName}".`;
                }
            }
        }
        // --- End of list_unique_values logic (moved higher in the chain) ---
        else if (llmParsed.intent === 'get_total_voters') {
            const totalVoters = mockVoterData.length;
            answer = `There are a total of ${totalVoters} registered voters in the dataset.`;
        } else if (llmParsed.intent === 'calculate_voter_turnout' && llmParsed.parameters) {
            const { startDate, endDate } = llmParsed.parameters;

            if (isNaN(new Date(startDate)) || isNaN(new Date(endDate)) || !startDate || !endDate) {
                answer = "I'm sorry, I couldn't understand the dates in your query. Please provide valid date ranges (e.g., '2020-04-01 and 2025-04-30').";
            } else {
                const votersRegisteredInPeriod = applyFiltersForLLM(mockVoterData, { startDate, endDate });

                const votedInPeriod = votersRegisteredInPeriod.filter(voter =>
                    voter.last_voted_election && voter.last_voted_election !== 'N/A' &&
                    new Date(voter.last_voted_election) >= new Date(startDate) &&
                    new Date(voter.last_voted_election) <= new Date(endDate)
                ).length;

                const percentage = votersRegisteredInPeriod.length > 0
                    ? ((votedInPeriod / votersRegisteredInPeriod.length) * 100).toFixed(2)
                    : 0;

                answer = `Between ${startDate} and ${endDate}: Out of ${votersRegisteredInPeriod.length} registered voters, ${votedInPeriod} voted. That's a ${percentage}% turnout.`;
            }
        } else if (llmParsed.intent === 'get_voters_by_party' && llmParsed.parameters && llmParsed.parameters.partyName) {
            const { partyName } = llmParsed.parameters;
            const filteredByParty = mockVoterData.filter(voter =>
                voter.party_affiliation && voter.party_affiliation.toLowerCase() === partyName.toLowerCase()
            ).length;
            answer = `There are ${filteredByParty} voters affiliated with the "${partyName}" party.`;
        } else if (llmParsed.intent === 'get_voters_by_status' && llmParsed.parameters && llmParsed.parameters.voterStatus) {
            const { voterStatus } = llmParsed.parameters;
            const filteredByStatus = mockVoterData.filter(voter =>
                voter.voter_status && voter.voter_status.toLowerCase() === voterStatus.toLowerCase()
            ).length;
            answer = `There are ${filteredByStatus} voters with "${voterStatus}" status.`;
        } else if (llmParsed.intent === 'unclear_query') {
            answer = `I'm sorry, I couldn't understand that request. Reason: ${llmParsed.reason || 'N/A'}. Please try rephrasing.`;
        } else {
            // This fallback should now be hit less frequently if intents are mapped correctly
            answer = "I'm sorry, I received an unexpected response structure from the AI. Please try again.";
        }

        res.json({ answer });

    } catch (error) {
        console.error('Outer catch: Error calling Gemini API or processing data:', error);
        res.status(500).json({ error: 'Failed to process your query. Please check backend logs for details.' });
    }
});

module.exports = router;