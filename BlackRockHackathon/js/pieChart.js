var pieoptions = {
        chart: {
            renderTo: 'container1',
            type: 'pie'
        },
        title: {
            text: 'Programming Languages'
        },
        credits: {
          enabled: false
        },
        tooltip: {
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) + " %";
                    }
                },
        series: [{
            data:[]
        }]
    };

    $.get('plang_freq.csv', function(data) {
        // Split the lines
        var lines = data.split('\n');

        // Iterate over the lines and add categories or series
        $.each(lines, function(lineNo, line) {
            var items = line.split(',');

            // header line containes categories
            if (lineNo > 0) {

                pieoptions.series[0].data.push([items[0],parseFloat(items[1])]);


            }

        });

        // Create the chart
        var chart = new Highcharts.Chart(pieoptions);
    });
