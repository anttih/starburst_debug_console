<!-- Starburst_Debug_Console -->

<?php foreach ($this->styles as $url): ?>
    <style type="text/css" media="screen">@import url("<?php echo $url ?>");</style>
<?php endforeach; ?>


<div id="starburst_debug_console-open"><a href="#">Open console</a></div>

<div id="starburst_debug_console">
    <ul class="tabs">
        <li><a class="sql" href="#">SQL Profiler</a></li>
        <li><a class="log" href="#">Logs</a></li>
        <li><a class="request" href="#">Environment</a></li>
    </ul>
    <a class="close" href="#">Close</a>
    
    <div class="content">
        <div id="starburst_debug_console-sql" class="sub active">
            <table>
                <tr class="domtpl">
                    <td class="num"></td>
                    <td class="time"></td>
                    <td class="query"><pre></pre></td>
                </tr>
            </table>
        </div>
        <div id="starburst_debug_console-log" class="sub">
            <table>
                <tr class="domtpl">
                    <td class="class"></td>
                    <td class="event"></td>
                    <td class="descr"></td>
                </tr>
            </table>
        </div>
        <div id="starburst_debug_console-request" class="sub">
            <table>
                <tr class="domtpl">
                    <td class="key"></td>
                    <td class="value"></td>
                </tr>
            </table>
        </div>
    </div>
</div>

<?php foreach ($this->scripts as $src): ?>
    <script src="<?php echo $src ?>" type="text/javascript"></script>
<?php endforeach; ?>

<script>
    $(document).ready(function () {
        var data = <?php echo $this->debug_json ?>;
        Starburst_Debug_Console(data);
    });
</script>
<!-- End Starburst_Debug_Console -->;
