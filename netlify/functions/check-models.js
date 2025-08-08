exports.handler = async function(event, context) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { statusCode: 500, body: "API Key not found." };
    }

    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    console.log("Attempting to list available models...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("SUCCESS! Your available models are listed below:");
        console.log(JSON.stringify(data, null, 2));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data, null, 2),
        };
    } catch (error) {
        console.error("Failed to list models:", error);
        return { statusCode: 500, body: "Failed to list models. Check the function log for details." };
    }
};