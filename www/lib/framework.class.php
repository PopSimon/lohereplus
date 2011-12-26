<?php
if (!defined("_ENGINE_")) {
    @header("HTTP/1.1 404 Not found");  
    @header("Status: 404 Not found", TRUE, 404);
    die();
}

require_once 'database.class.php';

class framework {
    public $_db;
    private $_lang, $_conf;
    
    public function __construct($in){
        $this->_conf = $in[0];
        $this->_lang = $in[1];
        
        $this->_db = new database(array(
            &$this->_conf["dbhost"],
            &$this->_conf["dbuser"],
            &$this->_conf["dbpass"],
            &$this->_conf["dbname"]
        ));
        
        //print_r($this->_conf);
        
        $this->_db->db_connect();
        $this->_db->db_query("SET NAMES utf8;");    //utf8 fucka
    }
    
// ide jonnek azok a metodusok amiket mindenhonna el szeretnenk majd erni    
    
    public function __destruct(){
        $this->_db->db_close(); 
    }
}

?>
