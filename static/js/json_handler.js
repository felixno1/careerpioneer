document.addEventListener('DOMContentLoaded', function() {

    // Load and parse the JSON data
    function loadJSON(filename, callback) {
        var xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', filename, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(null);
    }

    // Function to get nested data using a dot notation key
    function getNestedData(obj, key) {
        return key.split('/').reduce((o, i) => (o ? o[i] : null), obj);
    }

// Function to display JSON data dynamically
function displayJSON(data) {
    // Update simple text content
    document.querySelectorAll('[data-type="text"]').forEach(function (element) {
        const key = element.getAttribute('data');
        const value = getNestedData(data, key);
        if (value) {
            element.textContent = value;
        }
    });

    // Update content loops
    document.querySelectorAll('[data-type="forloop"]').forEach(function (element) {
        const key = element.getAttribute('data');
        const items = getNestedData(data, key);
        if (Array.isArray(items)) {
            const parent = element.parentNode;
            const template = element.cloneNode(true); // Clone the element with children for the template
            element.style.display = 'none'; // Hide the original template element

            // Clear existing loop elements
            parent.querySelectorAll('[data-type="forloop"]').forEach(function (child) {
                if (child !== element) {
                    child.remove();
                }
            });

            items.forEach(function (item) {
                const itemElement = template.cloneNode(true); // Clone the template for each item
                for (let i = 0; i < element.children.length; i++) {
                    const child = element.children[i].cloneNode(true); // Clone each child element
                }
                Object.keys(item).forEach(function (itemKey) {
                    const child = itemElement.querySelector(`[item="${itemKey}"]`);
                    if (child) {
                        child.textContent = item[itemKey];
                    }
                });
                const button = itemElement.querySelector('button');
                const link = item['link']; // Assuming 'link' is the key for the link in your JSON data
                if (button && link) {
                    button.setAttribute('onclick', `newTab('${link}')`);
                }
                itemElement.style.display = ''; // Make the cloned element visible
                parent.appendChild(itemElement);
            });
        }
    });
}


    // Function to load and display JSON data
    function loadAndDisplayJSON(filename) {
        const lang = getCookie('lang');
        const langFilename = `locales/${lang}/lang.json`;
        loadJSON(langFilename, function (data) {
            displayJSON(data);
        });
    }

    // Load JSON based on the language from the cookie
    loadAndDisplayJSON();

});
