<?php

if ( isset($_SERVER['HTTP_X_SAKURA_FORWARDED_FOR']) ) {
    $_SERVER['HTTPS'] = 'on';
    $_ENV['HTTPS'] = 'on';
}
require 'index.php';