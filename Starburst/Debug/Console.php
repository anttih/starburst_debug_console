<?php
/**
 * 
 * Debugging console for gathering debugging information
 * from several sources and displaying them
 * 
 * @category Starburst
 * 
 * @package Starburst_Debug
 * 
 * @subpackage Starburst_Debug_Console
 * 
 * @author Antti Holvikari <anttih@gmail.com>
 * 
 * @license http://opensource.org/licenses/bsd-license.php BSD
 * 
 */
class Starburst_Debug_Console extends Solar_Base {
    
    /**
     * 
     * Configuration keys
     * 
     * Keys are...
     * 
     * `sql`
     * : (dependency) Solar_Sql dependency
     * 
     * `timer`
     * : (dependency) Solar_Debug_Timer dependency
     * 
     * `view_path`
     * : (array) Add these paths to the template path stack
     * 
     * `partial`
     * : (string) Template partial name
     * 
     * @var array
     * 
     */
    protected $_Starburst_Debug_Console = array(
        'sql'   => 'sql',
        'log'   => 'log',
    );
    
    /**
     * 
     * Timer object
     * 
     * @var Solar_Debug_Timer
     * 
     */
    public $timer;
    
    /**
     * 
     * Solar_Debug_Var object
     * 
     * @var Solar_Debug_Var
     * 
     */
    protected $_debug_var;
    
    /**
     * 
     * Debugging info
     * 
     * These keys get assigned to the view
     * 
     * @var array
     * 
     */
    public $debug = array();
    
    /**
     * 
     * undocumented class variable
     * 
     * @var string
     * 
     */
    public $debug_json;
    
    /**
     * 
     * undocumented class variable
     * 
     * @var string
     * 
     */
    public $scripts = array();
    
    /**
     * 
     * undocumented class variable
     * 
     * @var string
     * 
     */
    public $styles = array();
    
    /**
     * 
     * Constructor
     * 
     * @return void
     * 
     */
    public function __construct($config = null)
    {
        parent::__construct($config);
        
        $this->debug_var = Solar::factory('Solar_Debug_Var');
    }
    
    /**
     * 
     * Displays debug info
     * 
     * Stops timer, gathers debug info and displays
     * everything
     * 
     * @return void
     * 
     */
    public function display()
    {
        // don't display if we're not sending
        // HTML. this takes care of formats
        // like XHR when you can't display the console.
        $headers = headers_list();
        foreach ($headers as $header) {
            $header = strtolower($header);
            if (substr($header, 0, 12) == 'content-type') {
                $content_type = substr($header, 14, 9);
                if ($content_type != 'text/html') {
                    return;
                }
            }
        }
        
        // sql profiling
        $this->_sql();
        
        $this->_log();
        
        // superglobals
        $this->_superglobals();
        
        // uri to the js file
        $uri = Solar::factory('Solar_Uri_Public');
        
        $uri->set('Starburst_Debug_Console/scripts/jquery.min.js');
        $this->scripts[] = $uri->get(true);
        
        $uri->set('Starburst_Debug_Console/scripts/jquery.domtpl.js');
        $this->scripts[] = $uri->get(true);
        
        $uri->set('Starburst_Debug_Console/scripts/debug.js');
        $this->scripts[] = $uri->get(true);
        
        // path to stylesheet
        $uri->set('Starburst_Debug_Console/styles/console.css');
        $this->styles[] = $uri->get(true);
        
        
        $view = Solar::factory('Solar_View');
        $view->setTemplatePath(Solar_Class::dir(get_class($this), '/View'));
        $view->setHelperClass(array(
            'Solar_View_Helper',
        ));
        
        // encode debug data to JSON
        $json = Solar::factory('Solar_Json');
        $this->debug_json = $json->encode($this->debug);
        
        // assign all data for the view
        $view->assign($this);
        
        // render view
        echo $view->fetch('read');
    }
    
    /**
     * 
     * Runs var_dump() on a variable and stores that
     * output to be displayed in the debugger
     * 
     * @param mixed $var Variable to be displayed
     * 
     * @param string $label Label for the variable
     * 
     * @return void
     * 
     */
    public function varDump($var, $label)
    {
        // put var_dump() output into an array with $label as the key
        $this->debug['solar_debug_var'][$label] = $this->debug_var->fetch($var);
    }
    
    /**
     * 
     * Stops timer and gets profiling info
     * 
     * @return void
     * 
     */
    protected function _timer()
    {
        $this->timer->stop();
        $this->debug['solar_debug_timer']['data'] = $this->timer->profile();
    }
    
    /**
     * 
     * Gets profiling from Solar_Sql
     * 
     * @return void
     * 
     */
    protected function _sql()
    {
        $sql = Solar::dependency('Solar_Sql', $this->_config['sql']);
        $profiling = $sql->getProfile();
        foreach ($profiling as $query) {
            $this->debug['solar_sql'][] = $query;
        }
    }
    
    /**
     * 
     * Gets log messages for this request
     * 
     * @return void
     * 
     */
    protected function _log()
    {
        $log = Solar::dependency(
            'Starburst_Log_Adapter_Var',
            $this->_config['log']
        );
        $this->debug['solar_log'] = $log->getLog();
    }
    
    /**
     * 
     * Gets superglobals
     * 
     * @return void
     * 
     */
    protected function _superglobals()
    {
        $request = Solar_Registry::get('request');
        
        // get these
        $list = array('server');
        foreach ($list as $super) {
            $this->debug['solar_request'][$super] = $request->{$super};
        }
    }
}
