const fetch = require('node-fetch').default; // Correctly import node-fetch

const testRequest = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: "Test request" }),
        });

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
};

testRequest();
