(function() {
  var svgns = 'http://www.w3.org/2000/svg';

  var defaults = {
    maxTurns: 60,
    height: 100,
    width: 800,
    paddingPercent: 10
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

    var elements = Object.create(null);
    for (var key in frequencyMap) {

      var svg = document.createElementNS(svgns, 'svg');
      svg.setAttributeNS(null, 'height', config.height);
      svg.setAttributeNS(null, 'width', config.width);
      svg.style.display = 'block';

      var circle = document.createElementNS(svgns, 'circle');
      circle.setAttributeNS(null, 'cx', 50);
      circle.setAttributeNS(null, 'cy', 50);
      circle.setAttributeNS(null, 'r', 50);
      circle.style.fill = 'red';

      svg.appendChild(circle);

      elements[key] = svg;
    }
    return elements;
  };
})();
