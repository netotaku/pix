<?php
    $data;
    exec('cd ../ && node pix.js images/check.jpg 30 "Music has the right to children" "Boards of Canada" 6 50 JSON &', $data);
    $map = json_decode($data[0]);
?>
<style>
    /* <![CDATA[ */            
        .frame{
            background: #111;
        }
    /* ]]> */
</style>
<svg class="frame" viewBox="0 0 <?=$map->svg->width?> <?=$map->svg->height?>" xmlns="http://www.w3.org/2000/svg">
    <?php foreach($map->cells as $cell) : ?>                                
        <circle cx="<?=$cell->scan->svg->cx?>" cy="<?=$cell->scan->svg->cy?>" r="<?=$cell->scan->svg->r?>" style="fill: rgb(<?=$cell->scan->rgba->r?>, <?=$cell->scan->rgba->g?>, <?=$cell->scan->rgba->b?>)" />                                            
    <?php endforeach; ?>            
</svg>     