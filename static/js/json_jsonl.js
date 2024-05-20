
function loadJSON(filename, callback) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.open('GET', filename, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Split response text into lines for JSONL processing
            const lines = xhr.responseText.trim().split('\n');
            // Parse each line as JSON
            const jsonData = lines.map(line => JSON.parse(line));
            callback(jsonData);
        }
    };
    xhr.send(null);
}
// Function to load and display JSON file
async function loadAndDisplayJSON(url) {
    try {
        const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to load JSON: ' + response.status);
        }
    } catch (error) {
        throw new Error('Error fetching JSON: ' + error.message);
    }
}
// Function to load JSONL file
function loadJSONL(filename) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', filename, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                } else {
                    reject(new Error('Failed to load JSON: ' + xhr.status));
                }
            }
        };
        xhr.send(null);
    });
}

// Function to convert JSONL to an array of objects
function parseJSONL(jsonlData) {
    return jsonlData.trim().split('\n').map(function(line) {
        return JSON.parse(line);
    });
}

