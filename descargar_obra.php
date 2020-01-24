<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once ("../contraloriasocialDB.php");
$json=json_decode(file_get_contents('php://input'));
$fechaInicio = date('Y-m-d');
$fechaFin = strtotime("+1 Months");
$usuario = $json->user;
$pass = $json->userP;
$rol = $json->rol; //1 ejecutora, 2, contraloria
$idUsuario = $json->idUser;
$fechaFin = date('Y-m-d', $fechaFin);
$obrasApp = $json->obrasApp;
$comitesApp = $json->comitesApp;
$comitesHabilitadosApp = $json->comitesHabilitadosApp;
//var_dump($comitesHabilitadosApp);die();
$response = 0;
$arrayComitesMes = $obrasAppMes = array();

$arrayNuevosObras = $arrayActualizarObrasTokenIgual = $arrayActualizarObrasTokenCambio = $arrayBorrarObra = $arrayNuevos = $arrayActualizarTokenIgual = $arrayActualizarTokenCambio = $arrayBorrar = $arrayComitesHabilitadosCambiaron = array();

$qry = "SELECT id_usuario, usuario, urol_id, usuario_movil, nombres, apellido_p, apellido_m FROM usuarios 
    WHERE usuario = '".$usuario."' AND contrasena = '". $pass ."'";
$valida = $contraloriasocialDB->SelectLimit($qry) or die($contraloriasocialDB->ErrorMsg());

$qryCargoEjecutora = "SELECT cargo FROM usuarios WHERE id_usuario = ". $idUsuario ."";
$qryCargoEjecutoraResult = $contraloriasocialDB->SelectLimit($qryCargoEjecutora) or die($contraloriasocialDB->ErrorMsg());

