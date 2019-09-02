<template>
  <div class="barDiv">
    <canvas
      id="barGraphCanvas"
      v-bind:content="tooltipMsg"
      v-tippy="{followCursor: followOption, placement: 'top'}"
    ></canvas>
  </div>
</template>

<script>
import { tippy } from "vue-tippy";
export default {
  name: "BarGraph",
  data() {
    let tooltipMsg = "";
    let followOption = false;
    return {
      tooltipMsg,
      followOption
    };
  },
  props: {
    dataArr: {
      type: Array,
      required: true
    },
    xAxisTitle: {
      type: String
    },
    yAxisTitle: {
      type: String
    }
  },
  mounted() {
    //Declare variables that will be used across functions
    var self = this;

    // Declaring canvas variables
    var canvas;
    var ctx;

    // Setting up the canvas and context
    canvas = document.getElementById("barGraphCanvas");
    ctx = canvas.getContext("2d");

    const tippyInstance = tippy(canvas);
    tippyInstance.disable();

    // Declaring chart related varaibles
    var graphWidth, graphHeight, canvasMargin, yAxisTitleSpace;
    var canvasMarginSpace, canvasMarginHeight;

    initializeChartSettings();

    // axes related variables
    var numLabelsOnYAxis;
    drawAxes();

    // bar chart related varaibles
    var barWidth, barMargin, totalNumBars, maxDataValue;
    drawBarChart();

    // Initialize the chart and bar variables
    function initializeChartSettings() {
      canvasMargin = 25;
      yAxisTitleSpace = 50;
      canvas.width = window.innerWidth * 0.4;
      canvas.height = window.innerHeight * 0.7;

      graphHeight = canvas.height - 2 * canvasMargin - yAxisTitleSpace;
      graphWidth = canvas.width - 2 * canvasMargin - yAxisTitleSpace;

      canvasMarginSpace = canvasMargin + yAxisTitleSpace;
      canvasMarginHeight = canvasMargin + graphHeight;

      barMargin = 15;
      totalNumBars = self.dataArr.length;
      barWidth = graphWidth / totalNumBars - barMargin;

      // Find the max value on y axis
      maxDataValue = 0;
      self.dataArr.forEach(element => {
        var barVal = parseInt(element.split(":")[1]);
        if (barVal > parseInt(maxDataValue)) {
          maxDataValue = barVal;
        }
      });

      //Define the number of divisions/scale on y axis
      numLabelsOnYAxis = 10;
      ctx.font = "bold 12px sans-serif";
    }

    // Draw the axes
    function drawAxes() {
      ctx.lineWidth = "2";

      // drawing the y axis
      drawAxis(
        canvasMarginSpace,
        canvasMarginHeight,
        canvasMarginSpace,
        canvasMargin
      );

      // drawing the x axis
      drawAxis(
        canvasMarginSpace,
        canvasMarginHeight,
        canvasMarginSpace + graphWidth + canvasMargin,
        canvasMarginHeight
      );

      ctx.lineWidth = "1";
      drawMarkers();
    }

    // Line function to draw axis lines
    function drawAxis(startingLineX, startingLineY, endingLineX, endingLineY) {
      ctx.beginPath();
      ctx.strokeStyle = "#A9A9A9";
      ctx.moveTo(startingLineX, startingLineY);
      ctx.lineTo(endingLineX, endingLineY);
      ctx.closePath();
      ctx.stroke();
    }

    // Function to mark the axes and label then with titles
    function drawMarkers() {
      var numMarkers = parseInt(maxDataValue / numLabelsOnYAxis);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000";

      // Y Axis
      for (var i = 0; i <= numLabelsOnYAxis; i++) {
        var yAxisMarkerValue = i * numMarkers;
        var yAxisMarkerValueHeight = i * numMarkers * graphHeight;
        var xMarkers = canvasMarginSpace - 5;
        var yMarkers =
          canvasMarginHeight - yAxisMarkerValueHeight / maxDataValue;
        ctx.fillText(yAxisMarkerValue, xMarkers, yMarkers, yAxisTitleSpace);
      }

      // X Axis
      ctx.textAlign = "center";
      for (i = 0; i < totalNumBars; i++) {
        var arrVal = self.dataArr[i].split(":");
        var xAxisMarkerValue = arrVal[0];
        var markerXPos =
          canvasMarginSpace +
          barMargin +
          i * (barWidth + barMargin) +
          barWidth / 2;
        var markerYPos = canvasMarginHeight + 20;
        ctx.fillText(xAxisMarkerValue, markerXPos, markerYPos, barWidth);
      }

      ctx.save();

      // Add Y Axis title
      ctx.translate(canvasMargin + 10, graphHeight / 2);
      ctx.rotate((Math.PI * -90) / 180);
      ctx.fillText(self.yAxisTitle, 0, 0);

      ctx.restore();

      // Add X Axis Title
      ctx.fillText(
        self.xAxisTitle,
        canvasMarginSpace + graphWidth / 2,
        canvasMarginHeight + 40
      );
    }

    //Function the draw the bars of the chart
    function drawBarChart() {
      for (var i = 0; i < totalNumBars; i++) {
        var arrVal = self.dataArr[i].split(":");
        var barValue = parseInt(arrVal[1]);
        var barColorValue = arrVal[2];
        var barHeight = (barValue * graphHeight) / maxDataValue;
        var bX = canvasMarginSpace + i * (barWidth + barMargin) + barMargin;
        var bY = canvasMarginHeight - barHeight - 2;
        drawRectangle(bX, bY, barWidth, barHeight, barColorValue, barValue);
      }
    }

    function drawRectangle(
      startingBarX,
      startingBarY,
      endingBarX,
      endingBarY,
      barColor,
      val
    ) {
      // Defining the shadow of the bars
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 0.5;
      ctx.shadowBlur = 2;
      ctx.shadowColor = "#999";

      //Creating the bars
      ctx.beginPath();
      ctx.fillStyle = barColor;
      ctx.fillRect(startingBarX, startingBarY, endingBarX, endingBarY);
      ctx.stroke();

      //Ending the shadows of the bars
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;

      // Putting values on top of bars
      ctx.fillStyle = "#333";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(val, startingBarX + endingBarX / 2, startingBarY - 3);
    }

    //Event Listener to implement the tooltip
    canvas.addEventListener("mousemove", e => {
      //Find the mouse co-ordinates
      const mousePos = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop
      };

      // Get the pixel where mouse is currently present
      const pixel = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;

      // Find the color of the pixel the mouse is on
      const icolor = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;

      // Conditionally generate the tooltip
      if (icolor == "rgb(0,0,0)") {
        tippyInstance.hide();
      } else {
        self.dataArr.forEach(element => {
          tippyInstance.enable();
          if (hasSameColor(icolor, element)) {
            var temp = element.split(":");
            self.tooltipMsg = "Year " + temp[0] + " , " + "Value: " + temp[1];
            tippyInstance.show();
          }
        });
      }
    });

    // Function to compare color values mentioned above
    function hasSameColor(icolor, element) {
      var temp = element.split(":");
      return temp[2] == icolor;
    }
  }
};
</script>
<style scoped>
.barDiv {
  background-color: #ffffff;
  display: grid;
  justify-content: center;
  min-height: 100%;
  width: 50%;
  padding-top: 20px;
  display: inline-block;
  border-radius: 25px;
  border: 10px solid #27b67c;
}
</style>
