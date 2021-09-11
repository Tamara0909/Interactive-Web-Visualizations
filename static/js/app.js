/* The following is an example on how you might structure your code.
This is not the only way to complete this assignment.
Feel free to disregard and create your own code */

// Define function that will run on page load
function init() {
    var selector = d3.select("#selDataset")
    // Read json data
    d3.json("samples.json").then((data) => {
        // Parse and filter data to get sample names
        var sampleNames = data.names;
        // Add dropdown option for each sample
        sampleNames.forEach(element => {
            selector.append("option").text(element).property("value", element);
        });            
    // Call functions below using the first sample to build metadata and initial plots
    buildCharts(sampleNames[0]);
    buildMetadata(sampleNames[0]);
    });
}

// Define a function that will create metadata for given sample
function buildMetadata(sample) {

    // Read the json data
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        // Parse and filter the data to get the sample's metadata
        var results = metadata.filter(element => element.id == sample);
        var result = results[0];

        // Specify the location of the metadata and update it
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        })
    });
}

// Define a function that will create charts for given sample
function buildCharts(sample) {

    // Read the json data
    d3.json("samples.json").then(data => {
        var samples = data.samples;    
    
        // Parse and filter the data to get the sample's OTU data
        var results = samples.filter(element => element.id == sample);
        var metadatas = data.metadata.filter(element => element.id == sample);
        
        var result = results[0];
        var metadata = metadatas[0];
        
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
        
        
        // Pay attention to what data is required for each chart
        var frequency = parseFloat(metadata.wfreq);

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }
        // Create bar chart in correct location
        Plotly.newPlot("bar", barData, barLayout);
        

        // Create bubble chart in correct location
        var bubbleData = [
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

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });    
}


function optionChanged(sample){
    // The parameter being passed in this function is new sample id from dropdown menu

    // Update metadata with newly selected sample
    buildMetadata(sample)
    // Update charts with newly selected sample
    buildCharts(sample)

}

// Initialize dashboard on page load
init();

