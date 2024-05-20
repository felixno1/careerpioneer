


function toggleClassOnButtonClick(selector, targetClass, targetElementCallback) {
    document.addEventListener('click', function(event) {
        if (event.target.matches('.' + selector)) {
            var targetElement = targetElementCallback(event.target);
            if (targetElement) {
                var firstClass = targetElement.className.split(' ')[0]; // Extract first class
                var elementsWithClass = document.querySelectorAll('.' + targetClass);
                elementsWithClass.forEach(function(element) {
                    var elementFirstClass = element.className.split(' ')[0]; // Extract first class of each element
                    if (elementFirstClass === firstClass && element !== targetElement) {
                        element.classList.remove(targetClass);
                    }
                });
                targetElement.classList.toggle(targetClass);
            }
        }
    });
}

function turnOnClassOnButtonClick(selector, targetClass, targetElementCallback) {
    document.addEventListener('click', function(event) {
        if (event.target.matches('.' + selector)) {
            var targetElement = targetElementCallback(event.target);
            if (targetElement) {
                var firstClass = targetElement.className.split(' ')[0]; // Extract first class
                var elementsWithClass = document.querySelectorAll('.' + targetClass);
                elementsWithClass.forEach(function(element) {
                    var elementFirstClass = element.className.split(' ')[0]; // Extract first class of each element
                    if (elementFirstClass === firstClass && element !== targetElement) {
                        element.classList.remove(targetClass);
                    }
                });
                targetElement.classList.add(targetClass);
            }
        }
    });
}

function addClassOnButtonClick(selector, targetClass, targetElementCallback) {
    document.addEventListener('click', function(event) {
        if (event.target.matches('.' + selector)) {
            var targetElement = targetElementCallback(event.target);
                targetElement.classList.add(targetClass);
        }
    });
}



function getParentElementWithSameConnection(button) {
    var connection = button.getAttribute('connection');
    var parent = button.parentElement;
    while (parent) {
        if (parent.getAttribute('connection') === connection) {
            return parent;
        }
        parent = parent.parentElement;
    }
    return null; // If no parent with the same connection is found
}


function getElementWithSameConnection(me) {
    var connection = me.getAttribute('connection');
    var elementsWithSameConnection = document.querySelectorAll('[connection="' + connection + '"]');
    for (var i = 0; i < elementsWithSameConnection.length; i++) {
        if (elementsWithSameConnection[i] !== me) {
            return elementsWithSameConnection[i];
        }
    }
    return null; // If no element with the same connection except for itself is found
}

function getSelfElement(me) {
    return me; // If no element with the same connection except for itself is found
}

function getElement(id) {
    element = document.getElementById(id);
    return element;
}





toggleClassOnButtonClick('content-button', 'visible', getParentElementWithSameConnection);
turnOnClassOnButtonClick('header-button', 'active', getElementWithSameConnection);
turnOnClassOnButtonClick('header-button', 'active', getSelfElement);
addClassOnButtonClick('skill-btn', 'picked', getSelfElement);

