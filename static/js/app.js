var data;

// read in json data
d3.json("../samples.json").then((importdata)=>{

    data = importdata;
    // create a subject id dropdownmenu
    var dropdownMenu = d3.select("#selDataset");
    // create demo info id
    var demoInfo = d3.select("#sample-metadata");

    // get test subject id and append to dropdown menu
    var testSubjectId = data.names 
    testSubjectId.forEach(id=>{
            dropdownMenu.append("option").text(id).attr("name",id);
    });


    // event listener
    d3.selectAll("#selDataset").on("change", optionChanged);

    // initialize default
    function init(){
        /***************************** Default Barplot and Demographic Info *****************************/
        /*==============================================================================================*/
        // 1.create default xy, layout and plot
        // 2.only plot first 10 otu value in a descending order
        // 3.
        var config = {responsive:true};

        var otuId = [];
        for (var i=9;i>=0;i--){
            otuId.push("OTU ".concat(data.samples[0].otu_ids[i]));
        };
        var otuValue = [];
        for (var i=9;i>=0;i--){
            otuValue.push(data.samples[0].sample_values[i]);
        };
        var hoverText = [];
        for (var i=9;i>=0;i--){
            hoverText.push(data.samples[0].otu_labels[i]);
        };
        console.log(hoverText);
        var trace = {
            x:otuValue,
            y:otuId,
            type:"bar",
            text:hoverText,
            orientation:"h"
        };
        var layout = {
            title:`Subject: ${testSubjectId[0]}`
        };
        Plotly.newPlot("bar",[trace],layout,config);// barchart

        /*************************************** Bubble chart *********************************************/
        /*================================================================================================*/
        var traceBubble = {
            x:data.samples[0].otu_ids,
            y:data.samples[0].sample_values,
            text:hoverText,
            mode:"markers",
            marker:{
                size:data.samples[0].sample_values,
                color:data.samples[0].otu_ids,
            }
        };

        var layoutBubble = {
            xaxis:{
                title:{
                    text:"OTU ID"
                }
            },
        };
        
        Plotly.newPlot("bubble", [traceBubble], layoutBubble,config);

        /************************************ Demographic Info *******************************************/
        /*===============================================================================================*/
        var demoKeys = Object.keys(data.metadata[0]);
        var demoValues = Object.values(data.metadata[0]);
        for (var i=0;i<demoKeys.length;i++){
            demoInfo.append("h6").text(`${demoKeys[i]}: ${demoValues[i]}`)
        };

        /***************************************** Gauge Chart *******************************************/
        /*===============================================================================================*/
        var firstWFreq = data.metadata[0].wfreq
        // Calculations for gauge needle
        var firstWFreqDeg = firstWFreq * 20;
        var degrees = 180 - firstWFreqDeg;
        var radius = 0.5;
        var radians = (degrees * Math.PI) / 180;
        var x = radius * Math.cos(degrees * Math.PI / 180);
        var y = radius * Math.sin(degrees * Math.PI / 180);

        // create path for gauge needle
        // Create path for gauge needle
        var path1 = (degrees < 45 || degrees > 135) ? 'M -0.0 -0.025 L 0.0 0.025 L ' : 'M -0.025 -0.0 L 0.025 0.0 L ';
        var mainPath = path1,
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // create trace for gauge chart
        var dataGauge = [
            {
              type: "scatter",
              x: [0],
              y: [0],
              marker: { size: 12, color: "850000" },
              showlegend: false,
              name: "Freq",
              text: firstWFreq,
              hoverinfo: "text+name"
            },
            {
              values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
              rotation: 90,
              text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              textinfo: "text",
              textposition: "inside",
              marker: {
                colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
              labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              hoverinfo: "label",
              hole: 0.5,
              type: "pie",
              showlegend: false
            }
          ];
        
        
        console.log(dataGauge[0]);
        // Create the layout for the gauge chart
        var layoutGauge = {
            shapes: [
              {
                type: "path",
                path: path,
                fillcolor: "850000",
                line: {
                  color: "850000"
                }
              }
            ],
            title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
            // height: 500,
            // width: 500,
            xaxis: {
              zeroline: false,
              showticklabels: false,
              showgrid: false,
              range: [-1, 1]
            },
            yaxis: {
              zeroline: false,
              showticklabels: false,
              showgrid: false,
              range: [-1, 1]
            }
          };
          Plotly.newPlot('gauge', dataGauge,layoutGauge,config);
    };




    // change barplot function
    function optionChanged(){
        /********************************* dropdownmenu value change **********************************/
        // =============================================================================================
        // 1. find out dropdown value (subject ID value)
        // 2. find out the index of subject ID
        // 3. use the indexnumber for find out id and sample value, hovertext
        // 4. change demographic info content box. 

        // dropdown menu and value and demo info 
        var dropdownMenu = d3.select("#selDataset");
        var dropdownValue = dropdownMenu.property("value");
        var demoInfo = d3.selectAll("#sample-metadata");

        // return index of subject id
        var indexNumber = testSubjectId.findIndex(function(element){
            return (element==dropdownValue)
        })

        // change barchart value
        var otuId = [];
        for (var i=9;i>=0;i--){
            otuId.push("OTU ".concat(data.samples[indexNumber].otu_ids[i]));
        };

        var otuValue = [];
        for (var i=9;i>=0;i--){
            otuValue.push(data.samples[indexNumber].sample_values[i]);
        };
        var hoverText = [];
        for (var i=9;i>=0;i--){
            hoverText.push(data.samples[indexNumber].otu_labels[i]);
        }
        var trace = {
            x:otuValue,
            y:otuId,
            type:"bar",
            text:hoverText,
            orientation:"h"
        };
        var layout = {
            title:`Subject: ${testSubjectId[indexNumber]}`
        };

        // update Bubble chart elements
        var otuIdBubble = data.samples[indexNumber].otu_ids;
        var otuValueBubble = data.samples[indexNumber].sample_values;

        // update gauge value
        var gaugeValue = data.metadata[indexNumber].wfreq
        console.log(gaugeValue);

        // update each plot and demographic info
        updatePlotly("bar",otuValue,otuId,hoverText,layout);
        updatePlotly("bubble",otuValueBubble,otuIdBubble,hoverText,layout);
        updateDemoInfo(data.metadata[indexNumber]);
        updateGauge("gauge",gaugeValue);
    };

    function updatePlotly(plotType,otuValue,otuId,hoverText,layout){
    
        Plotly.restyle(plotType, "x", [otuValue]);
        Plotly.restyle(plotType, "y", [otuId]);
        Plotly.restyle(plotType, "text", [hoverText]);
        if (plotType="bar"){
            Plotly.relayout(plotType,layout);
        };
    };
     
    function updateGauge(plotType,firstWFreq){
        var dataGauge = [
            {
              type: "scatter",
              x: [0],
              y: [0],
              marker: { size: 12, color: "850000" },
              showlegend: false,
              name: "Freq",
              text: firstWFreq,
              hoverinfo: "text+name"
            },
            {
              values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
              rotation: 90,
              text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              textinfo: "text",
              textposition: "inside",
              marker: {
                colors: [
                  "rgba(0, 105, 11, .5)",
                  "rgba(10, 120, 22, .5)",
                  "rgba(14, 127, 0, .5)",
                  "rgba(110, 154, 22, .5)",
                  "rgba(170, 202, 42, .5)",
                  "rgba(202, 209, 95, .5)",
                  "rgba(210, 206, 145, .5)",
                  "rgba(232, 226, 202, .5)",
                  "rgba(240, 230, 215, .5)",
                  "rgba(255, 255, 255, 0)"
                ]
              },
              labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
              hoverinfo: "label",
              hole: 0.5,
              type: "pie",
              showlegend: false
            }
          ];

        Plotly.restyle(plotType,dataGauge);
    };
   
    function updateDemoInfo(metadata){
        // clear up existing content
        d3.selectAll("#sample-metadata").html("");
        // add new content
        var demoKeys = Object.keys(metadata);
        var demoValues = Object.values(metadata);
        for (var i=0;i<demoKeys.length;i++){
            demoInfo.append("h6").text(`${demoKeys[i]}: ${demoValues[i]}`)
        };

    };

    init(); // initialize barplot


});





