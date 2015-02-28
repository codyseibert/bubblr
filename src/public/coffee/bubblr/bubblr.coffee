# Used for retrieving the questions
angular.module('MINIAPP')
    .factory('bubblr', [
        'HttpStub',
        (HttpStub) ->

            class bubblr
                init: () ->
                    width = 960
                    height = 1000

                    force: d3.layout.force().size([
                      width
                      height
                    ]).charge(-1000).linkDistance(400).on 'tick', tick

                    drag: force.drag()
                        .on('dragstart', dragstart)
                        .on 'dragend', dragend

                    svg: d3.select('body').append('svg').attr('width', width).attr('height', height)

                    link: svg.selectAll('.link')

                    node: svg.selectAll('.node')

                    dragstart: (d) ->
                      d3.select(this).classed 'fixed', d.fixed = true
                      return

                    dragend: (d) ->
                      d3.select(this).classed 'fixed', d.fixed = false
                      return

                    dblclick: (d) ->
                      d3.select(this).classed 'fixed', d.fixed = false
                      return

                    tick: ->
                      link.attr('x1', (d) ->
                        d.source.x
                      ).attr('y1', (d) ->
                        d.source.y
                      ).attr('x2', (d) ->
                        d.target.x
                      ).attr 'y2', (d) ->
                        d.target.y
                      node.attr('cx', (d) ->
                        d.x
                      ).attr 'cy', (d) ->
                        d.y
                      return

                    # INITIALIZE D3
                    d3.json 'graph.json', (error, graph) ->
                      force.nodes(graph.nodes).links(graph.links).start()
                      link = link.data(graph.links).enter().append('line').attr('class', 'link')
                      node = node.data(graph.nodes).enter().append('circle').attr('class', 'node').attr('r', 30).on('dblclick', dblclick).call(drag)
                      node.append('image').attr('xlink:href', (d) ->
                        'images/' + graph.icons[d.type].name + '.svg'
                      ).attr('x', -8).attr('y', -8).attr('width', 16).attr 'height', 16
                      return




                      
                addBubble: () ->

                removeBubble: () ->

                setBubbleClickCallback: (callback) ->
                    @callback = callback;




        ]);






class bubblr
