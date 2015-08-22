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

    var nodes = {};
    var links = [];

    for (var i in urls) {
      var url = urls[i];
      nodes[url.id] = url;
    }

    for (var key in nodes) {
      var val = nodes[key]
      if (val.target !== -1) {
        links.push({
          source: nodes[val.id],
          target: nodes[val.target]
        });
      }
    }

    var selected = null;
    var clickCount = 0;

    var width = 960,
        height = 500;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(50)
        .charge(-200)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = null;
    var node = null;

    var link = svg.selectAll(".link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link");
        
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .on("click", function (node) {
          clickCount++;
          setTimeout(function() {
            if (clickCount === 1) {
              console.log('1');
              selected = node;
              $('#url').val(node.url);
              $('#name').val(node.name);
            } else if (clickCount === 2) {
              console.log('2');
              dblclick = true;
              window.open(node.url, '_blank');
            } else if (clickCount === 3) {
              console.log('3');
              $.ajax({
                url: 'http://localhost:5001/urls',
                type: 'POST',
                data: {
                  name: 'LOCALHOST',
                  url: 'http://localhost/',
                  target: node.id
                },
                success: function(created) {
                  console.log(created);
                  nodes[created.id] = created
                  links.push({
                    target: created.id,
                    source: node.id
                  });
                }
              });
            }
            clickCount = 0;
          }, 300);
        })
        .attr("class", "node");

    var texts = node.append("text")
            .attr("x", 24)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });

    var circles = node.append("circle")
        .attr("r", 10);

    function update() {
      texts.text(function(d) { return d.name; });
    }
    update();

    function tick() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    $('#name').keyup(function() {
      if (selected === null) return;
      selected.name = $(this).val();
      update();

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
      update();

      $.ajax({
        url: 'http://localhost:5001/urls/' + selected.id,
        type: 'PUT',
        data: selected,
        success: function() {}
      });
    });

  }
});
