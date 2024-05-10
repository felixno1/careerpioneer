import requests
import json

url = 'https://jobsearch.api.jobtechdev.se'
url_for_search = f"{url}/search"

def _get_ads(params):
    headers = {'accept': 'application/json'}
    response = requests.get(url_for_search, headers=headers, params=params)
    response.raise_for_status()  # check for http errors
    return json.loads(response.content.decode('utf8'))


def search_number_of_hits(query):
    # limit: 0 means no ads, just a value of how many ads were found.
    search_params = {'q': query, 'limit': 0}
    json_response = _get_ads(search_params)
    number_of_hits = json_response['total']['value']
    return number_of_hits


def example_search_loop_through_hits(query):
    # limit = 100 is the max number of hits that can be returned.
    # If there are more (which you find with ['total']['value'] in the json response)
    # you have to use offset and multiple requests to get all ads.
    search_params = {'q': query, 'limit': 100}
    json_response = _get_ads(search_params)
    hits = json_response['hits']
    for hit in hits:
        print(f"{hit['headline']}, {hit['employer']['name']}")


def search_jobs(job, location):
    query = f'{job} {location}'
    example_search_loop_through_hits(query)