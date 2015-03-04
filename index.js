Array.prototype.shuffle = function () {
  var currentIndex = this.length, temp, rand;

  while (currentIndex !== 0) {
    rand = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temp = this[currentIndex];
    this[currentIndex] = this[rand];
    this[rand] = temp;
  }
};

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
  };
}

var DiceRoller = (function () {
  function DiceRoller() {
    this.currentRollIndex = 0;
    this.rolls = [];
  }

  DiceRoller.prototype.rollDice = function () {
    var roll;

    if (!this.rolls[this.currentRollIndex]) {
      generateRolls.call(this);
    }

    roll = this.rolls[this.currentRollIndex];

    this.currentRollIndex += 1;
    return roll;
  };

  function generateRolls() {
    var localNumbersAndProbabilities = numbersAndProbabilities(),
    generated = [],
    i, prop;

    // adds each dice number to 'generated' as many times as
    // it is likely to appear on average in 36 rolls
    for (prop in localNumbersAndProbabilities) {
      for (i = 0; i < localNumbersAndProbabilities[prop]; i++)
        generated.push(prop);
    }

    generated.shuffle();

    this.rolls.push.apply(this.rolls, generated);
  }

  DiceRoller.prototype.probabilities = function() {
    var _numbersAndProbabilities = numbersAndProbabilities();
    var allNumbers = Object.keys(_numbersAndProbabilities);
    var remainingRolls = this.rolls.slice(this.currentRollIndex);

    // get a fully stacked rolls array to anticipate the first roll of a cycle
    if (remainingRolls.length === 0) {
      var dummyRoller = {rolls: []};
      generateRolls.call(dummyRoller);
      remainingRolls = dummyRoller.rolls;
    }

    var probabilityMap = Object.create(null);
    allNumbers.forEach(function(number) {
      probabilityMap[number] = 0;
    });
    remainingRolls.forEach(function(number) {
      probabilityMap[number] += 1;
    });
    for (var number in probabilityMap) {
      var count = probabilityMap[number];
      if (count === 0) {
        var frequency = 0;
      } else {
        var frequency = count / remainingRolls.length;
      }
      probabilityMap[number] = frequency * 36;
    }
    return probabilityMap;
  };

  return DiceRoller;
})();

var TextRenderer = (function () {
  function TextRenderer(config) {
    this.displayElements = config.displayElements;
  }

  TextRenderer.prototype.render = function(text, probabilities) {
    for (var i = 0; i < this.displayElements.length; i++) {
      this.displayElements[i].textContent = text;
    }
    this.displayProbabilities(probabilities);
  };

  TextRenderer.prototype.displayProbabilities = function(probabilities) {
    for (var number in probabilities) {
      var outputEl = document.getElementById('value-' + number);
      outputEl.textContent = probabilities[number].toFixed(3).toString();
    }
  }

  return TextRenderer;
})();

function main() {
  var triggerElements, diceRollHandler, diceRoller, textRenderer;

  diceRoller = new DiceRoller();
  textRenderer = new TextRenderer({
    displayElements: document.querySelectorAll('.roll-result')
  });

  triggerElements = document.querySelectorAll('.roll-dice');

  diceRollHandler = function (e) {
    var roll = diceRoller.rollDice();
    var probabilities = diceRoller.probabilities();
    textRenderer.render(roll, probabilities);
  }

  for (var i = 0; i < triggerElements.length; i++) {
    triggerElements[i].addEventListener("click", diceRollHandler, false);
  }

  textRenderer.displayProbabilities(diceRoller.probabilities());
}

window.addEventListener("load", main, false);
