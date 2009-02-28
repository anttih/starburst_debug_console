`Starburst_Debug_Console` - Debugging and profiling console for Solar
=====================================================================

[Solar][] is a framework for PHP5. `Starburst_Debug_Console` is a debugging and
profiling console for Solar applications. Once installed, you will see a console
on top of your website which has information about the request and PHP environment.

Features:

* No coding needed. You only need to set a few config values.
* SQL profiler (through `Solar_Sql`)
* Log viewer (through integrated custom log writer for `Solar_Log`)
* PHP environment view (`$_SERVER` variables)

[Solar]: http://solarphp.com

## Installation

1. Install the files somewhere in your project.

    I recommend using the "Solar system" project structure. In this case you should
put the files under `$system/source/starburst-debug-console`.


2. Add Starburst directory to your `include_path`.

    If your project is a "Solar system", you can add it to include_path with:
    
        cd $system/include  
        ln -s ../source/starburst-debug-console/Starburst .
    
3. Add symlinks to your Public dir.

        cd $system/docroot/public  
        ln -s ../../source/starburst-debug-console/Starburst/Debug/Console/Public ./Starburst_Debug_Console

4. Configure the debug console.

    Here's an example configuration:
        
        // turn on SQL query profiling
        $config['Solar_Sql']['profiling'] = true;
        
        $config['Solar']['registry_set']['debug-report'] = 'Starburst_Debug_Console';
        
        $config['Solar']['registry_set']['log'] = array('Solar_Log', array(
            'adapter'   => 'Starburst_Log_Adapter_Var',
            'events'    => array('notice', 'debug', 'warning'),
        ));
        
        // display only when in browser
        if (PHP_SAPI != 'cli') {
            // this will display the console
            $config['Solar']['stop'][] = array('debug-report', 'display');
        }
        
    You might want to put the configuration inside a conditional so that the console
    is shown only in development environment.