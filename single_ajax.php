<?php
// Allow access from anywhere. Can be domains or * (any)
header('Access-Control-Allow-Origin: *');

// Allow these methods of data retrieval
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

// Allow these header types
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

    require_once('database.inc.php'); //configuracoes do banco de dados
	
	error_log('http://'. $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI']);

$query =  "select round(min(value_min),2) as minima,round(max(value_max),2) as maxima,round(sum(value_max)/count(*),2) as media,"
		. " date_format(FROM_UNIXTIME(clock),'%Y-%m') as data "
		. " from trends a,items b, hosts c"
		. " where"
		. " a.itemid = b.itemid"
		. " and b.hostid = c.hostid";
		
		if(isset($_GET["_key"]) && !empty($_GET["_key"]) && !is_null($_GET["_key"]))
$query .= " and b.key_= '" . $_GET["_key"] . "'";		
		
		if(isset($_GET["hostid"]) && !empty($_GET["hostid"]) && !is_null($_GET["hostid"]))
			$query .= " and c.hostid = " . $_GET["hostid"];
		
		if(isset($_GET["report_timesince"]) && !empty($_GET["report_timesince"]) && !is_null($_GET["report_timesince"]))
$query .= " and clock >=  UNIX_TIMESTAMP(STR_TO_DATE('".$_GET["report_timesince"]."', '%Y%m%d%H%i%s')) ";

		if(isset($_GET["report_timetill"]) && !empty($_GET["report_timetill"]) && !is_null($_GET["report_timetill"]))
$query .= " and clock <=  UNIX_TIMESTAMP(STR_TO_DATE('".$_GET["report_timetill"]."', '%Y%m%d%H%i%s')) ";
		
$query .= " group by date_format(FROM_UNIXTIME(clock),'%Y-%m') order by 4";

if(!isset($_GET["limit"]) && empty($_GET["limit"]) && is_null($_GET["limit"]))
	$result = _select($query);
else
	$result = _select($query,$_GET["limit"]);



$bln = array();
$bln['name'] = 'Datas';
$rows1['name'] = 'Maxima';
$rows2['name'] = 'Media';
$rows3['name'] = 'Minima';
while ($r = _fetch($result)) {
    $bln['data'][] = $r['data'];
    $rows1['data'][] = $r['maxima'];
	$rows2['data'][] = $r['media'];
	$rows3['data'][] = $r['minima'];
}
$rslt = array();
array_push($rslt, $bln);
array_push($rslt, $rows1);
array_push($rslt, $rows2);
array_push($rslt, $rows3);
print json_encode($rslt, JSON_NUMERIC_CHECK);
_close();
?>
	