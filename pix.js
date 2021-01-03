#!/usr/bin/env node

var Jimp = require("jimp"),
    fs = require("fs"),
    process = require("process"),
    handlebars = require('handlebars');

///////

const IMAGE_PATH = process.argv[2];
const SIZE = process.argv[3];
// const TITLE = process.argv[4];
// const SUB_TITLE = process.argv[5];
const SPACING = process.argv[6]*1 || 6;
const PADDING = process.argv[7]*1 || 0;
// const OUTPUT = process.argv[8];

// console.log(IMAGE_PATH, SIZE, TITLE, SUB_TITLE, SPACING, PADDING, OUTPUT);
// pix images/boards.png 22 "Music has the right to children" "Boards of Canada" 6 50 SVG
// cd ../ && node pix.js images/check.jpg 30 "Music has the right to children" "Boards of Canada" 6 50 JSON &

////

var Map = function(options){
    this.options = options;    
    this.pixels = this.setPixels(options);
};

Map.prototype.setPixels = function(options){
    var pixels = [], count = 0;
    for(var i = 0; i < options.rows; i++){        
        for(var j = 0; j < options.columns; j++){
            pixels.push(this.setPixel({ x: i, y: j, i: i, j: j, count: count++})); // new column
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
        r = (bitmap.width/this.options.columns)/2; 

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
        // title: TITLE,
        // subtitle: SUB_TITLE,                        
        cells: this.pixels,
        svg: {
            height: width+(PADDING*2)+(SPACING*this.options.columns),
            width: height+(PADDING*2)+(SPACING*this.options.rows)
        }
    });
}

Map.prototype.toSVG = function(callback){

    var data = JSON.parse(this.toJSON());

    // console.log(data);  

    fs.readFile('templates/svg.handlebars.html', 'utf-8', function(error, source){
        if (error) throw error;

        var template = handlebars.compile(source),
            html = template(data);

        callback(html);

    });

}


// console.log('called');


fs.readdir('images', function (err, files) {
    
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    var data = [];
    
    files.forEach(function (file) {

        var parts = file.split('.'),
            svgFileName = parts[0] + '.' + parts[1] + '.svg';

        data.push({
            src: svgFileName,
            album: parts[1].replace(/-/g, ' '),
            artist: parts[0].replace(/-/g, ' ')
        });
        
        Jimp.read('images/' + file, function (err, image) {
            if (err) throw err;

            var map = new Map({            
                rows: 22,
                columns: 22,        
                image: image
            });
       
            map.toSVG(function(svg){
                fs.writeFile('svg/'+ svgFileName, svg, function (err) {
                    if (err) throw err;
                    console.log('Saved: /svg/' + svgFileName);
                });                
            });

        });
        
    });

    // console.log(data); 

    fs.readFile('templates/index.handlebars.html', 'utf-8', function(error, source){
        if (error) throw error;

        var template = handlebars.compile(source),
            html = template(data);

        fs.writeFile('index.html', html, function (err) {
            if (err) throw err;
            console.log('Saved: /index.html');
        });    

    });


});