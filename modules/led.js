const gpio = require("@tibbo-tps/gpio");

var blue = gpio.init("S9A");
blue.setDirection("output");
blue.setValue(1);

var red = gpio.init("S11A");
red.setDirection("output");
red.setValue(1);

exports.blink = function(color){
    if(color === "red"){
        red.setValue(0);
    }else if (color === "blue"){
        blue.setValue(0);
    }

    setTimeout(function(){
        blue.setValue(1);
        red.setValue(1);
    },500)
};
