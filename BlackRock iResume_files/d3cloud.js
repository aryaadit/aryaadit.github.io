
var fill = d3.scale.category20();

var resumeWords = [];
var frequency = [];
var maxSize = 0;
var width, height;

var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;

d3.csv("word_freq.csv", function(data) {
    data.forEach( function (d) {
        resumeWords.push([d.word, d.frequency]);
        frequency.push(d.frequency);
    });
    freqMax = function( array ){
    return Math.max.apply( Math, array );};
    var maxSize = freqMax(frequency);
    d3.layout.cloud()
        .size([width, height])
        .words(resumeWords.map(function(d) {
            var wordSize = d[1]/maxSize * 100;
            return {text: d[0], size: wordSize};
        }))
        .rotate(function() { return ~~(Math.random() * 2) * 10; })
        // .font('monospace')
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        // .spiral("archimedean")
        .start();
});

function draw(words) {
d3.select(".col-1-2").append("svg")
    .attr("width", width*1.5)
    .attr("height", height)
    .append("g")
    // .attr("transform", "translate(500,500)")
    .attr("transform", "translate(" + (width/2 * 1.0) + "," + height/2 + "), scale(1.25,1.1)")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font", "monospace")
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });
}
