/**
 * Returns a function to set the value of a given HTML DOM node.
 * 
 * The HTMLElement should have a 'data-bind' attribute assigned a value to be
 * passed in as the 'attribute' parameter.
 * 
 * NOTE: 'data-bind' values are expected to be UNIQUE! Non-unique usage may
 * lead to unexpected outcomes.
 * 
 * @param {string} attribute    The 'data-bind' attribute value of an HTML DOM node.
 * @param {*} default_value     The default value you want the node to have.
 * 
 * @returns {Array} Returns an array where the first element is a getter and the second
 *                  is a setter for the given HTMLElement.
 */
function buildHTMLSetter(attribute, default_value=undefined) {
    let html_element = document.querySelector(`[data-bind="${attribute}"]`);
    if (html_element === null) {
        throw new Error(`Could not find 'data-bind' attribute '${attribute}'`)
    }

    html_element.innerText = default_value;

    let getter = () => html_element.innerText;
    let setter = (new_value) => html_element.innerText = new_value;
    return [getter, setter];
}