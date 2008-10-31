<?php
/**
 * 
 * Log adapter to store log messages in memory.
 * 
 * @category Starburst
 * 
 * @package Starburst_Log
 * 
 */
class Starburst_Log_Adapter_Var extends Solar_Log_Adapter
{
    /**
     * 
     * User-defined configuration values.
     * 
     * Keys are ...
     * 
     * `events`
     * : (string|array) The event types this instance
     *   should recognize; a comma-separated string of events, or
     *   a sequential array.  Default is all events ('*').
     * 
     * @var array
     * 
     */
    protected $_Starburst_Log_Adapter_Var = array(
        'events' => '*',
    );
    
    protected $_store = array();
    
    /**
     * 
     * Constructor.  Detect output mode by SAPI if none is specified.
     * 
     * @param array $config User-defined configuration.
     * 
     */
    public function __construct($config = null)
    {
        parent::__construct($config);
    }
    
    public function getLog($criteria = null, $value = null)
    {
        if ($criteria) {
            $out = array();
            foreach ($this->_store as &$line) {
                if ($line[$criteria] === $value) {
                    $out[] = $line;
                }
            }
            return $out;
            
        } else {
            return $this->_store;
        }
    }
    
    /**
     * 
     * Echos the log message.
     * 
     * @param string $class The class name reporting the event.
     * 
     * @param string $event The event type (for example 'info' or 'debug').
     * 
     * @param string $descr A description of the event. 
     * 
     * @return mixed Boolean false if the event was not saved (usually
     * because it was not recognized), or a non-empty value if it was
     * saved.
     * 
     */
    protected function _save($class, $event, $descr)
    {
        $data = array(
            'time'  => $this->_getTime(),
            'class' => $class,
            'event' => $event,
            'descr' => $descr,
        );
        
        $this->_store[] = $data;
        return true;
    }
}
