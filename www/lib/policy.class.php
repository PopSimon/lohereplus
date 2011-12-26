<?php

if (!defined("_ENGINE_")) {
    @header("HTTP/1.1 404 Not found");  
    @header("Status: 404 Not found", TRUE, 404);
    die();
}
require_once 'framework.class.php';

class policy {
    private $_framework;
    public function __construct($fw) {
        $this->_framework = $fw;
    }
    
    public function getClientIsBanned(){
        return false;
    }
    
    public function setBan(){
        
    }
    
    ///public function satöbbi
}

?>
    