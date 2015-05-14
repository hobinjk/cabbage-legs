/**
 * Create a new NumberInput element
 * @param {String} text
 * @param {number} low
 * @param {number} high
 * @param {Object} object
 * @param {String} key
 * @param {boolean} isInteger
 * @constructor
 */
function NumberInput(text, low, high, object, key, isInteger) {
  this.text = text;
  this.low = low;
  this.high = high;
  this.object = object;
  this.key = key;
  this.isInteger = isInteger;
}

/**
 * Add the NumberInput to the DOM
 * @param {Element} parentElement
 */
NumberInput.prototype.add = function(parentElement) {
  this.containerElement = document.createElement('tr');
  this.containerElement.classList.add('number-input-row');

  this.labelElement = document.createElement('span');
  this.labelElement.classList.add('number-input-label');
  this.labelElement.textContent = this.text;

  this.rangeElement = document.createElement('input');
  this.rangeElement.classList.add('number-input-range');
  this.rangeElement.type = 'range';
  if (!this.isInteger) {
    this.rangeElement.step = (this.high - this.low) / 100;
  }
  this.rangeElement.value = this.object[this.key];
  this.rangeElement.min = this.low;
  this.rangeElement.max = this.high;

  this.displayElement = document.createElement('span');
  this.displayElement.classList.add('number-input-display');
  this.displayElement.textContent = this.object[this.key];

  var containerElement = this.containerElement;

  function appendChild(elt) {
    var cell = document.createElement('td');
    cell.classList.add('number-input-cell');
    cell.appendChild(elt);
    containerElement.appendChild(cell);
  }

  appendChild(this.labelElement);
  appendChild(this.rangeElement);
  appendChild(this.displayElement);

  parentElement.appendChild(this.containerElement);

  this.addEventListeners();
};

/**
 * Add event listeners to the range element
 */
NumberInput.prototype.addEventListeners = function() {
  this.rangeElement.addEventListener('change', this.update.bind(this));
  this.rangeElement.addEventListener('input', this.update.bind(this));
};

/**
 * Update the control
 */
NumberInput.prototype.update = function() {
  var newValue = parseFloat(this.rangeElement.value);
  if (this.object[this.key] === newValue) {
    return;
  }
  this.displayElement.textContent = newValue;
  this.object[this.key] = newValue;
};
