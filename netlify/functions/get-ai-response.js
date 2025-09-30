// This is the complete and corrected backend function.
// It runs on Netlify's servers, not in the user's browser.

exports.handler = async function (event) {
  // Only allow POST requests.
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Get the chat history sent from your index.html file.
    const { prompt } = JSON.parse(event.body);

    // 2. Securely get your API key from Netlify's settings.
    // This line defines the 'apiKey' variable.
    const apiKey = process.env.GEMINI_API_KEY;

    // If the API key is missing, return an error.
    if (!apiKey) {
      throw new Error('API key is not set. Check Netlify environment variables.');
    }

    // 3. Call the real Google AI API from the server using the correct model name.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: prompt,
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
       // Log the detailed error from the Google API
      const errorBody = await response.json();
      console.error('Error from Google API:', errorBody);
      throw new Error(`API error: ${response.statusText}`);
    }

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;

    // 4. Send the AI's response back to the user's browser.
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiText }),
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
