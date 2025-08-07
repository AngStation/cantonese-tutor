exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Get the API key from secure environment variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
         return { statusCode: 500, body: 'API key not found.' };
    }

    // The Gemini API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
        // Pass the request body from your frontend to the Gemini API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: event.body,
        });

        if (!response.ok) {
            const errorBody = await response.text();
            // ADD THIS LINE to log the specific error from Google
            console.error('Error from Google API:', errorBody); 
            return { statusCode: response.status, body: errorBody };
        }

        const data = await response.json();

        // Return the successful response to your frontend
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        // MODIFY THIS LINE to log any other function error
        console.error('Error in function execution:', error); 
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
