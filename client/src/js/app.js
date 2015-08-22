$.ajaxSetup({
  contentType : 'application/json',
  processData : false
});

$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  if (options.data) {
    options.data = JSON.stringify(options.data);
  }
});

$.ajax({
  url: 'http://localhost:5001/urls',
  type: 'GET',
  success: function(urls) {

    var nodeMap = {};
    var links = [];

    for (var i in urls) {
      var url = urls[i];
      nodeMap[url.id] = url;
    }

    for (var key in nodeMap) {
      var val = nodeMap[key]
      if (val.target !== -1) {
        links.push({
          source: nodeMap[val.id],
          target: nodeMap[val.target]
        });
      }
    }

    var selected = null;
    var clickCount = 0;

    var width = 960,
        height = 500;

    var force = d3.layout.force()
        .size([width, height])
        .nodes(d3.values(nodeMap))
        .links(links)
        .linkDistance(50)
        .charge(-200)
        .on("tick", tick);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var nodes = force.nodes(),
        links = force.links(),
        texts = null,
        node = svg.selectAll(".node"),
        link = svg.selectAll(".link");

    restart();

    function restart() {
      link = link.data(links);

      link
        .enter()
        .append("line")
        .attr("class", "link");

      node = node.data(nodes);

      var g = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("r", 5)
        .on("click", clicked)
        .call(force.drag);

      g
        .append("circle")
        .attr("r", 10);

      texts = g
        .append("text")
        .attr("x", 24)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

      node = svg.selectAll(".node");

      force.start();
    }

    function refresh() {
      texts
        .text(function(d) { return d.name; });
    }

    function clicked(node) {
      clickCount++;

      setTimeout(function() {
        if (clickCount === 1) {
          selected = node;
          $('#url').val(node.url);
          $('#name').val(node.name);
        } else if (clickCount === 2) {
          dblclick = true;
          window.open(node.url, '_blank');
        } else if (clickCount === 3) {
          $.ajax({
            url: 'http://localhost:5001/urls',
            type: 'POST',
            data: {
              name: 'LOCALHOST',
              url: 'http://localhost/',
              target: node.id
            },
            success: function(created) {
              force.nodes().push(created);
              nodeMap[created.id] = created;
              force.links().push({
                target: nodeMap[created.id],
                source: nodeMap[node.id]
              });
              restart();
            }
          });
        }
        clickCount = 0;
      }, 400);
    }

    function tick() {
      link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        // .attr("x", function(d) { return d.x; })
        // .attr("y", function(d) { return d.y; });
    }

    $('#name').keyup(function() {
      if (selected === null) return;
      selected.name = $(this).val();
      refresh();

      $.ajax({
        url: 'http://localhost:5001/urls/' + selected.id,
        type: 'PUT',
        data: selected,
        success: function() {}
      });
    });

    $('#url').keyup(function(){
      if (selected === null) return;
      selected.url = $(this).val();
      refresh();

      $.ajax({
        url: 'http://localhost:5001/urls/' + selected.id,
        type: 'PUT',
        data: selected,
        success: function() {}
      });
    });

  }
});
