Ext.onReady(function() {
    function calculateQuantities() {
        var quantities = new Array(64);
        for (var i=0; i<64; ++i) {
            quantities[i] = (Math.random() * 100) | 0;
        }
        return quantities;
    }

    var histogram = new gxp.Histogram({
        width: 400,
        height: 100,
        quantities: calculateQuantities(),
        renderTo: "histogram"
    });    

    window.setInterval(function() {
        histogram.setQuantities(calculateQuantities());
    }, 5000);
});
