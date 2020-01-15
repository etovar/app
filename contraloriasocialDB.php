<?php 
# PHP ADODB document - made with PHAkt
# FileName="Connection_php_adodb.htm"
# Type="ADODB"
# HTTP="true"
# DBTYPE="postgres7"

$MM_contraloriasocialDB_HOSTNAME = "127.0.0.1";
$MM_contraloriasocialonlyDB_DATABASE = "sicseq";
$MM_contraloriasocialDB_DATABASE = "postgres7:sicseq";
$MM_contraloriasocialDB_DBTYPE   = preg_replace("/:.*$/", "", $MM_contraloriasocialDB_DATABASE);
$MM_contraloriasocialDB_DATABASE = preg_replace("/^.*?:/", "", $MM_contraloriasocialDB_DATABASE);
$MM_contraloriasocialDB_USERNAME = "queretaro";
$MM_contraloriasocialDB_PASSWORD = "Vwh_9410%.";
$MM_contraloriasocialDB_LOCALE = "EUS";
$MM_contraloriasocialDB_MSGLOCALE = "En";
$MM_contraloriasocialDB_CTYPE = "P";
$KT_locale = $MM_contraloriasocialDB_MSGLOCALE;
$KT_dlocale = $MM_contraloriasocialDB_LOCALE;
$KT_semodverFormat = "%Y-%m-%d %H:%M:%S";
$QUB_Caching = "false";
$KT_localFormat = "%m-%d-%Y %H:%M:%S";
	
if (!defined('CONN_DIR')) 
	define('CONN_DIR',dirname(__FILE__));
require_once(CONN_DIR."/../adodb/adodb.inc.php");
ADOLoadCode($MM_contraloriasocialDB_DBTYPE);
$contraloriasocialDB=&ADONewConnection($MM_contraloriasocialDB_DBTYPE);

if($MM_contraloriasocialDB_DBTYPE == "access" || $MM_contraloriasocialDB_DBTYPE == "odbc")
{
	if($MM_contraloriasocialDB_CTYPE == "P")
	{
		$contraloriasocialDB->PConnect($MM_contraloriasocialDB_DATABASE, $MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD,$MM_contraloriasocialDB_LOCALE);
	} 
	else 
		$contraloriasocialDB->Connect($MM_contraloriasocialDB_DATABASE, $MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD,$MM_contraloriasocialDB_LOCALE);
}
else
	if (($MM_contraloriasocialDB_DBTYPE == "ibase") or ($MM_contraloriasocialDB_DBTYPE == "firebird"))
	{
		if($MM_contraloriasocialDB_CTYPE == "P")
		{
			$contraloriasocialDB->PConnect($MM_contraloriasocialDB_HOSTNAME.":".$MM_contraloriasocialDB_DATABASE,$MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD);
		}
		else
			$contraloriasocialDB->Connect($MM_contraloriasocialDB_HOSTNAME.":".$MM_contraloriasocialDB_DATABASE,$MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD);
	}
	else
	{
		if($MM_contraloriasocialDB_CTYPE == "P")
			$contraloriasocialDB->PConnect($MM_contraloriasocialDB_HOSTNAME,$MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD,$MM_contraloriasocialDB_DATABASE,$MM_contraloriasocialDB_LOCALE);
		else
			$contraloriasocialDB->Connect($MM_contraloriasocialDB_HOSTNAME,$MM_contraloriasocialDB_USERNAME,$MM_contraloriasocialDB_PASSWORD,$MM_contraloriasocialDB_DATABASE,$MM_contraloriasocialDB_LOCALE);
	}
	
if (!function_exists("updateMagicQuotes")) 
{
	function updateMagicQuotes($HTTP_VARS)
	{
		if (is_array($HTTP_VARS)) 
		{
			foreach ($HTTP_VARS as $name=>$value) 
			{
				if (!is_array($value)) 
				{
					$HTTP_VARS[$name] = addslashes($value);
				} 
				else 
				{
					foreach ($value as $name1=>$value1) 
					{
						if (!is_array($value1)) 
						{
							$HTTP_VARS[$name1][$value1] = addslashes($value1);
						}
					}
				}
				global $$name;
				$$name = &$HTTP_VARS[$name];
			}
		}
		return $HTTP_VARS;
	}
	if (!get_magic_quotes_gpc()) 
	{
		$HTTP_GET_VARS = updateMagicQuotes($HTTP_GET_VARS);
		$HTTP_POST_VARS = updateMagicQuotes($HTTP_POST_VARS);
		$HTTP_COOKIE_VARS = updateMagicQuotes($HTTP_COOKIE_VARS);
	}
}

if (!isset($HTTP_SERVER_VARS['REQUEST_URI'])) 
{
	$HTTP_SERVER_VARS['REQUEST_URI'] = $PHP_SELF;
}
?>
