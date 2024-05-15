# Windows instructions
## Setup:
### Install modules
    pip install -r requirements.txt

### Create virtual environment
    python -m venv virt

### Activate virt:
    virt\Scripts\activate

### Set flask to developer-mode
    set FLASK_ENV=development

### Specify flask-app
    $env:FLASK_APP="main.py"

### Start local server, try:
    flask run
    python -m flask run

### Error 403 Fix
1. In browser, go to ```chrome://net-internals/#sockets```
2. Press [Flush socket pools]

## OpenAI instructions
1. In ```config.txt```
    ```
    ENABLE_GPT = True
    ```
2. Create a file called ```.env```
3. In the file, write ```api_key=your_api_key``` (No quotation-marks!)
- **Example**:
    ```
    api_key=ej_29138u92131239h123812983h1239
    ```
> [!CAUTION]
> Make sure ```.env``` is added to ```.gitignore```

## Enable data-collection
1. In ```config.txt```
    ```
    COLLECT_DATA = True
    WORKBOOK_NAME = "workbook_shared_with_your_api_key"
    ```
2. Create a folder called ```private_keys```
3. Add your Google API key to the folder (Drive API and Sheets API have to be enabled)
4. Rename the JSON-file to ```google_api.json```

> [!CAUTION]
> Make sure ```private_keys``` is added to ```.gitignore```
