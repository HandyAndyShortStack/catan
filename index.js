Array.prototype.shuffle = function() {
  var currentIndex = this.length, temp, rand;

  while (currentIndex !== 0) {
    rand = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temp = this[currentIndex];
    this[currentIndex] = this[rand];
    this[rand] = temp;
  }
}

// these map to the numbers and probability dots
// found on the Catan board
function numbersAndProbabilities() {
  return {
    2:  1,
    3:  2,
    4:  3,
    5:  4,
    6:  5,
    7:  6,
    8:  5,
    9:  4,
    10: 3,
    11: 2,
    12: 1
  }
}

var DiceRoller = (function() {
  function DiceRoller(config) {
    var that = this;

    this.currentRollIndex = 0;
    this.rolls = [];
  }

  DiceRoller.prototype.rollDice = function() {
    var roll;

    if (!this.rolls[this.currentRollIndex]) {
      generateRolls.call(this);
    }

    roll = this.rolls[this.currentRollIndex];

    this.currentRollIndex += 1;
    return roll;
  }

  function generateRolls() {
    var localNumbersAndProbabilities = numbersAndProbabilities();
    var generated = [];
    var i;

    // adds each dice number to 'generated' as many times as
    // it is likely to appear on average in 36 rolls
    for (var prop in localNumbersAndProbabilities) {
      for (i = 0; i < localNumbersAndProbabilities[prop]; i++)
        generated.push(prop);
    }

    generated.shuffle();

    this.rolls.push.apply(this.rolls, generated);
  }

  return DiceRoller;
})();

var TextRenderer = (function () {
  function TextRenderer(config) {
    this.displayElements = config.displayElements;
  }

  TextRenderer.prototype.render = function (text) {
    for (var i = 0; i < this.displayElements.length; i++)
      this.displayElements[i].textContent = text;
  }

  return TextRenderer;
})();

function main() {
  var triggerElements, diceRollHandler;
  var diceRoller, textRenderer;

  diceRoller = new DiceRoller();
  textRenderer = new TextRenderer({
    displayElements: document.querySelectorAll('.roll-result')
  });

  triggerElements = document.querySelectorAll('.roll-dice');

  diceRollHandler = function(e) {
    var roll = diceRoller.rollDice();
    textRenderer.render(roll);
  }

  for (var i = 0; i < triggerElements.length; i++ )
    triggerElements[i].addEventListener("click", diceRollHandler, false);
}

window.addEventListener("load", main, false);
