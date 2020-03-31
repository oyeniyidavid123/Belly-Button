// Belly Button Biodiversity - Plotly.js

function buildMetadata(sample) {
      d3.json("samples.json").then((data) => {
        let metadata = data.metadata;
          let PANEL = d3.select("#sample-metadata");
          // Use `.html("") to Clear any Existing Metadata
          PANEL.html("");
          // Use `Object.entries` to Add Each Key & Value Pair to the Panel
          // Hint: Inside the Loop, Use d3 to Append New Tags for Each Key-Value in the Metadata
          Object.entries(data).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}:${value}`);
          })
          // BONUS: Build the Gauge Chart
            buildGauge(data.WFREQ);
      })
  }
  
  function buildCharts(sample) {
  
    // @TODO: Use `d3.json` to Fetch the Sample Data for the Plots
    d3.json("sample.json").then((data) => {
      // @TODO: Build a Bubble Chart Using the Sample Data
      const otu_ids = data.otu_ids;
      const otu_labels = data.otu_labels;
      const sample_values = data.sample_values;
      // @TODO: Build a Bubble Chart
      let bubbleLayout = {
        margin: { t: 0 },
        hovermode: "closests",
        xaxis: { title: "OTU ID"}
      }
  
      let bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
          }
        }
      ];
  
      Plotly.plot("bubble", bubbleData, bubbleLayout);
  
      // HINT: Use slice() to Grab the Top 10 sample_values,
      // otu_ids, and otu_labels (10 Each)
      let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      let barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  
      let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar", barData, barLayout);
    });
  }

  
  function init() {
    // Grab a Reference to the Dropdown Select Element
    let selector = d3.select("#selDataset");
  
    // Use the List of Sample Names to Populate the Select Options
    d3.json("samples.json").then((Data) => {
        let sampleNames = data.name;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the First Sample from the List to Build Initial Plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch New Data Each Time a New Sample is Selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the Dashboard
  init();