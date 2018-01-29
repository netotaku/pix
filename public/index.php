<?php
    $json;
    exec('cd ../ && node pix.js images/boards.png 30 0.4 "Music has the right to children" "Boards of Canada" &', $json);
    $map = json_decode($json[0]);
    $spacing = 2;
    $padding = 10;
?>

<svg style="background: #111" viewBox="0 0 <?=$map->width+($padding*2)?> <?=$map->height+($padding*2)?>">
    <?php foreach($map->cells as $row) : ?>                
        <?php foreach($row as $cell) : ?>   
            <?php                        
                $r = (($map->width)/$map->columns)/2;
                $cx = ($cell->scan->x*$map->scale+$r) + $padding;
                $cy = ($cell->scan->y*$map->scale+$r) + $padding;
            ?>
            <circle cx="<?=$cx?>" cy="<?=$cy?>" r="<?=$r?>" style="fill: rgb(<?=$cell->scan->rgba->r?>, <?=$cell->scan->rgba->g?>, <?=$cell->scan->rgba->b?>)" />                                    
        <?php endforeach; ?>            
    <?php endforeach; ?>            
</svg>     
