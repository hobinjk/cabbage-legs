/**
 * Create a new NumberInput element
 * @param {number} low
 * @param {number} high
 * @param {Object} object
 * @param {String} key
 * @param {boolean} isInteger
 * @constructor
 */
function NumberInput(low, high, object, key, isInteger) {
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
  this.containerElement = document.createElement('div');
  this.containerElement.classList.add('number-input-container');

  this.labelElement = document.createElement('span');
  this.labelElement.classList.add('number-input-label');
  this.labelElement.textContent = this.key;

  this.rangeElement = document.createElement('input');
  this.rangeElement.classList.add('number-input-range');
  this.rangeElement.type = 'range';
  this.rangeElement.value = this.object[this.key];
  this.rangeElement.min = this.low;
  this.rangeElement.max = this.high;

  if (!this.isInteger) {
    this.rangeElement.step = (this.high - this.low) / 100;
  }

  this.displayElement = document.createElement('span');
  this.displayElement.classList.add('number-input-display');
  this.displayElement.textContent = this.object[this.key];

  this.containerElement.appendChild(this.labelElement);
  this.containerElement.appendChild(this.rangeElement);
  this.containerElement.appendChild(this.displayElement);

  parentElement.appendChild(this.containerElement);

  this.addEventListeners();
};

/**
 * Add event listeners to the range element
 */
NumberInput.prototype.addEventListeners = function() {
  this.rangeElement.addEventListener('change', this.handleChange.bind(this));
};

/**
 * Handle a change event
 * @param {Event} event
 */
NumberInput.prototype.handleChange = function(event) {
  this.displayElement.textContent = this.rangeElement.value;
  this.object[this.key] = this.rangeElement.value;
};
