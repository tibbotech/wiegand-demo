const tibbit08 = require("@tibbo-tps/tibbit-08");

tibbit08.init(["s23"],100)
    .on("dataReceivedEvent", (data) => {
        console.log(data);
    });

// Prevent app from closing
setInterval(function(){},60000);