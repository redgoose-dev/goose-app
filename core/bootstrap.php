<?php
namespace Core;
use Dotenv\Dotenv, redgoose\Console, redgoose\RestAPI, Exception, Parsedown;

if (!defined('__GOOSE__')) exit();

// load autoload
require __PATH__.'/./vendor/autoload.php';

// set dotenv
try
{
  $dotenv = Dotenv::createImmutable(__PATH__);
  $dotenv->load();
}
catch(Exception $e)
{
  throw new Exception('.env error');
}


var_dump('print bootstrap');
