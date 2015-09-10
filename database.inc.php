<?php
//	misc parameters
define('IMAGE_FORMAT_PNG',	'PNG');

//configurações para conexão, usuário, banco, etc
require_once('zabbix.conf.php');

// db parameters
define('ZBX_DB_MYSQL','MYSQL');

$DB['DB'] = @mysqli_connect($DB['SERVER'], $DB['USER'], $DB['PASSWORD'], $DB['DATABASE'], $DB['PORT']);
$erro = '';

function nvl($var){
	if(!isset($_GET[$var]))
		if(!empty($_GET[$var]))
			return true;
			return false;
}

//conecta com o database
function _connect() {
	global $DB;
	global $erro;
	
	if (isset($DB['DB'])) {
		$erro .= 'Cannot create another database connection.';
		return false;
	}

	$result = true;

	$DB['DB'] = null; 

	if (!isset($DB['TYPE'])) {
		$erro .= 'Unknown database type.';
		$result = false;
	}
	else {
		$DB['TYPE'] = strtoupper($DB['TYPE']);

		switch ($DB['TYPE']) {
			case ZBX_DB_MYSQL:
				$DB['DB'] = @mysqli_connect($DB['SERVER'], $DB['USER'], $DB['PASSWORD'], $DB['DATABASE'], $DB['PORT']);
				if (!$DB['DB']) {
					$erro .= 'Error connecting to database: '.trim(mysqli_connect_error());
					$result = false;
				}
				else {
					_select('SET NAMES utf8');
				}
				break;
			default:
				$erro .= 'Unsupported database';
				$result = false;
		}
	}

	if (false == $result) {
		$DB['DB'] = null;
	}

	return $result;
}

//fecha a conexao com o database
function _close() {
	global $DB;
	global $erro;
	
	$result = false;

	if (isset($DB['DB']) && !empty($DB['DB'])) {
		switch ($DB['TYPE']) {
			case ZBX_DB_MYSQL:
				$result = mysqli_close($DB['DB']);
				break;
		}
	unset($DB['DB']);
	return $result;
	}
}

function _setbadlimit($query, $limit = 0, $offset = 0) {
	global $DB;
	global $erro;
	
	if ((isset($limit) && ($limit < 0 || !ctype_digit(strval($limit)))) || $offset < 0 || ! ctype_digit(strval($offset))) {
		$moreDetails = isset($limit) ? ' Limit ['.$limit.'] Offset ['.$offset.']' : ' Offset ['.$offset.']';
		$erro .= 'Incorrect parameters for limit and/or offset. Query ['.$query.']'.$moreDetails;
		return false;
	}

	// Process limit and offset
	if (isset($limit)) {
		switch ($DB['TYPE']) {
		case ZBX_DB_MYSQL:
			$query .= ' LIMIT '.intval($limit).' OFFSET '.intval($offset);
			break;
		}
	}	
	return $query;
}

function _select($query, $limit = null, $offset = 0) {
	global $DB;
	global $erro;
	
	$result = false;

	if (!isset($DB['DB']) || empty($DB['DB'])) {
		_connect();
		if (!isset($DB['DB']) || empty($DB['DB'])) {
		return $result;
		}
	}

	// add the LIMIT clause
	if(!$query = _setbadlimit($query, $limit, $offset)) {
		return false;
	}

	switch ($DB['TYPE']) {
		case ZBX_DB_MYSQL:
			if (!$result = mysqli_query($DB['DB'], $query)) {
				$erro .= 'Error in query ['.$query.'] ['.mysqli_error($DB['DB']).']';
			}
			break;
	}
	
	return $result;
} 

function _fetch($cursor, $convertNulls = true) {
	global $DB;
	global $erro;
	
	$result = false;

	if (!isset($DB['DB']) || empty($DB['DB'])) {
		if (!isset($DB['DB']) || empty($DB['DB']) || is_bool($cursor)) {
			_connect();
		}
		return $result;
	}
	
	switch ($DB['TYPE']) {
		case ZBX_DB_MYSQL:
			$result = mysqli_fetch_assoc($cursor);
			if (!$result) {
				mysqli_free_result($cursor);
			}
			break;
	}
	
	if ($result) {
		if ($convertNulls) {
			foreach ($result as $key => $val) {
				if (is_null($val)) {
					$result[$key] = '0';
				}
			}
		}

		return $result;
	}

	return false;
}

?>