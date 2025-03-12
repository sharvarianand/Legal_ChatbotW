// ...existing code...

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch:', error);
        // Handle the error appropriately in your application
    }
}

// Example usage
fetchData('https://api.example.com/data')
    .then(data => {
        console.log(data);
        // ...existing code...
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// ...existing code...
