<h1 style="border-bottom: none;" align='center'>🔎InternalToolingTool📈</h1>

![blueline](./frontend/public/darkbluegradientline.png)
## About
This self-service data exploration tool represents an internal application developed to help data analysts and business personnel within the organization by enabling them to independently access, filter, and export data.

It is often the case that data engineers are frequently called upon to extract specific data subsets per direct requests, which often results in delays and an increased workload. This tool has been designed to optimize this process by providing an interface for common data querying requirements.

## Objectives

+ User Autonomy: To facilitate the independent retrieval of specific voter data by non-technical users, thereby reducing the dependency on engineers.

+ Operational Efficiency: To decrease the turnaround time associated with data requests, consequently optimizing the allocation of data engineering resources for more complex and strategic initiatives.

+ Accessibility: To establish a centralized and user-friendly platform that promotes efficient data exploration and extraction.

## Core Functionalities:

+ Filtering Capabilities: 
Users are afforded the ability to refine voter records based on several criteria, including:

  + Registration date ranges.

  + Political party affiliation.

  + Voter registration status (e.g., active, inactive).

  + Specific voter identification numbers or postal codes.

+ Real-time Data Preview: A dynamic tabular display presents the initial 20 records of the filtered dataset, allowing users to validate their selection parameters prior to initiating a comprehensive export.

+ Flexible Data Export: The filtered data can be exported into two widely recognized formats:

  + Comma Separated Values (CSV).

  + Microsoft Excel (.xlsx) spreadsheets.

This tool has been constructed utilizing the following technologies:  
Frontend : React + Vite  
Server: Node / Express  
UI: MUI  




https://github.com/user-attachments/assets/97e47a5a-41dd-4cb1-8316-d5592354df90



https://github.com/user-attachments/assets/b7d678c7-6c32-48bc-9aaf-46ec5a5224bb




https://github.com/user-attachments/assets/ab515709-7d64-4fa0-8404-96a9e2e162ad


## Run
1. clone
2. Optain a free api key from google:[google api key link](https://aistudio.google.com/apikey)
3. install the following:  
` npm install express cors csv-stringify xlsx-populate`  
`npm install @mui/material @emotion/react @emotion/styled @mui/x-date-pickers date-fns`  
 `npm install @fontsource/inter`  
 `npm install @google/generative-ai`  
 `dotenv`
4. frontend: create .env file with `VITE_API_URL=http://localhost:5000`  
backend: create .env file with   `REACT_APP_API_URL=http://localhost:5000` and
`GEMINI_API_KEY=your key here`
5. frontend,backend: `npm install` 
6. frontend :`npm run dev`  
backend: `node server.js`
  
   

