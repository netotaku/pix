<?php

    $json;

    exec('cd ../ && node pix.js images/boards.png 22 0.4 "Music has the right to children" "Boards of Canada" &', $json);

    $map = json_decode($json[0]);

    $gutter = 2;
    $frame = 50;
    $width = $map->width+($gutter*$map->columns);

?>
<html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Oswald:700|Open+Sans:400,700italic" rel="stylesheet" type="text/css" />
        <style>

            *{
                box-sizing: border-box;
                padding: 0px;
                margin: 0px;
            }

            html{
                text-align: center;  
                padding: 50px;   
                -webkit-font-smoothing: antialiased;
	            -moz-osx-font-smoothing: grayscale;          
            }

            .frame{
                margin: auto;                
                color: #fff;
                background: #111;
                width: <?=$width+$gutter+($frame*2)?>px;
            }

            .image {
                width: <?=$width+($frame*2) ?>px;
                padding: <?=$frame ?>px;
                padding-right: 0px;
                padding-bottom: 0px;                
            }

            .row{
                position: relative;
                overflow: hidden;
                width: <?=$width ?>px;
            }    

            .cell{
                float: left;
                height: <?=$map->cellHeight ?>px;
                width: <?=$map->cellWidth ?>px;
                margin-right: <?=$gutter ?>px;
                margin-bottom: <?=$gutter ?>px;                
            }
            .disc{
                height: <?=$map->cellHeight ?>px;
                width: <?=$map->cellWidth ?>px;
                /* transform: rotate(45deg); */
                border-radius: <?=$map->cellWidth/2 ?>px;
            }
            .caption{
                text-align: left;
                padding-top: <?=$frame?>px;
                padding: <?=$frame ?>px;
            }
            h1{
                font-family: 'Oswald', sans-serif;
                font-weight: 700;
                text-transform: uppercase;
                font-size: 2.4em;
                line-height: 1;
                letter-spacing: -1px;
            }
            h2{
                line-height: 1.6;
                font-family: 'Open Sans', sans-serif;
                color: #666;
            }
        </style>
    </head>
    <body>
        
        <div class="frame">
            <div class="image">
                <?php foreach($map->cells as $row) : ?>
                    <div class="row">
                        <?php foreach($row as $cell) : ?>
                            <div class="cell">
                                <div class="disc" style="background: rgb(<?=$cell->scan->rgba->r?>, <?=$cell->scan->rgba->g?>, <?=$cell->scan->rgba->b?>)"></div>
                                <!-- <?php var_dump($cell) ?> -->
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="caption">
                <h1><?=$map->title?></h1>
                <h2><?=$map->subtitle?></h2>
            </div>
        </div>

    </body>
</html>

