const url = 'https://jobsearch.api.jobtechdev.se';
const urlForSearch = `${url}/search`;


async function getAds(params) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${urlForSearch}?${queryString}`, {
        headers: { 'Accept': 'application/json' }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function searchNumberOfHits(query) {
    const searchParams = { q: query, limit: 0 };
    const jsonResponse = await getAds(searchParams);
    const numberOfHits = jsonResponse.total.value;
    return numberOfHits;
}


async function searchAdsEmployer(query) {
    const searchParams = { q: query, limit: 100 };
    const jsonResponse = await getAds(searchParams);
    const hits = jsonResponse.hits;
    return hits.map(hit => {
        return {
            employerName: hit.employer.workplace,
            url: hit.webpage_url,
            location: hit.workplace_address.region,
            // Include other properties you need from the hit object
            // For example:
            // jobTitle: hit.job.title,
            // etc.
        };
    });
}