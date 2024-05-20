async function loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}

async function loadJSONL(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
}

async function getTranslation(title, lang) {
    console.log('Searching for translation of title:', title);
    const translations = await loadJSONL(`locales/${lang}/jobs.jsonl`);
    console.log('Translations:', translations);
    const translationEntry = translations.find(entry => entry.job === title);
    console.log('Translation entry:', translationEntry);
    return translationEntry ? translationEntry.translation : null;
}

function applyTfIdfVectorizer(text, vectorizerConfig) {
    if (!vectorizerConfig || typeof vectorizerConfig.vocabulary !== 'object') {
        throw new Error("Vectorizer configuration is invalid.");
    }

    const vocabulary = Object.keys(vectorizerConfig.vocabulary);
    const tfidf = new Array(vocabulary.length).fill(0);
    const words = text.split(/\s+/);

    words.forEach(word => {
        const index = vectorizerConfig.vocabulary[word];
        if (index !== undefined) {
            tfidf[index] += 1;
        }
    });

    return tfidf;
}

async function updateJobBtn(jobBtn, numberOfHits, langData) {
    try {
        const ads = langData["ads"];
        jobBtn.appendChild(document.createElement('div'));
        jobBtn.lastChild.textContent = `${numberOfHits} ${ads}`;
        jobBtn.lastChild.classList.add('job-btn-content');
    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred while updating job button.");
    }
}

async function updateJobBtns(jobBtns) {
    try {
        const lang = getCookie('lang');
        const langData = await loadJSON(`locales/${lang}/lang.json`);
        const adsContainer = document.getElementById('ads-container');

        // Create an array of promises for updating each job button
        const updatePromises = Array.from(jobBtns).map(async jobBtn => {
            const title = jobBtn.getAttribute('data-title');
            const numberOfHits = await searchNumberOfHits(title);
            const ads = await searchAdsEmployer(title);

            // Create a div to hold ads for this title
            const adDiv = document.createElement('div');
            adDiv.id = `ads-${title}`;
            adDiv.classList.add('ad-div');
            adDiv.setAttribute('connection', title);
            adsContainer.appendChild(adDiv);

            // Display information about each ad
            ads.forEach(ad => {
                const adButton = document.createElement('button');
                adButton.className = 'ad';
                adButton.innerHTML = `<b>${ad.employerName}</b>, ${ad.location}`;
                adButton.onclick = function() {
                    newTab(ad.url);
                };
                adDiv.appendChild(adButton);
            });

            // Update job button with number of hits
            await updateJobBtn(jobBtn, numberOfHits, langData);
        });

        // Wait for all job buttons to be updated
        await Promise.all(updatePromises);
        
        // Add active class and set up button click handlers
        document.querySelector('.job-btn').classList.add('active');
        document.querySelector('.ad-div').classList.add('active');
        turnOnClassOnButtonClick('job-btn', 'active', getElementWithSameConnection);
        turnOnClassOnButtonClick('job-btn', 'active', getSelfElement);
        // Hide the loading container
        const loadingContainer = document.getElementById('loading-container');
        loadingContainer.style.display = 'none';

        // Show the jobs container
        const jobsContainer = document.getElementById('jobs-container');
        jobsContainer.style.display = 'flex';

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred while updating job buttons.");
    }
}

async function predictJobs(inputText) {
    try {
        // Load the TF-IDF vectorizer configuration
        const vectorizerConfig = await loadJSON('vectorizer.json');

        // Vectorize the input text
        const inputVector = applyTfIdfVectorizer(inputText, vectorizerConfig);

        // Load the model
        const loadedModel = await tf.loadLayersModel('tfjs_model/model.json');

        // Perform inference
        const inputTensor = tf.tensor2d([inputVector]);
        const predictionTensor = loadedModel.predict(inputTensor);
        const prediction = await predictionTensor.array();

        // Load the LabelEncoder JSON
        const labelEncoderJSON = await loadJSON('label_encoder.json');

        // Ensure the classes array exists
        if (!Array.isArray(labelEncoderJSON.classes)) {
            throw new Error("Label encoder configuration is invalid.");
        }

        // Inverse transform the top n indices to class labels
        const n = 5;
        const topNIndices = prediction[0].map((_, i) => i).sort((a, b) => prediction[0][b] - prediction[0][a]).slice(0, n);
        const topNClasses = topNIndices.map(index => labelEncoderJSON.classes[index]);

        // Prepare the output format
        const results = topNClasses.map((className, i) => ({
            title: className,
            percentage: (prediction[0][topNIndices[i]] * 100).toFixed(1)
        }));

        // Get the language from the cookie
        const lang = getCookie('lang');

        // Render job buttons with translations
        const translatedResults = await Promise.all(results.map(async result => {
            const translation = await getTranslation(result.title, lang);
            const title = translation || result.title;
            return `<button class="job-btn" data-title="${result.title}" connection="${result.title}">${title} - ${result.percentage}%</button>`;
        }));

        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = translatedResults.join('');

        // Select all job buttons
        const jobBtns = document.querySelectorAll('.job-btn');

        // Update each job button asynchronously and wait for all to complete
        await updateJobBtns(jobBtns);

    } catch (error) {
        console.error("Error:", error);
        alert("Error occurred. See console for details.");
    }
}