if ($valida->RecordCount() > 0) {
    foreach($comitesApp as $comitesAppOne) {
        if((strtotime($comitesAppOne->agendaFecha) >= strtotime($fechaInicio)) && (strtotime($comitesAppOne->agendaFecha) <= strtotime($fechaFin))) {
            $arrayComiteMesRow['id'] = $comitesAppOne->id;
            $arrayComiteMesRow['idObra'] = $comitesAppOne->idObra;
            $arrayComiteMesRow['idComite'] = $comitesAppOne->idComite;
            $arrayComiteMesRow['token'] = $comitesAppOne->token;
            $arrayComiteMesRow['statusEnvio'] = $comitesAppOne->statusEnvio;
            array_push($arrayComitesMes, $arrayComiteMesRow);
            $arrayObraMesRow['idObra'] = $comitesAppOne->idObra;
            foreach($obrasApp as $obj) {
                if ($comitesAppOne->idObra == $obj->idObra) {
                    $item = $obj;
                    break;
                }
            }
            $arrayObraMesRow['token'] = $item->token;
            array_push($obrasAppMes, $arrayObraMesRow);
        }
    }
    foreach($comitesHabilitadosApp as $comitesHabilitadosAppOne) {
        if((strtotime($comitesHabilitadosAppOne->agendaFecha) >= strtotime($fechaInicio)) && (strtotime($comitesHabilitadosAppOne->agendaFecha) <= strtotime($fechaFin))) {
            $arrayObraMesRow['idObra'] = $comitesHabilitadosAppOne->idObra;
            foreach($obrasApp as $obj) {
                if ($comitesHabilitadosAppOne->idObra == $obj->idObra) {
                    $item = $obj;
                    break;
                }
            }
            $arrayObraMesRow['token'] = $item->token;
            array_push($obrasAppMes, $arrayObraMesRow);
        }
    }
    $arrayComites = array(); $i = 0; $arrayObras = array(); $arrayObrasJson = array(); $j = 0;
    if($rol == 1) {// ejecutora
        $qryComites = "SELECT comites.contraloria_usuario_id, comites.agenda_confirmada, obras.origen, comites.id_comite, comites.num_comite, comites.metodo, comites.obra_id, comites.status, comites.agenda_fecha, comites.agenda_hora_inicio,
        comites.agenda_hora_fin, comites.usuario_id, obras.id_obra, obras.fondo, comites.representante_dependencia_normativa AS normativa, comites.metodo_contraloria, comites.token,
        (SELECT (usuarios.nombres || ' ' || usuarios.apellido_p || ' ' || usuarios.apellido_m) FROM usuarios WHERE comites.contraloria_usuario_id = usuarios.id_usuario) as contraloria_asistente, comites.cargo_dependencia_normativa FROM comites, obras WHERE comites.usuario_id = ". $idUsuario ." AND
        comites.agenda_fecha BETWEEN '". $fechaInicio ."' AND '" . $fechaFin ."' AND obras.id_obra = comites.obra_id AND comites.id_comite NOT IN (SELECT id_comite FROM comite_app WHERE id_usuario = " . $idUsuario . " AND status_comite = 'subido' AND rol = " . $rol . ")";
        $comites = $contraloriasocialDB->SelectLimit($qryComites) or die($contraloriasocialDB->ErrorMsg());
        while(!$comites->EOF) {
            $normativaFullName = $comites->Fields('normativa');
            $qryCargoNormativa = "SELECT cargo FROM usuarios WHERE nombres || ' ' || apellido_p || ' ' || apellido_m = '" . $normativaFullName ."'";
            $qryCargoNormativaResult = $contraloriasocialDB->SelectLimit($qryCargoNormativa) or die($contraloriasocialDB->ErrorMsg());
            if($comites->Fields('origen') == 'Picaso'){
                $qryComitesFondo = "SELECT fondos.norma_cs_aplica FROM obras, fondos WHERE obras.fondo = fondos.fondo AND obras.id_obra = ". $comites->Fields('id_obra') ."";
                $qryComitesFondoResult = $contraloriasocialDB->SelectLimit($qryComitesFondo) or die($contraloriasocialDB->ErrorMsg());
                if($qryComitesFondoResult->Fields('norma_cs_aplica') == 'ESTATAL'){
                    if($comites->Fields('agenda_confirmada') == 1 || $comites->Fields('agenda_confirmada') == 0){
                        //agregar al arreglo
                        $arrayComitesRegistro = array(
                            'contraloria_usuario_id' => $comites->Fields('contraloria_usuario_id'),
                            'usuario_id' => $comites->Fields('usuario_id'),
                            'agenda_confirmada' => $comites->Fields('agenda_confirmada'),
                            'id_comite' => $comites->Fields('id_comite'),
                            'num_comite' => $comites->Fields('num_comite'),
                            'metodo' => $comites->Fields('metodo'),
                            'obra_id' => $comites->Fields('obra_id'),
                            'status_comite' => $comites->Fields('status'),
                            'agenda_fecha' => $comites->Fields('agenda_fecha'),
                            'agenda_hora_inicio' => $comites->Fields('agenda_hora_inicio'),
                            'agenda_hora_fin' => $comites->Fields('agenda_hora_fin'),
                            'fondo' => $qryComitesFondoResult->Fields('norma_cs_aplica'),
                            'normativa' => $comites->Fields('normativa'),
                            'metodo_contraloria' => $comites->Fields('metodo_contraloria'),
                            'contraloria_asistente' => $comites->Fields('contraloria_asistente'),
                            'token' => $comites->Fields('token'),
                            'cargo_normativa' => $qryCargoNormativaResult->Fields('cargo'),
                            'cargo_ejecutora' => $qryCargoEjecutoraResult->Fields('cargo'),
                            'cargo_dependencia_normativa' => $comites->Fields('cargo_dependencia_normativa')
                        );
                        array_push($arrayObras,$comites->Fields('obra_id'));
                        $arrayComites[$i] = $arrayComitesRegistro;
                        $i++;
                    }
                }
                if($qryComitesFondoResult->Fields('norma_cs_aplica') == 'FEDERAL'){
                    //agregar al arreglo
                    $arrayComitesRegistro = array(
                        'contraloria_usuario_id' => $comites->Fields('contraloria_usuario_id'),
                        'usuario_id' => $comites->Fields('usuario_id'),
                        'agenda_confirmada' => $comites->Fields('agenda_confirmada'),
                        'id_comite' => $comites->Fields('id_comite'),
                        'num_comite' => $comites->Fields('num_comite'),
                        'metodo' => $comites->Fields('metodo'),
                        'obra_id' => $comites->Fields('obra_id'),
                        'status_comite' => $comites->Fields('status'),
                        'agenda_fecha' => $comites->Fields('agenda_fecha'),
                        'agenda_hora_inicio' => $comites->Fields('agenda_hora_inicio'),
                        'agenda_hora_fin' => $comites->Fields('agenda_hora_fin'),
                        'fondo' => $comites->Fields('norma_cs_aplica'),
                        'normativa' => $comites->Fields('normativa'),
                        'metodo_contraloria' => $comites->Fields('metodo_contraloria'),
                        'contraloria_asistente' => $comites->Fields('contraloria_asistente'),
                        'token' => $comites->Fields('token'),
                        'cargo_normativa' => $qryCargoNormativaResult->Fields('cargo'),
                        'cargo_ejecutora' => $qryCargoEjecutoraResult->Fields('cargo'),
                        'cargo_dependencia_normativa' => $comites->Fields('cargo_dependencia_normativa')
                    );
                    array_push($arrayObras,$comites->Fields('obra_id'));
                    $arrayComites[$i] = $arrayComitesRegistro;
                    $i++;
                }
            }else{
                //validar con dependencia y fondo
            }
            $comites->MoveNext();
        }
    }
    if($rol == 2) {// contraloria
        $qryComites = "SELECT comites.contraloria_usuario_id, comites.agenda_confirmada, obras.origen, comites.id_comite, comites.num_comite, comites.metodo, comites.obra_id, comites.status, comites.agenda_fecha, comites.agenda_hora_inicio,
        comites.agenda_hora_fin, comites.usuario_id, obras.id_obra, obras.fondo, fondos.norma_cs_aplica, comites.representante_dependencia_normativa AS normativa, comites.metodo_contraloria, comites.token,
        (SELECT (usuarios.nombres || ' ' || usuarios.apellido_p || ' ' || usuarios.apellido_m) FROM usuarios WHERE comites.contraloria_usuario_id = usuarios.id_usuario) as contraloria_asistente, comites.cargo_dependencia_normativa  FROM comites, obras, fondos WHERE comites.contraloria_usuario_id = ". $idUsuario ." AND
        comites.agenda_fecha BETWEEN '". $fechaInicio ."' AND '" . $fechaFin ."' AND obras.id_obra = comites.obra_id AND obras.fondo = fondos.fondo AND comites.id_comite NOT IN (SELECT id_comite FROM comite_app WHERE id_usuario = " . $idUsuario . " AND status_comite = 'subido' AND rol = " . $rol . ")";
        $comites = $contraloriasocialDB->SelectLimit($qryComites) or die($contraloriasocialDB->ErrorMsg());
        while(!$comites->EOF) {
            $qryCargoNormativa = "SELECT cargo FROM usuarios 
                WHERE nombres || ' ' || apellido_p || ' ' || apellido_m = '" . $comites->Fields('normativa') ."'";
            $qryCargoNormativaResult = $contraloriasocialDB->SelectLimit($qryCargoNormativa) or die($contraloriasocialDB->ErrorMsg());
            if($comites->Fields('origen') == 'Picaso'){
                $qryComitesFondo = "SELECT fondos.norma_cs_aplica FROM obras, fondos WHERE obras.fondo = fondos.fondo AND obras.id_obra = ". $comites->Fields('id_obra') ."";
                $qryComitesFondoResult = $contraloriasocialDB->SelectLimit($qryComitesFondo) or die($contraloriasocialDB->ErrorMsg());
                if($qryComitesFondoResult->Fields('norma_cs_aplica') == 'ESTATAL'){
                    if($comites->Fields('agenda_confirmada') == 1){
                        //agregar al arreglo
                        $arrayComitesRegistro = array(
                            'contraloria_usuario_id' => $comites->Fields('contraloria_usuario_id'),
                            'usuario_id' => $comites->Fields('usuario_id'),
                            'agenda_confirmada' => $comites->Fields('agenda_confirmada'),
                            'id_comite' => $comites->Fields('id_comite'),
                            'num_comite' => $comites->Fields('num_comite'),
                            'metodo' => $comites->Fields('metodo'),
                            'obra_id' => $comites->Fields('obra_id'),
                            'status_comite' => $comites->Fields('status'),
                            'agenda_fecha' => $comites->Fields('agenda_fecha'),
                            'agenda_hora_inicio' => $comites->Fields('agenda_hora_inicio'),
                            'agenda_hora_fin' => $comites->Fields('agenda_hora_fin'),
                            'fondo' => $qryComitesFondoResult->Fields('norma_cs_aplica'),
                            'normativa' => $comites->Fields('normativa'),
                            'metodo_contraloria' => $comites->Fields('metodo_contraloria'),
                            'contraloria_asistente' => $comites->Fields('contraloria_asistente'),
                            'token' => $comites->Fields('token'),
                            'cargo_normativa' => $qryCargoNormativaResult->Fields('cargo'),
                            'cargo_ejecutora' => $qryCargoEjecutoraResult->Fields('cargo'),
                            'cargo_dependencia_normativa' => $comites->Fields('cargo_dependencia_normativa')                                                                                                                    
                        );
                        array_push($arrayObras,$comites->Fields('obra_id'));
                        $arrayComites[$i] = $arrayComitesRegistro;
                        $i++;
                    }
                }
            }else{
                //validar con dependencia y fondo
            }
            $comites->MoveNext();
        }
    }
    // array de ids de comites habilitados en la app
    foreach ($comitesHabilitadosApp as $key => $value){
        $arrayComitesHabilitadosAppIds[$key] = $value->idComite;
    }
    // arrayComites tiene los comites del server
    // arrayComitesMes tiene los comites de la app
    foreach ($arrayComitesMes as $key => $value){
        $arrayComitesMesSingle[$key] = $value['idComite'];
    }
    foreach ($arrayComites as $key => $value){
        $arrayComitesSingle[$key] = $value['id_comite'];
    }
    foreach ($arrayComitesMes as $key => $value){
        if (in_array($value['idComite'], $arrayComitesSingle)) {
        } else {
            if ($value['statusEnvio'] === 1) {
                //no esta porque ya se subio
            } else {
                // no esta, se borró
                // var_dump('no esta, se borró');
                array_push($arrayBorrar, $arrayComitesMes[$key]);
            }
        }
    }
    foreach($arrayComites as $arrayComitesOne) {
        if (in_array($arrayComitesOne['id_comite'], $arrayComitesMesSingle)) {
            // update
            // var_dump('si esta');
            if ($arrayComitesOne['token'] == $arrayComitesMes[array_search($arrayComitesOne['id_comite'], $arrayComitesMesSingle)]['token']) {
                // var_dump('es igual el token');
                array_push($arrayActualizarTokenIgual, $arrayComitesOne);
            } else {
                // var_dump('no es igual el token');
                array_push($arrayActualizarTokenCambio, $arrayComitesOne);
            }
        } else {
            if (in_array($arrayComitesOne['id_comite'], $arrayComitesHabilitadosAppIds)) {
                if ($arrayComitesOne['token'] !== $comitesHabilitadosApp[array_search($arrayComitesOne['id_comite'], $arrayComitesHabilitadosAppIds)]->token) {
                    // comite habilitado cambio
                    array_push($arrayComitesHabilitadosCambiaron, $arrayComitesOne['num_comite']);
                }
            } else {
                // es nuevo
                // var_dump('no esta');
                array_push($arrayNuevos, $arrayComitesOne);
            }
        }
    }

    $arrayObras = array_unique($arrayObras);
    foreach($arrayObras as $clave=>$valor) {
        $qryObra = "SELECT obras.id_obra, obras.num_obra, obras.nombre_obra, obras.mmunicipio, obras.localidad, obras.status_obra, obras.monto_aprobado, obras.fondo, obras.ejecutora, obras.normativa, 
        obras.inicio_obra, obras.termino_obra, obras.lat, obras.lon, obras.programa, fondos.norma_cs_aplica, token FROM obras, fondos WHERE fondos.fondo = obras.fondo AND obras.id_obra = ". $valor ."";
        $qryObraResult = $contraloriasocialDB->SelectLimit($qryObra) or die($contraloriasocialDB->ErrorMsg());    
        $arrayObrasRegistro = array(
            'id_obra' => $qryObraResult->Fields('id_obra'),
            'num_obra' => $qryObraResult->Fields('num_obra'),
            'nombre_obra' => $qryObraResult->Fields('nombre_obra'),
            'mmunicipio' => $qryObraResult->Fields('mmunicipio'),
            'localidad' => $qryObraResult->Fields('localidad'),
            'status_obra' => $qryObraResult->Fields('status_obra'),
            'monto_aprobado' => $qryObraResult->Fields('monto_aprobado'),
            'fondo' => $qryObraResult->Fields('fondo'),
            'ejecutora' => $qryObraResult->Fields('ejecutora'),
            'normativa' => $qryObraResult->Fields('normativa'),
            'inicio_obra' => $qryObraResult->Fields('inicio_obra'),
            'termino_obra' => $qryObraResult->Fields('termino_obra'),
            'lat' => $qryObraResult->Fields('lat'),
            'lon' => $qryObraResult->Fields('lon'),
            'tipofondo' => $qryObraResult->Fields('norma_cs_aplica'),
            'token' => $qryObraResult->Fields('token'),
            'programa' => $qryObraResult->Fields('programa')
        );
        $arrayObrasJson[$j] = $arrayObrasRegistro;
        $j++;
    }

    foreach ($obrasAppMes as $key => $value){
        $arrayObrasMesSingle[$key] = $value['idObra'];
    }
    foreach ($obrasAppMes as $key => $value){
        if (in_array($value['idObra'], $arrayObras)) {
        } else {
            // no esta, se borró
            // var_dump('no esta, se borró');
            array_push($arrayBorrarObra,  $obrasAppMes[$key]);
        }
    }
    foreach($arrayObrasJson as $arrayObrasRegistroOne) {
        if (in_array($arrayObrasRegistroOne['id_obra'], $arrayObrasMesSingle)) {
            // update
            // var_dump('si esta');
            if ($arrayObrasRegistroOne['token'] == $obrasAppMes[array_search($arrayObrasRegistroOne['id_obra'], $arrayObrasMesSingle)]['token']) {
                // var_dump('es igual el token');
                array_push($arrayActualizarObrasTokenIgual, $arrayObrasRegistroOne);
            } else {
                // var_dump('no es igual el token');
                array_push($arrayActualizarObrasTokenCambio, $arrayObrasRegistroOne);
            }
        } else {
            // es nuevo
            // var_dump('no esta');
            array_push($arrayNuevosObras, $arrayObrasRegistroOne);
        }
    }

    $myObj->status = 1;
    $myObj->obrasNuevos = $arrayNuevosObras;
    $myObj->obrasActualizarTokenIgual = $arrayActualizarObrasTokenIgual;
    $myObj->obrasActualizarTokenCambio = $arrayActualizarObrasTokenCambio;
    $myObj->obrasBorrados = $arrayBorrarObra;
    $myObj->comitesNuevos = $arrayNuevos;
    $myObj->comitesActualizarTokenIgual = $arrayActualizarTokenIgual;
    $myObj->comitesActualizarTokenCambio = $arrayActualizarTokenCambio;
    $myObj->comitesBorrados = $arrayBorrar;
    if (count($arrayComitesHabilitadosCambiaron) > 0) {
        $myObj->comitesHabilitadosCambiaron = implode(", ", $arrayComitesHabilitadosCambiaron);
    }else{
        $myObj->comitesHabilitadosCambiaron = null;
    }
    $myJSON = json_encode($myObj);
    $response = $myJSON;
} else {
    $myObj->status = 2;
    $myJSON = json_encode($myObj);
    $response = $myJSON;
}
echo json_encode($response);
?>