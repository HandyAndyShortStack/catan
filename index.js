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

  DiceRoller.prototype.probabilities = function() {
    var probabilities = this.remainingRollsCountMap();

    for (var number in probabilities) {
      var count = probabilities[number];
      if (count === 0) {
        var frequency = 0;
      } else {
        var frequency = count / remainingRolls.call(this).length;
      }
      probabilities[number] = frequency * 36;
    }

    return probabilities;
  };

  DiceRoller.prototype.remainingRollsCountMap = function () {
    var countMap = Object.create(null);

    allNumbers().forEach(function(number) {
      countMap[number] = 0;
    });

    remainingRolls.call(this).forEach(function(number) {
      countMap[number] += 1;
    });

    return countMap;
  }

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

  function remainingRolls() {
    var remainingRolls = this.rolls.slice(this.currentRollIndex);
    var dummyRoller;

    if (!(remainingRolls.length === 0)) return remainingRolls;

    // get a fully stacked rolls array to anticipate the first roll of a cycle
    dummyRoller = {rolls: []};
    generateRolls.call(dummyRoller);
    return dummyRoller.rolls;
  }

  function allNumbers() {
    return Object.keys(numbersAndProbabilities());
  }

  return DiceRoller;
})();

var TextRenderer = (function () {
  function TextRenderer(config) {
    this.displayElements = config.displayElements;
  }

  TextRenderer.prototype.render = function(text, probabilities, counts, deck) {
    for (var i = 0; i < this.displayElements.length; i++) {
      this.displayElements[i].textContent = text;
    }
    this.displayProbabilities(probabilities);
    this.displayCounts(counts);
    this.displayGraphs(deck);
  };

  TextRenderer.prototype.displayProbabilities = function(probabilities) {
    for (var number in probabilities) {
      var outputEl = document.getElementById('value-' + number + '-probability');
      outputEl.textContent = probabilities[number].toFixed(1).toString();
    }
  };

  TextRenderer.prototype.displayCounts = function(counts) {
    for (var number in counts) {
      var outputEl, dots = "";
      outputEl = document.getElementById('value-' + number + '-count');
      for (var i = 0; i < counts[number]; i++) {
        dots += ".";
      }
      outputEl.textContent = dots;
    }
  };

  TextRenderer.prototype.displayGraphs = function(deck) {
    var graphs = catanGraphs(deck, numbersAndProbabilities());
    for (var number in numbersAndProbabilities()) {
      var outputEl = document.getElementById('value-' + number + '-graph');
      if (outputEl.firstChild) {
        outputEl.removeChild(outputEl.firstChild);
      }
      outputEl.appendChild(graphs[number]);
    }
  };

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
    var counts = diceRoller.remainingRollsCountMap();
    var deck = diceRoller.rolls.slice(diceRoller.currentRollIndex);
    textRenderer.render(roll, probabilities, counts, deck);
  }

  for (var i = 0; i < triggerElements.length; i++) {
    triggerElements[i].addEventListener("click", diceRollHandler, false);
  }

  textRenderer.displayProbabilities(diceRoller.probabilities());
  textRenderer.displayCounts(diceRoller.remainingRollsCountMap());
  textRenderer.displayGraphs(diceRoller.rolls.slice(diceRoller.currentRollIndex));
}

window.addEventListener("load", main, false);
