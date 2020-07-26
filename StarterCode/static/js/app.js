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
        console.log(data.samples[0])
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
        Plotly.newPlot("bar",[trace],layout);// barchart

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
        Plotly.newPlot("bubble", [traceBubble], layoutBubble);

        /************************************ Demographic Info *******************************************/
        /*===============================================================================================*/
        var demoKeys = Object.keys(data.metadata[0]);
        var demoValues = Object.values(data.metadata[0]);
        for (var i=0;i<demoKeys.length;i++){
            demoInfo.append("h6").text(`${demoKeys[i]}: ${demoValues[i]}`)
        };
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

        updatePlotly("bar",otuValue,otuId,hoverText,layout);
        updatePlotly("bubble",otuValueBubble,otuIdBubble,hoverText,layout);
        updateDemoInfo(data.metadata[indexNumber]);
    };

    function updatePlotly(plotType,otuValue,otuId,hoverText,layout){
        Plotly.restyle(plotType, "x", [otuValue]);
        Plotly.restyle(plotType, "y", [otuId]);
        Plotly.restyle(plotType, "text", [hoverText]);
        if (plotType="bar"){
            Plotly.relayout(plotType,layout);
        };
        
    }

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





