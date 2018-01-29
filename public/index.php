<?php
    $data;

    $check = [
        'images/check.jpg',
        22,
        '"Check Your Head"',
        '"Beastie Boys"'        
    ];

    $music = [
        "image" => [
            'images/boards.png', 22,
        ],    
        "title" => "Music Has The Right To Children",
        "subtitle" => "Boards of Canada"        
    ];

    $geo = [
        "image" => [
            'images/geo.jpg', 22,
        ],    
        "title" => "Geogaddi",
        "subtitle" => "Boards of Canada"        
    ];

    $a8 = [
        "image" => [
            'images/a8.jpg', 22,
        ],    
        "title" => "Full On Mask Hysteria",
        "subtitle" => "Altern8"        
    ];

    $options = $a8;

    $exec = 'cd ../ && node pix.js ' . implode(' ', $options["image"]) .' "" "" 6 0 SVG &';

    exec($exec, $data);

    $svg = implode('', $data);

?>
<html lang="en-GB" class="html ">
<html>
    <head>        
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css?family=Lato|Oswald" rel="stylesheet">
        <link href="style.css" rel="stylesheet">
    </head>    
    <body>
        <div class="poster">
            <div class="poster__svg">
                <?=$svg?>
            </div>
            <div class="poster__caption">
                <div class="poster__caption__text">
                    <h1><?=$options['title']?></h1>
                    <h2><?=$options['subtitle']?></h2>
                </div>
            </div>
        </div>     
    </body>    
</html>
