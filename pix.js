#!/usr/bin/env node

var Jimp = require("jimp"),
    fs = require("fs"),
    process = require("process"),
    handlebars = require('handlebars');

///////

const IMAGE_PATH = process.argv[2];
const SIZE = process.argv[3] || 20;
const TITLE = process.argv[4] || '';
const SUB_TITLE = process.argv[5] || '';
const OUTPUT = process.argv[6] || 'JSON';

// display

const SPACING = 6;
const PADDING = 50;

// pix images/boards.png 22 "Music has the right to children" "Boards of Canada" SVG

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
        y = (countY)*data.i,
        r = (bitmap.width/SIZE)/2; 

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
        svg: {
            r: r,            
            cx: (x+r) + PADDING + (data.j * SPACING),
            cy: (y+r) + PADDING + (data.i * SPACING)
        }
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
        width: width,
        height: height,
        title: TITLE,
        subtitle: SUB_TITLE,                        
        cells: this.pixels,
        svg: {
            height: width+(PADDING*2)+(SPACING*this.options.columns),
            width: height+(PADDING*2)+(SPACING*this.options.rows)
        }
    });
}

Map.prototype.toSVG = function(){
    $json = this.toJSON();
}

////

Jimp.read(IMAGE_PATH, function (err, image) {
    if (err) throw err;

    var map = new Map({            
        rows: SIZE,
        columns: SIZE,        
        image: image
    });

    switch(OUTPUT){
        case 'JSON':
            console.log(map.toJSON());
        break;
        default:
            console.log(map.toSVG());
        break;
    }

});


