<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
require_once ("../contraloriasocialDB.php");
$json=json_decode(file_get_contents('php://input'));
$capacitacionComites = $json->capacitacionComites;
$evidenciaCapacitacion = $json->evidenciaCapacitacion;
$evidenciaComite = $json->evidenciaComite;
$evidenciaIntegracion = $json->evidenciaIntegracion;
$fotoCapacitacion = $json->fotoCapacitacion;
$fotoIntegracion = $json->fotoIntegracion;
$integracionComites = $json->integracionComites;
$integranteCapacitacion = $json->integranteCapacitacion;
$integranteIntegracion = $json->integranteIntegracion;
$listaAsisttencia = $json->listaAsisttencia;
$participanteCapacitacion = $json->participanteCapacitacion;
$testigoIntegracion = $json->testigoIntegracion;
$qry = "SELECT id_usuario, usuario, urol_id, usuario_movil, nombres, apellido_p, apellido_m FROM usuarios 
    WHERE usuario = '".$json->user."' AND contrasena = '". $json->userP ."'";
$valida = $contraloriasocialDB->SelectLimit($qry) or die($contraloriasocialDB->ErrorMsg());
if ($valida->RecordCount() > 0) {
    $qryValidarToken = "SELECT token FROM comites 
    WHERE id_comite = " . $json->idComite . " AND obra_id = " . $json->idObra . "";
    $tokenComite = $contraloriasocialDB->SelectLimit($qryValidarToken) or die($contraloriasocialDB->ErrorMsg());
    if ($tokenComite->fields('token') === $json->tokenComite) {
        $myObj->token = 1;
        $myObj->idComite = $json->idComite; 
        $myObj->idObra = $json->idObra;
        $myObj->idUsuario = $json->idUser;
        $insertComiteAppQry="INSERT INTO comite_app(id_obra, id_comite, id_usuario, status_comite, rol) VALUES (" . $json->idObra . "," . $json->idComite . "," . $json->idUser . ",'subido'," . $json->rol . ")";
        $insertComiteApp=$contraloriasocialDB->Execute($insertComiteAppQry) or die($myObj->token = 2);
        if (sizeof($json->listaAsisttencia) > 0) {
            foreach ($json->listaAsisttencia as $listaAsisttenciaOne) {
                $insertListaAsistenciaQry="INSERT INTO comite_lista_asistencia(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $listaAsisttenciaOne->id_obra . "," . $listaAsisttenciaOne->id_comite . "," . $listaAsisttenciaOne->descargado . ",'" . $listaAsisttenciaOne->fecha . "','" . $listaAsisttenciaOne->lat . "','" . $listaAsisttenciaOne->lon . "','" . $listaAsisttenciaOne->imagen . "')";
                $insertListaAsistencia=$contraloriasocialDB->Execute($insertListaAsistenciaQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->evidenciaComite) > 0) {
            foreach ($json->evidenciaComite as $evidenciaComiteOne) {
                $insertEvidenciaComiteQry="INSERT INTO comite_evidencia_general(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $evidenciaComiteOne->id_obra . "," . $evidenciaComiteOne->id_comite . "," . $evidenciaComiteOne->descargado . ",'" . $evidenciaComiteOne->fecha . "','" . $evidenciaComiteOne->lat . "','" . $evidenciaComiteOne->lon . "','" . $evidenciaComiteOne->imagen . "')";
                $insertEvidenciaComite=$contraloriasocialDB->Execute($insertEvidenciaComiteQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->evidenciaIntegracion) > 0) {
            foreach ($json->evidenciaIntegracion as $evidenciaIntegracionOne) {
                $insertEvidenciaIntegracionQry="INSERT INTO comite_evidencia_integracion(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $evidenciaIntegracionOne->id_obra . "," . $evidenciaIntegracionOne->id_comite . "," . $evidenciaIntegracionOne->descargado . ",'" . $evidenciaIntegracionOne->fecha . "','" . $evidenciaIntegracionOne->lat . "','" . $evidenciaIntegracionOne->lon . "','" . $evidenciaIntegracionOne->imagen . "')";
                $insertEvidenciaIntegracion=$contraloriasocialDB->Execute($insertEvidenciaIntegracionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->evidenciaCapacitacion) > 0) {
            foreach ($json->evidenciaCapacitacion as $evidenciaCapacitacioOne) {
                $insertEvidenciaCapacitacionQry="INSERT INTO comite_evidencia_capacitacion(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $evidenciaCapacitacioOne->id_obra . "," . $evidenciaCapacitacioOne->id_comite . "," . $evidenciaCapacitacioOne->descargado . ",'" . $evidenciaCapacitacioOne->fecha . "','" . $evidenciaCapacitacioOne->lat . "','" . $evidenciaCapacitacioOne->lon . "','" . $evidenciaCapacitacioOne->imagen . "')";
                $insertEvidenciaCapacitacion=$contraloriasocialDB->Execute($insertEvidenciaCapacitacionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->fotoIntegracion) > 0) {
            foreach ($json->fotoIntegracion as $fotoIntegracionOne) {
                $insertFotoIntegracionQry="INSERT INTO comite_foto_integracion(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $fotoIntegracionOne->id_obra . "," . $fotoIntegracionOne->id_comite . "," . $fotoIntegracionOne->descargado . ",'" . $fotoIntegracionOne->fecha . "','" . $fotoIntegracionOne->lat . "','" . $fotoIntegracionOne->lon . "','" . $fotoIntegracionOne->imagen . "')";
                $insertFotoIntegracion=$contraloriasocialDB->Execute($insertFotoIntegracionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->fotoCapacitacion) > 0) {
            foreach ($json->fotoCapacitacion as $fotoCapacitacionOne) {
                $insertFotoCapacitacionQry="INSERT INTO comite_foto_capacitacion(id_obra, id_comite, id_usuario, fecha_captura, lat, lon, imagen) VALUES (" . $fotoCapacitacionOne->id_obra . "," . $fotoCapacitacionOne->id_comite . "," . $fotoCapacitacionOne->descargado . ",'" . $fotoCapacitacionOne->fecha . "','" . $fotoCapacitacionOne->lat . "','" . $fotoCapacitacionOne->lon . "','" . $fotoCapacitacionOne->imagen . "')";
                $insertFotoCapacitacion=$contraloriasocialDB->Execute($insertFotoCapacitacionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->integracionComites) > 0) {
            foreach ($json->integracionComites as $integracionComitesOne) {
                $integracionComitesQry="INSERT INTO comite_integracion(id_obra, id_comite, id_usuario, nombre_ejecutora, firma_ejecutora, nombre_normativa, firma_normativa, nombre_organo_estatal, cargo_organo_estatal, firma_organo_estatal) VALUES (" . $integracionComitesOne->id_obra . "," . $integracionComitesOne->id_comite . "," . $integracionComitesOne->descargado . ",'" . $integracionComitesOne->nombre_ejecutora . "','" . $integracionComitesOne->firma_ejecutora . "','" . $integracionComitesOne->nombre_normativa . "','" . $integracionComitesOne->firma_normativa . "','" . $integracionComitesOne->nombre_organo_estatal . "', '" . $integracionComitesOne->cargo_organo_estatal . "', '" . $integracionComitesOne->firma_organo_estatal . "')";
                $inserIntegracionComites=$contraloriasocialDB->Execute($integracionComitesQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->integranteIntegracion) > 0) {
            foreach ($json->integranteIntegracion as $integranteIntegracionOne) {
                $integranteIntegracionQry="INSERT INTO comite_integrante_integracion(id_obra, id_comite, id_usuario, nombre, cargo, domicilio, telefono, firma, genero, edad, curp, correo) VALUES (" . $integranteIntegracionOne->id_obra . "," . $integranteIntegracionOne->id_comite . "," . $integranteIntegracionOne->descargado . ",'" . $integranteIntegracionOne->nombre . "','" . $integranteIntegracionOne->cargo . "','" . $integranteIntegracionOne->domicilio . "','" . $integranteIntegracionOne->telefono . "', '" . $integranteIntegracionOne->firma ."', '" . $integranteIntegracionOne->genero . "', '" . $integranteIntegracionOne->edad . "', '" . $integranteIntegracionOne->curp . "', '" . $integranteIntegracionOne->correo . "')";
                $insertIntegranteIntegracion=$contraloriasocialDB->Execute($integranteIntegracionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->testigoIntegracion) > 0) {
            foreach ($json->testigoIntegracion as $testigoIntegracionOne) {
                $testigoIntegracionQry="INSERT INTO comite_testigo_integracion(id_obra, id_comite, id_usuario, nombre, firma, genero, edad, curp, correo) VALUES (" . $testigoIntegracionOne->id_obra . "," . $testigoIntegracionOne->id_comite . "," . $testigoIntegracionOne->descargado . ",'" . $testigoIntegracionOne->nombre . "', '" . $testigoIntegracionOne->firma ."', '" . $integranteIntegracionOne->genero . "', '" . $integranteIntegracionOne->edad . "', '" . $integranteIntegracionOne->curp . "', '" . $integranteIntegracionOne->correo . "')";
                $insertTtestigoIntegracion=$contraloriasocialDB->Execute($testigoIntegracionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->capacitacionComites) > 0) {
            foreach ($json->capacitacionComites as $capacitacionComitesOne) {
                $capacitacionComitesQry="INSERT INTO comite_capacitacion(id_obra, id_comite, id_usuario, constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, firma) VALUES (" . $capacitacionComitesOne->id_obra . "," . $capacitacionComitesOne->id_comite . "," . $capacitacionComitesOne->descargado . ",'" . $capacitacionComitesOne->constituyo . "','" . $capacitacionComitesOne->observaciones . "','" . $capacitacionComitesOne->pregunta1 . "','" . $capacitacionComitesOne->pregunta2 . "','" . $capacitacionComitesOne->pregunta3 . "','" . $capacitacionComitesOne->pregunta4 . "','" . $capacitacionComitesOne->pregunta5 . "','" . $capacitacionComitesOne->pregunta6 . "', '" . $capacitacionComitesOne->firma ."')";
                $insertCapacitacionComites=$contraloriasocialDB->Execute($capacitacionComitesQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->integranteCapacitacion) > 0) {
            foreach ($json->integranteCapacitacion as $integranteCapacitacionOne) {
                $integranteCapacitacionQry="INSERT INTO comite_integrante_capacitacion(id_obra, id_comite, id_usuario, nombre, edad, genero, domicilio, telefono, cargo, material_entregado, firma, curp, correo) VALUES (" . $integranteCapacitacionOne->id_obra . "," . $integranteCapacitacionOne->id_comite . "," . $integranteCapacitacionOne->descargado . ",'" . $integranteCapacitacionOne->nombre . "','" . $integranteCapacitacionOne->edad . "','" . $integranteCapacitacionOne->genero . "','" . $integranteCapacitacionOne->domicilio . "','" . $integranteCapacitacionOne->telefono . "','" . $integranteCapacitacionOne->cargo . "','" . $integranteCapacitacionOne->material_entregado . "','" . $integranteCapacitacionOne->firma . "','" . $integranteCapacitacionOne->curp . "','" . $integranteCapacitacionOne->correo . "')";
                $insertIntegranteCapacitacion=$contraloriasocialDB->Execute($integranteCapacitacionQry) or die($myObj->token = 2);
            }
        }
        if (sizeof($json->participanteCapacitacion) > 0) {
            foreach ($json->participanteCapacitacion as $participanteCapacitacionOne) {
                $participanteCapacitacionQry="INSERT INTO comite_participante_capacitacion(id_obra, id_comite, id_usuario, nombre, dependencia, firma, cargo, genero, edad, curp) VALUES (" . $participanteCapacitacionOne->id_obra . "," . $participanteCapacitacionOne->id_comite . "," . $participanteCapacitacionOne->descargado . ",'" . $participanteCapacitacionOne->nombre . "','" . $participanteCapacitacionOne->dependencia . "','" . $participanteCapacitacionOne->firma . "','" . $participanteCapacitacionOne->cargo . "','" . $participanteCapacitacionOne->genero . "','" . $participanteCapacitacionOne->edad . "','" . $participanteCapacitacionOne->curp . "')";
                $insertParticipanteCapacitacion=$contraloriasocialDB->Execute($participanteCapacitacionQry) or die($myObj->token = 2);
            }
        }
    } else {
        $myObj->token = 0;
    }
    $myObj->status = 1;
    $myJSON = $myObj;
    $response = $myJSON;
} else {
    $myObj->status = 0;
    $myJSON = $myObj;
    $response = $myJSON;
}
echo json_encode($myJSON);
?>