chrome.storage.sync.get(["koverj_url", "activeBuild"], result => {
  const req = new XMLHttpRequest();
  req.open(
    "GET",
    `${result.koverj_url}/sitemap?buildId=${result.activeBuild}`,
    true
  );
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
          margin: 20,
          size: 20,
          font: {
            size: 15,
            color: "black",
            align: "middle"
          },
          borderWidth: 1,
          shadow: true
        },
        edges: {
          hoverWidth: 2,
          width: 2,
          length: 20,
          font: {
            align: "bottom"
          },
          scaling: {
            min: 20,
            max: 100
          }
        },
        physics: false,
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
});
