#!/usr/bin/env node

var Jimp = require("jimp"),
    fs = require("fs"),
    process = require("process");

///////

const IMAGE_PATH = process.argv[2];
const SIZE = process.argv[3] || 20;
const SCALE = process.argv[4] || 0.4;
const TITLE = process.argv[5] || '';
const SUB_TITLE = process.argv[6] || '';

// pix images/boards.png 22 0.4 "Music has the right to children" "Boards of Canada"

////

var Map = function(options){
    this.options = options;    
    this.pixels = this.setPixels(options);
};

Map.prototype.setPixels = function(options){
    var pixels = [], count = 0;
    for(var i = 0; i < options.rows; i++){
        pixels.push([]); // new row
        var row = pixels[i];
        for(var j = 0; j < options.columns; j++){
            row.push(this.setPixel({ x: i, y: j, i: i, j: j, count: count++})); // new column
        }       
    }
    return pixels;
}

Map.prototype.average = function(values){
    var total = { r: 0, g: 0, b: 0};
    for(var i = 0; i < values.length; i++){
        var rgb = Jimp.intToRGBA(values[i]);    
        total.r += rgb.r;
        total.g += rgb.g;
        total.b += rgb.b;        
    }

    return {
        r: Math.round(total.r/values.length),
        g: Math.round(total.g/values.length),
        b: Math.round(total.b/values.length)
    }
    
}

Map.prototype.scan = function(data){

    var image = this.options.image,
        bitmap = image.bitmap,
        countX = bitmap.width/this.options.columns, 
        countY = bitmap.height/this.options.rows,
        colors = [],
        x = (countX)*data.j,
        y = (countY)*data.i; 

    for(var i = x; i < (x+countX); i++){
        for(var j = y; j < (y+countY); j++){
            colors.push(image.getPixelColor(i,j)); 
        }
    }

    return {
        x: x,
        y: y,
        countX: countX,
        countY: countY,                
        rgba: this.average(colors), 
    };
}

Map.prototype.setPixel = function(data){
    data.scan = this.scan(data);
    data.width = 100/this.options.columns;
    return data;
}

Map.prototype.toJSON = function(){
    
    var image = this.options.image,
        bitmap = image.bitmap,
        width = bitmap.width,
        height = bitmap.height;

    return JSON.stringify({
        columns: this.options.columns,
        rows: this.options.rows,
        width: width*this.options.scale,
        height: width*this.options.scale,
        title: TITLE,
        subtitle: SUB_TITLE,
        scale: SCALE, 
        cellWidth: (width/this.options.columns)*this.options.scale,
        cellHeight:  (height/this.options.rows)*this.options.scale,
        cells: this.pixels
    });
}

////

Jimp.read(IMAGE_PATH, function (err, image) {
    if (err) throw err;

    var map = new Map({            
        rows: SIZE,
        columns: SIZE,
        scale: SCALE,
        image: image
    });

    console.log(map.toJSON());

});

