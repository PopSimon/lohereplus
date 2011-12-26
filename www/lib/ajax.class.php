<?

if (!defined("_ENGINE_")) {
    @header("HTTP/1.1 404 Not found");  
    @header("Status: 404 Not found", TRUE, 404);
    die();
}

require_once 'framework.class.php';
require_once 'policy.class.php';

// ajax osztály
class ajax{
    private $_reply;
    private $_framework, $_policy;
    
    public function __construct($fw) {
        $this->_framework = $fw;
        $this->_policy = new policy(&$fw);
    }

    public function parseRequest($input){
        
        if ($this->_policy->getClientIsBanned()) return;
        
        $jsondata = json_decode($input,true);

        $request = $jsondata["request"];
        $params  = $jsondata["params"];

        $_replyJOSN = array("error" => 0); //reset + no error
        
        echo "INPUT DATA:".$input; echo "=>"; print_r($jsondata);
        //echo $request.":".$params;
        
        switch ($request){
            case "getBoards":
                {
                
                
                }
            default:
                $this->_reply = array("error" => 1);
                break;
        }
        
    }
    
    public function getReplyJSON(){
        if ($this->_policy->getClientIsBanned()) return "";
        return json_encode($this->_reply);
    }
}

?>