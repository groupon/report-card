/*
Copyright (c) 2014, Groupon, Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

Redistributions of source code must retain the above copyright notice,
this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.

Neither the name of GROUPON nor the names of its contributors may be
used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var d3 = require('d3'),
    languageColors = require('../constants/language-colors'),
    eventColors = require('../constants/event-colors');


var EVENT_TYPE_TO_ACTION_PHRASE = {
  "PushEvent": "Pushing Code",
  "CommentEvent": "Commenting",
  "CreateEvent": "Creating Repos",
  "IssuesEvent": "Create Issues",
  "PullRequestEvent": "Pull Requests",
}

module.exports = {
  language: function(parentEl, allLanguages){
    var languages = [],
    other = {language: "Other", count: 0},
    graphedPercent = 0,
    languageTotal = allLanguages.map(function(l){
      return l.count;
    }).reduce(function(previousValue, currentValue){
      return previousValue + currentValue;
    }, 0);

    allLanguages.forEach(function(language){
      if (graphedPercent > 75.0) {
        other.count+= language.count;
      } else {
        languages.push(language);
      }

      graphedPercent += (language.count / languageTotal * 100);

    });

    languages.push(other);

    var width = 500,
        height = 300,
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    var svg = d3.select(parentEl).append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("padding", 40)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
            .data(pie(languages))
            .enter().append("g")
            .attr("class", "arc");
    g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return languageColors[d.data.language] || '#fff'; });

    var labelRadius = radius + 10;

    g.append("text")
          .attr("transform", function(d) {
              var c = arc.centroid(d), x = c[0], y = c[1],
                  // pythagorean theorem for hypotenuse
                  h = Math.sqrt(x*x + y*y);
              return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ")";
          })
          .attr("dy", ".35em")

          .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
          })
          .attr("fill", "#000")
          .style("font-size",".8em")
          .text(function(d) { return d.data.language + " (" + d.data.count + ")"; });
  },
  activity: function(parentEl, events) {
    var width = 500,
        height = 300,
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.total; });

    var svg = d3.select(parentEl).append("svg")
          .attr("width", width)
          .attr("height", height)
          .style("padding", 40)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc")
            .data(pie(events))
            .enter().append("g")
            .attr("class", "arc");
    g.append("path")
          .attr("d", arc)
          .style("fill", function(d) { return eventColors[d.data.type] || '#fff'; });

    var labelRadius = radius + 10;

    g.append("text")
          .attr("transform", function(d) {
              var c = arc.centroid(d), x = c[0], y = c[1],
                  // pythagorean theorem for hypotenuse
                  h = Math.sqrt(x*x + y*y);
              return "translate(" + (x/h * labelRadius) +  ',' + (y/h * labelRadius) +  ")";
          })
          .attr("dy", ".35em")

          .attr("text-anchor", function(d) {
            // are we past the center?
            return (d.endAngle + d.startAngle)/2 > Math.PI ? "end" : "start";
          })
          .attr("fill", "#000")
          .style("font-size",".8em")
          .text(function(d) { return EVENT_TYPE_TO_ACTION_PHRASE[d.data.type] + " (" + d.data.total + ")"; });
  }
};
