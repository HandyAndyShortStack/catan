(function() {
  var svgns = 'http://www.w3.org/2000/svg';

  var defaults = {
    maxTurns: 60,
    height: 100,
    width: 800,
    paddingPercent: 10,
    xTick: 10,
    yTick: 10
  };

  var catanGraphs = window.catanGraphs = function(currentDeck, frequencyMap, config) {
    // if we only had direct access to objects' prototype chains...
    if (typeof config === 'undefined') {
      config = defaults;
    } else {
      for (var key in defaults) {
        if (!Object.hasOwnProperty.call(config, key)) {
          config[key] = defaults[key];
        }
      }
    }

    var fullDeckLength = Object.keys(frequencyMap).map(function(key) {
      return frequencyMap[key];
    }).reduce(function(a, b) {
      return a + b;
    });

    var elements = Object.create(null);
    for (var key in frequencyMap) {

      var svg = document.createElementNS(svgns, 'svg');
      svg.setAttributeNS(null, 'height', config.height);
      svg.setAttributeNS(null, 'width', config.width);
      svg.style.display = 'block';

      var graph = document.createElementNS(svgns, 'g');
      svg.appendChild(graph);

      var xAxis = document.createElementNS(svgns, 'g');
      graph.appendChild(xAxis);
      var xLine = document.createElementNS(svgns, 'line');
      xAxis.appendChild(xLine);
      xLine.setAttributeNS(null, 'x1', 0);
      xLine.setAttributeNS(null, 'y1', config.height);
      xLine.setAttributeNS(null, 'x2', config.width);
      xLine.setAttributeNS(null, 'y2', config.height);
      xLine.style.stroke = 'blue';
      xLine.style.strokeWidth = 5;
      for (var i = config.xTick; i <= config.maxTurns; i += config.xTick) {
        var tick = document.createElementNS(svgns, 'line');
        var x = i / config.maxTurns * config.width;
        xAxis.appendChild(tick);
        tick.setAttributeNS(null, 'x1', x);
        tick.setAttributeNS(null, 'y1', config.height + 5);
        tick.setAttributeNS(null, 'x2', x);
        tick.setAttributeNS(null, 'y2', config.height - 5);
        tick.style.stroke = 'blue';
        tick.style.strokeWidth = 5;
      }

      var yAxis = document.createElementNS(svgns, 'g');
      graph.appendChild(yAxis);
      var yLine = document.createElementNS(svgns, 'line');
      yAxis.appendChild(yLine);
      yLine.setAttributeNS(null, 'x1', 0);
      yLine.setAttributeNS(null, 'y1', config.height);
      yLine.setAttributeNS(null, 'x2', 0);
      yLine.setAttributeNS(null, 'y2', 0);
      yLine.style.stroke = 'blue';
      yLine.style.strokeWidth = 5;
      for (var i = config.yTick; i <= fullDeckLength; i += config.yTick) {
        var tick = document.createElementNS(svgns, 'line');
        var y = config.height - ((i / fullDeckLength) * config.height);
        yAxis.appendChild(tick);
        tick.setAttributeNS(null, 'x1', -5);
        tick.setAttributeNS(null, 'y1', y);
        tick.setAttributeNS(null, 'x2', 5);
        tick.setAttributeNS(null, 'y2', y);
        tick.style.stroke = 'blue';
        tick.style.strokeWidth = 5;
      }

      elements[key] = svg;
    }
    return elements;
  };
})();
