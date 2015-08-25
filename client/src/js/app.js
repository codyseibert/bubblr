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


    var zoom = d3.behavior.zoom()
         .scaleExtent([1, 10])
         .on("zoom", zoomed);

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);

    var force = d3.layout.force()
        .size([width, height])
        .nodes(d3.values(nodeMap))
        .links(links)
        .linkDistance(50)
        .charge(-200)
        .on("tick", tick);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var resized = function () {
      width = $(window).width();
      height = $(window).height();

      svg
        .attr("width", width)
        .attr("height", height)
    };
    resized();

    $(window).resize(function() {
      resized();
    });

    var container = svg.append("g");

    var nodes = force.nodes(),
        links = force.links(),
        texts = null,
        images = null,
        circles = null,
        node = container.selectAll(".node"),
        link = container.selectAll(".link");

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
        .on("click", clicked);

      images = g.append("svg:image")
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', -15)
        .attr('y', -15)
        .attr('xlink:href', function (d) {
          return '../images/w.svg';
        })
        .style('opacity', function (d) {
          if (d.type !== 'bookmark') {
            return 1;
          }else {
            return 0;
          }
        });

      circles = g.append('circle')
        .attr('r', 10)
        .style('opacity', function (d) {
          if (d.type === 'bookmark') {
            return 1;
          }else {
            return 0;
          }
        });

      texts = g
        .append("text")
        .attr("x", 24)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

      node = container.selectAll(".node");

      force.start();
    }

    function refresh() {
      texts = svg.selectAll('text')

      texts
        .text(function(d) { return d.name; });

      images
        .style('opacity', function (d) {
          if (d.type !== 'bookmark') {
            return 1;
          }else {
            return 0;
          }
        });

      circles
        .style('opacity', function (d) {
          if (d.type === 'bookmark') {
            return 1;
          }else {
            return 0;
          }
        });
    }

    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      d3.select(this).classed("dragging", true);
      force.start();
    }

    function dragged(d) {
      d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    }

    function dragended(d) {
      d3.select(this).classed("dragging", false);
    }


    function clicked(n) {
      clickCount++;

      setTimeout(function() {
        if (clickCount === 1) {
          selected = n;
          $('#url').val(n.url);
          $('#name').val(n.name);
          $('#category').val(n.type);
        } else if (clickCount === 2) {
          dblclick = true;
          window.open(n.url, '_blank');
        } else if (clickCount === 3) {
          $.ajax({
            url: 'http://localhost:5001/urls',
            type: 'POST',
            data: {
              name: 'LOCALHOST',
              url: 'http://localhost/',
              type: 'bookmark',
              target: n.id
            },
            success: function(created) {
              force.nodes().push(created);
              nodeMap[created.id] = created;
              force.links().push({
                target: nodeMap[created.id],
                source: nodeMap[n.id]
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

    $('#category').change(function() {
      if (selected === null) return;
      selected.type = $(this).val();
      refresh();

      $.ajax({
        url: 'http://localhost:5001/urls/' + selected.id,
        type: 'PUT',
        data: selected,
        success: function() {}
      });
    });

    $('#delete').click(function () {
      if (selected === null) return;
      var id = selected.id;

      delete nodeMap[id];

      var ns = force.nodes();
      for (var i in ns) {
        var n = ns[i];
        if (n.id === id) {
          ns.splice(i, 1);
          break;
        }
      }

      var ls = force.links();
      for (var i = ls.length - 1; i >= 0; i--) {
        var l = ls[i];
        if (l.target.id === id || l.source.id === id) {
          ls.splice(i, 1);
        }
      }

      svg.selectAll('.node').data(force.nodes()).exit().remove();
      svg.selectAll('.link').data(force.links()).exit().remove();
      restart();

      $.ajax({
        url: 'http://localhost:5001/urls/' + selected.id,
        type: 'DELETE',
        success: function() {}
      });

    });

  }
});
