<?php
    $data;
    exec('cd ../ && node pix.js images/check.jpg 30 "Music has the right to children" "Boards of Canada" 6 50 SVG &', $data);
    echo implode('', $data);
?>