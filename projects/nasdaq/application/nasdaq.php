<?php

require 'load.php';
require 'model.php';
require 'controller.php';
require 'util.php';
require 'stock_quotes.php';

$c = new Controller();
$c->dispatch_event();