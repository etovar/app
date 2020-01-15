<?php
header("Access-Control-Allow-Origin: *");
header("Content-type: text/plain");
header("Access-Control-Expose-Headers: Access-Control-Allow-Origin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header("Access-Control-Request-Method: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
require_once ("../sepremDB.php");

//file_put_contents( '../../disco2/seprem/pcontrata/imagedecode.jpg', base64_decode(str_replace("data:image/jpeg;base64,","",$imagen64)) );
$json=json_decode(file_get_contents('php://input'));
$imagen64 = $json->image;
$testInsert="INSERT INTO dspc.test_ionic (dependencia,participante,imagen) VALUES ('nulo','nulo','".$imagen64."')";
$insert=$sepremDB->Execute($testInsert) or die($sepremDB->ErrorMsg());
if ($sepremDB->affected_rows() !== 0) {
    $response = 1;
}
$insert->Close();
$response = 'ok';
echo json_encode($response);
?>