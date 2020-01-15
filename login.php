<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once ("../contraloriasocialDB.php");
$user = $_GET['u'];
$pass = $_GET['p'];
$pass=md5(str_replace($user,'', base64_decode($pass)));
$user=base64_decode($user);
$response = 0;
$qry = "SELECT id_usuario, usuario, urol_id, usuario_movil, nombres, apellido_p, apellido_m FROM usuarios 
    WHERE usuario = '".$user."' AND contrasena = '". $pass ."'";
$valida = $contraloriasocialDB->SelectLimit($qry) or die($contraloriasocialDB->ErrorMsg());
if ($valida->RecordCount() > 0) {    
    $myHeader->alg="HS256";
    $myHeader->typ="JWT";
    $header = json_encode($myHeader);
    $myPayload->sub="1234567890";
    $myPayload->name=$user;
    $payload = json_encode($myPayload);
    $base64UrlHeader = str_replace(array('+', '/', '='), array('-', '_', ''), base64_encode($header));
    $base64UrlPayload = str_replace(array('+', '/', '='), array('-', '_', ''), base64_encode($payload));
    $signature = hash_hmac('sha256', "".$base64UrlHeader . "." . $base64UrlPayload."", 'secret', true);
    $base64UrlSignature = str_replace(array('+', '/', '='), array('-', '_', ''), base64_encode($signature));
    $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    $myObj->status = 1;
    $myObj->id = $valida->fields('id_usuario');
    $myObj->user = $valida->fields('usuario');
    $myObj->rol = $valida->fields('urol_id');
    $myObj->movil = $valida->fields('usuario_movil');
    $myObj->pass = $pass;
    $myObj->nombre = $valida->fields('nombres') . ' ' . $valida->fields('apellido_p') . ' ' .  $valida->fields('apellido_m');
    $myObj->token = $jwt;
    $myJSON = json_encode($myObj);
    $response = $myJSON;
} else {
    $myObj->status = 0;
    $myJSON = json_encode($myObj);
    $response = $myJSON;
}
$valida->close();

echo json_encode($response);
?>