const req = new XMLHttpRequest();
      req.open("GET", `http://localhost:8086/sitemap`, true);
      req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      req.send();

      req.onreadystatechange = function() {
        // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          const resp = JSON.parse(this.responseText);

          // create an array with nodes
          var nodes = new vis.DataSet(resp.nodes);

          // create an array with edges
          var edges = new vis.DataSet(resp.edges);

          // create a network
          var container = document.getElementById("mynetwork");
          var data = {
            nodes: nodes,
            edges: edges
          };
          var options = {
            autoResize: true,
            nodes: {
              shape: "dot",
              size: 20,
              font: {
                size: 15,
                color: "black"
              },
              borderWidth: 1
            },
            edges: {
              width: 2
            },
            physics: {
              barnesHut: { gravitationalConstant: -50000, springLength: 100 },
              stabilization: { iterations: 2500 }
            },
            groups: {
              1: { color: "rgb(0,255,140)" },
              icons: {
                shape: "icon",
                icon: {
                  face: "FontAwesome",
                  code: "\uf0c0",
                  size: 50,
                  color: "orange"
                }
              },
              source: {
                color: { border: "white" }
              }
            },
            legend: true
          };
          var network = new vis.Network(container, data, options);
        }
      };