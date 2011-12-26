<?php
if (!defined("_ENGINE_")) {
    @header("HTTP/1.1 404 Not found");  
    @header("Status: 404 Not found", TRUE, 404);
    die();
}

class database
{
    private $db_host,
            $db_username,
            $db_password,
            $db_name,
            $db_connect,
            $db_sql;

    public function db_connect()
        {
                $this->db_connect = mysql_connect($this->db_host, $this->db_username, $this->db_password)
                        or die(mysql_error());
                mysql_select_db($this->db_name,$this->db_connect)
                        or die(mysql_error());

        }

    public function db_query($query)
        {
                $this -> db_sql = mysql_query($query, $this->db_connect)
                        or die(mysql_error());
                return $this->db_sql;
        }
    public function db_close()
        {
        mysql_close($this->db_connect);
    }

    public function db_real_escape_string($input)
    {
        return mysql_real_escape_string($input);
    }

    public function db_fetch_row()
    {
        return mysql_fetch_row($this->db_sql);
    }

    public function db_fetch_array()
    {
        return mysql_fetch_array($this->db_sql);
    }

    public function db_num_rows()
    {
        return mysql_num_rows($this->db_sql);
    }

    public function __construct($config)
    {
        $this->db_host = $config[0];
        $this->db_username = $config[1];
        $this->db_password = $config[2];
        $this->db_name = $config[3];
    }

}

?>
