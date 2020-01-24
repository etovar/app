import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { identifierModuleUrl } from '@angular/compiler';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class BdService {
  public db: SQLiteObject;
  private isOpen: boolean;
  public infoObraActa = [];
  public arrayObrasGrl = [];
  public arrayComitesGrl = [];
  public arrayComitesHoy = [];
  public arrayComitesProximo = [];
  public arrayComitesEnviado = [];
  public arrayComitesvencido = [];
  public arrayFotos = [];
  public arrayTestigos = [];
  private arrayParticipantes = [];
  public arrayIntegrantesVocal = [];
  public arrayIntegrantesPresidente = [];
  public arrayComitesApp = [{}];
  public arrayObrasApp = [{}];
  public arrayComitesHabilitadosApp = [{}];
  public listaCompleto = 0;
  public evidenciaComiteCompleto = 0;
  public evidenciaCompleto = 0;
  public integracionDigitalCompleto = 0;
  public capacitacionDigitalCompleto = 0;
  private comiteInfoArray = [];
  public listaAsisttenciaTmp = [];
  public evidenciaComiteTmp = [];
  public evidenciaIntegracionTmp = [];
  public evidenciaCapacitacionTmp = [];
  public fotoIntegracionTmp = [];
  public fotoCapacitacionTmp = [];
  public integracionComitesTmp = [];
  public integranteIntegracionTmp = [];
  public testigoIntegracionTmp = [];
  public capacitacionComitesTmp = [];
  public integranteCapacitacionTmp = [];
  public participanteCapacitacionTmp = [];
  public tokenComite: any;
  public fechaHoy = Date.now();
  public metodoIntegracionActa: any;
  public metodoCapacitacionActa: any;
  constructor(
    public storage: SQLite,
    public navCtrl: NavController,
    private storageLogin: Storage,
    public datepipe: DatePipe
  ) {
    if (!this.isOpen) {
      this.storage = new SQLite();
      this.storage.create({name: 'contraloria.db', location: 'default'}).then((db: SQLiteObject) => {
        this.db = db;
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS obras (id INTEGER PRIMARY KEY AUTOINCREMENT, id_obra INTEGER, num_obra INTEGER, nombre_obra TEXT, mmunicipio TEXT, localidad TEXT, status_obra TEXT, monto_aprobado INTEGER, fondo INTEGER, ejecutora TEXT, normativa TEXT, inicio_obra TEXT, termino_obra TEXT, descargado INTEGER, lat INTEGER, lon INTEGER, tipofondo TEXT, token TEXT, programa TEXT, comites_enviados INTEGER DEFAULT 0)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS comites (id INTEGER PRIMARY KEY AUTOINCREMENT, contraloria_usuario_id INTEGER, agenda_confirmada INTEGER, origen TEXT, id_comite INTEGER, num_comite INTEGER, metodo TEXT, obra_id INTEGER, status TEXT, agenda_fecha TEXT, agenda_hora_inicio TEXT, agenda_hora_fin TEXT, usuario_id INTEGER, id_obra INTEGER, fondo TEXT, norma_cs_aplica TEXT, descargado INTEGER, normativa TEXT, metodo_contraloria TEXT, contraloria_asistente TEXT, habilitado INTEGER, token TEXT, status_enviado INTEGER DEFAULT 0, fecha_envio TEXT, cargo_ejecutora TEXT, cargo_normativa TEXT, cargo_dependencia_normativa TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS evidencias (id INTEGER PRIMARY KEY AUTOINCREMENT, imagen TEXT, modulo TEXT, accion TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER, fecha TEXT, lat TEXT, lon TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS integrante_integracion (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, domicilio TEXT, telefono TEXT, cargo TEXT, firma TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER, genero TEXT, edad INTEGER, curp TEXT, correo TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS testigo_integracion (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, firma TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER, numero_testigo INTEGER, genero TEXT, edad INTEGER, curp TEXT, correo TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS integracion_comites (id INTEGER PRIMARY KEY AUTOINCREMENT, id_obra INTEGER, id_comite INTEGER, nombre_ejecutora TEXT, firma_ejecutora TEXT, cargo_ejecutora TEXT, nombre_normativa TEXT, firma_normativa TEXT, cargo_normatia TEXT, descargado INTEGER, nombre_organo_estatal TEXT, cargo_organo_estatal TEXT, firma_organo_estatal TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS integrante_capacitacion (id INTEGER PRIMARY KEY AUTOINCREMENT, edad TEXT, genero TEXT, nombre TEXT, domicilio TEXT, telefono TEXT, cargo TEXT, material_entregado TEXT, firma TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER, curp TEXT, correo TEXT) ', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS participante_capacitacion (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, dependencia TEXT, firma TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER, genero TEXT, edad INTEGER, curp TEXT, cargo TEXT)', []);
        // tslint:disable-next-line:max-line-length
        db.executeSql('CREATE TABLE IF NOT EXISTS capacitacion_comites (id INTEGER PRIMARY KEY AUTOINCREMENT, constituyo TEXT, observaciones TEXT, pregunta1 TEXT, pregunta2 TEXT, pregunta3 TEXT, pregunta4 TEXT, pregunta5 TEXT, pregunta6 TEXT, firma TEXT, id_obra INTEGER, id_comite INTEGER, descargado INTEGER)', []);
        this.isOpen = true;
      }).catch((err) => {
        console.log(err);
      });
    }
   }

    CargarInfoGuardada() {
      const qry4 = 'SELECT * FROM comites';
      this.db.executeSql(qry4, []).then((data4) => {
        console.log(data4);
        const qry5 = 'SELECT * FROM obras';
        this.db.executeSql(qry5, []).then((data5) => {
          console.log(data5);
        });
      });
    }

    ObtenerFotos(modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any) {
      this.arrayFotos = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT imagen, fecha, lat, lon FROM evidencias WHERE descargado = ' + idusuario + ' AND modulo = "' + modulo + '" AND accion = "' + accion + '" AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayFotos.push({
              foto: data.rows.item(i).imagen,
            });
          }
        }
        resolve(this.arrayFotos);
      }, (error) => {
        reject(error);
      });
      });
    }

    BorrarFoto(foto: any, modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM evidencias WHERE id_obra = ? AND descargado = ? AND id_comite = ? AND imagen = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [idobra, idusuario, idcomite, foto]).then((data) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      });
    }

    GuardarFoto(foto: any, modulo: any, accion: any, idobra: any, idcomite: any, idusuario: any, fechaCaptura: any, lat: any, lon: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'INSERT INTO evidencias (imagen, modulo, accion, id_obra, id_comite, descargado, fecha, lat, lon) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [foto, modulo, accion, idobra, idcomite, idusuario, fechaCaptura, lat, lon]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    }

    GetTestigosCapacitacion(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayParticipantes = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre FROM participante_capacitacion WHERE descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayParticipantes.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre
            });
          }
        }
        resolve(this.arrayParticipantes);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetTestigosIntegracion(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayTestigos = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, numero_testigo FROM testigo_integracion WHERE descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayTestigos.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              numeroTestigo: data.rows.item(i).numero_testigo
            });
          }
        }
        resolve(this.arrayTestigos);
      }, (error) => {
        reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    ActualizarTestigoIntegracion(idintegrante: any, nombre: any, firma: any, idobra: any, idcomite: any, userid: any, genero: any, edad: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE testigo_integracion SET nombre = ?, firma = ?, genero = ?, edad = ?, curp = ?, correo = ? WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, firma, genero, edad, curp, correo, idintegrante]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    GuardarTestigoIntegracion(nombre: any, firma: any, idobra: any, idcomite: any, idusuario: any, numeroTestigo: any, genero: any, edad: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'INSERT INTO testigo_integracion (nombre, firma, numero_testigo, id_obra, id_comite, descargado, genero, edad, curp, correo) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?)';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, firma, numeroTestigo, idobra, idcomite, idusuario, genero, edad, curp, correo]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    }

    // tslint:disable-next-line:max-line-length
    ActualizarIntegranteCapacitacion(idintegrante: any, edad: any, genero: any, nombre: any, domicilio: any, telefono: any, cargo: any, materialEntregado: any, firma: any, idobra: any, idcomite: any, iduser: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE integrante_capacitacion SET edad = ?, genero = ?, nombre = ?, domicilio = ?, telefono = ?, cargo = ?, material_entregado = ?, firma = ?, curp = ?, correo = ? WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [edad, genero, nombre, domicilio, telefono, cargo, materialEntregado, firma, curp, correo, idintegrante]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    ActualizarParticipanteCapacitacion(nombre: any, dependencia: any, firma: any, idobra: any, idcomite: any, iduser: any, participante: any, genero: any, edad: any, curp: any, cargo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE participante_capacitacion SET nombre = ?, dependencia = ?, firma = ?, genero = ?, edad = ?, curp = ?, cargo = ? WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, dependencia, firma, genero, edad, curp, cargo, participante]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    GuardarParticipanteCapacitacion(nombre: any, dependencia: any, firma: any, idobra: any, idcomite: any, iduser: any, genero: any, edad: any, curp: any, cargo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'INSERT INTO participante_capacitacion (nombre, dependencia, firma, id_obra, id_comite, descargado, genero, edad, curp, cargo) VALUES (?, ?, ?, ?, ?, ?, ? ,?, ?, ?)';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, dependencia, firma, idobra, idcomite, iduser, genero, edad, curp, cargo]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    }

    // tslint:disable-next-line:max-line-length
    GuardarIntegranteCapacitacion(edad: any, genero: any, nombre: any, domicilio: any, telefono: any, cargo: any, materialEntregado: any, firma: any, idobra: any, idcomite: any, iduser: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'INSERT INTO integrante_capacitacion (edad, genero, nombre, domicilio, telefono, cargo, material_entregado, firma, id_obra, id_comite, descargado, curp, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [edad, genero, nombre, domicilio, telefono, cargo, materialEntregado, firma, idobra, idcomite, iduser, curp, correo]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    }

    GetIntegrantesCapacitacion(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayIntegrantesVocal = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, cargo FROM integrante_capacitacion WHERE cargo = "Vocal" AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayIntegrantesVocal.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre
            });
          }
        }
        resolve(this.arrayIntegrantesVocal);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetParticipanteCapacitacionDetalle(idobra: any, idcomite: any, iduser: any, participante: any) {
  // tslint:disable-next-line:prefer-const
  let arrayParticipanteDetalles = [];
  // tslint:disable-next-line:max-line-length
  const qry = 'SELECT id, nombre, dependencia, firma, genero, edad, curp, cargo FROM participante_capacitacion WHERE id = ' + participante + ' AND descargado = ' + iduser + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
  // tslint:disable-next-line:no-shadowed-variable
  return new Promise ((resolve, reject) => {
  this.db.executeSql(qry, []).then((data) => {
    if (data.rows.length > 0) {
      for (let i = 0; i < data.rows.length; i++) {
        arrayParticipanteDetalles.push({
          id: data.rows.item(i).id,
          nombre: data.rows.item(i).nombre,
          dependencia: data.rows.item(i).dependencia,
          firma: data.rows.item(i).firma,
          genero: data.rows.item(i).genero,
          edad: data.rows.item(i).edad,
          curp: data.rows.item(i).curp,
          cargo: data.rows.item(i).cargo
        });
      }
    }
    resolve(arrayParticipanteDetalles);
  }, (error) => {
    reject(error);
  });
  });
    }

    GetIntegranteCapacitacionDetalle(idobra: any, idcomite: any, iduser: any, participante: any) {
      // tslint:disable-next-line:prefer-const
      let arrayParticipanteDetalles = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, edad, genero, nombre, domicilio, telefono, cargo, material_entregado, firma, curp, correo FROM integrante_capacitacion WHERE id = ' + participante + ' AND descargado = ' + iduser + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            arrayParticipanteDetalles.push({
              id: data.rows.item(i).id,
              edad: data.rows.item(i).edad,
              genero: data.rows.item(i).genero,
              nombre: data.rows.item(i).nombre,
              domicilio: data.rows.item(i).domicilio,
              telefono: data.rows.item(i).telefono,
              cargo: data.rows.item(i).cargo,
              materialEntregado: data.rows.item(i).material_entregado,
              firma: data.rows.item(i).firma,
              curp: data.rows.item(i).curp,
              correo: data.rows.item(i).correo
            });
          }
        }
        resolve(arrayParticipanteDetalles);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetIntegrantesIntegracion(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayIntegrantesVocal = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, cargo FROM integrante_integracion WHERE cargo = "Vocal" AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayIntegrantesVocal.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre
            });
          }
        }
        resolve(this.arrayIntegrantesVocal);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetCapturaCapacitacion(obraid, idcomite, userid) {
      const arrayCapturaIntegracion = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, firma  FROM capacitacion_comites WHERE id_obra = ' + obraid + ' AND id_comite = ' + idcomite + ' AND descargado = ' + userid;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              arrayCapturaIntegracion.push({
                constituyo: data.rows.item(i).constituyo,
                observaciones: data.rows.item(i).observaciones,
                pregunta1: data.rows.item(i).pregunta1,
                pregunta2: data.rows.item(i).pregunta2,
                pregunta3: data.rows.item(i).pregunta3,
                pregunta4: data.rows.item(i).pregunta4,
                pregunta5: data.rows.item(i).pregunta5,
                pregunta6: data.rows.item(i).pregunta6,
                firmaAsignado: data.rows.item(i).firma
              });
            }
          }
          resolve(arrayCapturaIntegracion);
        }, (error) => {
          reject(error);
        });
        });
    }

    GetCapturaIntegracion(obraid, idcomite, userid) {
      const arrayCapturaIntegracion = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT nombre_ejecutora, firma_ejecutora, nombre_normativa, firma_normativa, nombre_organo_estatal, cargo_organo_estatal, firma_organo_estatal FROM integracion_comites WHERE id_obra = ' + obraid + ' AND id_comite = ' + idcomite + ' AND descargado = ' + userid;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              arrayCapturaIntegracion.push({
                nombreEjecutora: data.rows.item(i).nombre_ejecutora,
                firmaEjecutora: data.rows.item(i).firma_ejecutora,
                nombreNormativa: data.rows.item(i).nombre_normativa,
                firmaNormativa: data.rows.item(i).firma_normativa,
                nombreOrganoEstatal: data.rows.item(i).nombre_organo_estatal,
                cargoOrganoEstatal: data.rows.item(i).cargo_organo_estatal,
                firmaOrganoEstatal: data.rows.item(i).firma_organo_estatal
              });
            }
          }
          resolve(arrayCapturaIntegracion);
        }, (error) => {
          reject(error);
        });
        });
    }

    GetIntegrantesCapacitacionPresidente(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayIntegrantesPresidente = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, cargo FROM integrante_capacitacion WHERE cargo IN ("Presidente","Tesorero","Secretario","Vocal ") AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayIntegrantesPresidente.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              cargo: data.rows.item(i).cargo
            });
          }
        }
        resolve(this.arrayIntegrantesPresidente);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetIntegrantesIntegracionPresidente(idobra: any, idcomite: any, idusuario: any) {
      // tslint:disable-next-line:prefer-const
      this.arrayIntegrantesPresidente = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, cargo FROM integrante_integracion WHERE cargo IN ("Presidente","Tesorero","Secretario","Vocal ") AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayIntegrantesPresidente.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              cargo: data.rows.item(i).cargo
            });
          }
        }
        resolve(this.arrayIntegrantesPresidente);
      }, (error) => {
        reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    ActualizarIntegranteIntegracion(idintegrante: any, nombre: any, domicilio: any, telefono: any, cargo: any, firma: any, idobra: any, idcomite: any, idusuario: any, genero: any, edad: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE integrante_integracion SET nombre = ?, domicilio = ?, telefono = ?, firma = ?, cargo = ?, genero = ?, edad = ?, curp = ?, correo = ? WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, domicilio, telefono, firma, cargo, genero, edad, curp, correo, idintegrante]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    // tslint:disable-next-line:max-line-length
    GuardarIntegranteIntegracion(nombre: any, domicilio: any, telefono: any, cargo: any, firma: any, idobra: any, idcomite: any, idusuario: any, genero: any, edad: any, curp: any, correo: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'INSERT INTO integrante_integracion (nombre, domicilio, telefono, cargo, firma, id_obra, id_comite, descargado, genero, edad, curp, correo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [nombre, domicilio, telefono, cargo, firma, idobra, idcomite, idusuario, genero, edad, curp, correo]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    BorrarParticipanteCapacitacion(id: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM participante_capacitacion WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [id]).then((data) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      });
    }

    BorrarIntegranteCapacitacion(id: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM integrante_capacitacion WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [id]).then((data) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      });
    }

    BorrrIntegranteIntegracion(id: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM integrante_integracion WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [id]).then((data) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      });
    }

    BorrrTestigoIntegracion(id: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM testigo_integracion WHERE id = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [id]).then((data) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      });
    }

    // tslint:disable-next-line:max-line-length
    InsertarObra(identification: number, idobra: any, numobra: any, nombreobra: any, mmunicipio: any, localidad: any, statusobra: any, montoaprobado: any, fondo: any, ejecutora: any, normativa: any, inicioobra: any, terminoobra: any, descargado: any, lat: any, lon: any, tipofondo: any, token: any, programa: any) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
     // tslint:disable-next-line:max-line-length
     const sql = 'INSERT INTO obras (id_obra, num_obra, nombre_obra, mmunicipio, localidad, status_obra, monto_aprobado, fondo, ejecutora, normativa, inicio_obra, termino_obra, descargado, lat, lon, tipofondo, token, programa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
     // tslint:disable-next-line:max-line-length
     this.db.executeSql(sql, [idobra, numobra, nombreobra, mmunicipio, localidad, statusobra, montoaprobado, fondo, ejecutora, normativa, inicioobra, terminoobra, descargado, lat, lon, tipofondo, token, programa]).then((data) => {
       resolve(data);
     }, (error) => {
       reject(error);
     });
    });
    }

    // tslint:disable-next-line:max-line-length
    InsertarComite(identification: number, contraloriausuarioid: any, agendaconfirmada: any, origen: any, idcomite: any, numcomite: any, metodo: any, obraid: any, status: any, agendafecha: any, agendahorainicio: any, agendahorafin: any, usuarioid: any, idobra: any, fondo: any, normacsaplica: any, descargado: any, normativa: any, metodoContraloria: any, contraloriaAsistente: any, token: any, cargoEjecutora: any, cargoNormativa: any, cargoDependenciaNormativa: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const sql = 'INSERT INTO comites (contraloria_usuario_id, agenda_confirmada, origen, id_comite, num_comite, metodo, obra_id, status, agenda_fecha, agenda_hora_inicio, agenda_hora_fin, usuario_id, id_obra, fondo, norma_cs_aplica, descargado, normativa, metodo_contraloria, contraloria_asistente, habilitado, token, cargo_ejecutora, cargo_normativa, cargo_dependencia_normativa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [contraloriausuarioid, agendaconfirmada, origen, idcomite, numcomite, metodo, obraid, status, agendafecha, agendahorainicio, agendahorafin, usuarioid, idobra, fondo, normacsaplica, descargado, normativa, metodoContraloria, contraloriaAsistente, 0, token, cargoEjecutora, cargoNormativa, cargoDependenciaNormativa]).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
      });
    }

    BorrarObraYComites(idLocal, idObra, idUsuario) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const sql = 'DELETE FROM obras WHERE id_obra = ? AND descargado = ? AND id = ?';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [idObra, idUsuario, idLocal]).then((data) => {
        return new Promise ((resolveCom, rejectCom) => {
          // tslint:disable-next-line:max-line-length
          const sqlCom = 'DELETE FROM comites WHERE obra_id = ? AND descargado = ?';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sqlCom, [idObra, idUsuario]).then((dataCOm) => {
            this.BorrarContenidoObra(idObra, idUsuario);
            resolve('borrado');
          }, (error) => {
            reject(error);
          });
        });
      }, (error) => {
        reject(error);
      });
    });
    }

    BorrarObra(idObra, idLocal, idUsuario) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const sql = 'DELETE FROM obras WHERE id_obra = ? AND descargado = ?';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [idObra, idUsuario]).then((data) => {
        resolve('borrado');
      }, (error) => {
        reject(error);
      });
    });
    }

    GetAgendaConfirmada(idobra: any, idcomite: any, iduser: any) {
    let respuesta: any;
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT agenda_confirmada FROM comites WHERE obra_id = ' + idobra + ' AND descargado = ' + iduser + ' AND id_comite = ' + idcomite;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
        respuesta = data.rows.item(0).agenda_confirmada;
        } else {
          respuesta = null;
        }
        resolve(respuesta);
      }, (error) => {
        reject(error);
      });
    });
    }

    GetComiteExtraData(idobra: any, idcomite: any, iduser: any) {
    let respuesta: any;
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT contraloria_asistente FROM comites WHERE obra_id = ' + idobra + ' AND descargado = ' + iduser + ' AND id_comite = ' + idcomite;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
        respuesta = data.rows.item(0).contraloria_asistente;
        } else {
          respuesta = null;
        }
        resolve(respuesta);
      }, (error) => {
        reject(error);
      });
    });
    }

    BorrarComite(idLocal: any, obraid: any, comiteid: any, userid: any) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.BorrarContenidoComite(obraid, comiteid, userid);
      // tslint:disable-next-line:max-line-length
      const sql = 'DELETE FROM comites WHERE id = ?';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [idLocal]).then((data) => {
        resolve('borrado');
      }, (error) => {
        reject(error);
      });
    });
    }

    BorrarComiteActualizacion(obraid: any, comiteid: any, userid: any) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.BorrarContenidoComite(obraid, comiteid, userid);
      // tslint:disable-next-line:max-line-length
      const sql = 'DELETE FROM comites WHERE obra_id = ? AND id_comite = ? AND descargado = ?';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [obraid, comiteid, userid]).then((data) => {
        resolve('borrado');
      }, (error) => {
        reject(error);
      });
    });
    }

    BorrarObraActualizacion(obraid: any, userid: any) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.BorrarContenidoObra(obraid, userid);
      // tslint:disable-next-line:max-line-length
      const sql = 'DELETE FROM comites WHERE obra_id = ? AND descargado = ?';
      // tslint:disable-next-line:max-line-length
      this.db.executeSql(sql, [obraid, userid]).then((data) => {
          // tslint:disable-next-line:max-line-length
        const sql2 = 'DELETE FROM obras WHERE id_obra = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql2, [obraid, userid]).then((data2) => {
          resolve('borrado');
        }, (error) => {
          reject(error);
        });
      }, (error) => {
        reject(error);
      });
    });
    }

    ValidarBorradoIdObra(obraid: any, userid: any) {
      let respuesta;
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT comites_enviados FROM obras WHERE id_obra = ' + obraid + ' AND descargado = ' + userid;
      // tslint:disable-next-line:prefer-const
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.item(0).comites_enviados > 0) {
          respuesta = 0;
        } else {
          respuesta = 1;
        }
        resolve(respuesta);
        }, (error) => {
          reject(error);
      });
      });
    }

    GetObrasDetalles(idObraLocal: any, numObra: any, idObra: any, idUsuario: any) {
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT id, id_obra, num_obra, nombre_obra, mmunicipio, localidad, status_obra, monto_aprobado, fondo, ejecutora, normativa, inicio_obra, termino_obra, lon, lat FROM obras WHERE id = ' + idObraLocal + ' AND id_obra = ' + idObra + ' AND descargado = ' + idUsuario;
    // tslint:disable-next-line:prefer-const
    let detalleObra = [];
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            detalleObra.push({
              idLocal: data.rows.item(i).id,
              idObra: data.rows.item(i).id_obra,
              numObra: data.rows.item(i).num_obra,
              nombreObra: data.rows.item(i).nombre_obra,
              mmunicipio: data.rows.item(i).mmunicipio,
              localidad: data.rows.item(i).localidad,
              statusObra: data.rows.item(i).status_obra,
              montoAprobado: data.rows.item(i).monto_aprobado,
              fondo: data.rows.item(i).fondo,
              ejecutora: data.rows.item(i).ejecutora,
              normativa: data.rows.item(i).normativa,
              inicioObra: data.rows.item(i).inicio_obra,
              terminoObra: data.rows.item(i).termino_obra,
              lon: data.rows.item(i).lon,
              lat: data.rows.item(i).lat
            });
          }
        }
        resolve(detalleObra);
      }, (error) => {
        reject(error);
      });
    });
    }

    GetComitesProximos(idusuario: any) {
      const date = new Date(this.fechaHoy);
      const fechaHoyFormat = this.datepipe.transform(date, 'yyyyMMdd');
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT substr(agenda_fecha,7,4)||substr(agenda_fecha,1,2)||substr(agenda_fecha,4,2) AS fecha,id, contraloria_usuario_id, agenda_confirmada, origen, id_comite, num_comite, metodo, obra_id, status, agenda_fecha, agenda_hora_inicio, agenda_hora_fin, usuario_id, id_obra, fondo, norma_cs_aplica, descargado, normativa, metodo_contraloria, contraloria_asistente, habilitado, status_enviado, fecha_envio FROM comites WHERE descargado = ' + idusuario + ' AND status_enviado = 0 ORDER BY agenda_fecha DESC';
      // tslint:disable-next-line:max-line-length
      // const qry = 'SELECT substr(agenda_fecha,7,4)||substr(agenda_fecha,1,2)||substr(agenda_fecha,4,2) > ' + fechaHoyFormat + ' fecha FROM comites WHERE descargado = ' + idusuario + ' AND status_enviado = 0 ORDER BY agenda_fecha DESC';
      this.arrayComitesProximo = [];
      this.arrayComitesvencido = [];
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            let tipoContraloriaDisplay: string;
            for (let i = 0; i < data.rows.length; i++) {
              if (data.rows.item(i).metodo_contraloria) {
              tipoContraloriaDisplay = data.rows.item(i).metodo_contraloria;
              } else {
              tipoContraloriaDisplay = data.rows.item(i).metodo;
              }
              if (data.rows.item(i).fecha > fechaHoyFormat) {
                this.arrayComitesProximo.push({
                  idLocal: data.rows.item(i).id,
                  id: data.rows.item(i).id_comite,
                  usuarioOntraloria: data.rows.item(i).contraloria_usuario_id,
                  usuarioId: data.rows.item(i).descargado,
                  agendaConfirmada: data.rows.item(i).agenda_confirmada,
                  origen: data.rows.item(i).origen,
                  metodo: data.rows.item(i).metodo,
                  obraid: data.rows.item(i).obra_id,
                  numComite: data.rows.item(i).num_comite,
                  agendaFecha: data.rows.item(i).agenda_fecha,
                  fondo: data.rows.item(i).fondo,
                  normaCSAplica: data.rows.item(i).norma_cs_aplica,
                  normativa: data.rows.item(i).normativa,
                  metodoContraloria: data.rows.item(i).metodo_contraloria,
                  // tslint:disable-next-line:object-literal-shorthand
                  tipoContraloriaDisplay: tipoContraloriaDisplay,
                  contraloriaAsistente: data.rows.item(i).contraloria_asistente,
                  habilitado: data.rows.item(i).habilitado,
                  statusEnviado: data.rows.item(i).status_enviado,
                  fechaEnvio: data.rows.item(i).fecha_envio
                });
              }
              if (data.rows.item(i).fecha < fechaHoyFormat) {
                this.arrayComitesvencido.push({
                  idLocal: data.rows.item(i).id,
                  id: data.rows.item(i).id_comite,
                  usuarioOntraloria: data.rows.item(i).contraloria_usuario_id,
                  usuarioId: data.rows.item(i).descargado,
                  agendaConfirmada: data.rows.item(i).agenda_confirmada,
                  origen: data.rows.item(i).origen,
                  metodo: data.rows.item(i).metodo,
                  obraid: data.rows.item(i).obra_id,
                  numComite: data.rows.item(i).num_comite,
                  agendaFecha: data.rows.item(i).agenda_fecha,
                  fondo: data.rows.item(i).fondo,
                  normaCSAplica: data.rows.item(i).norma_cs_aplica,
                  normativa: data.rows.item(i).normativa,
                  metodoContraloria: data.rows.item(i).metodo_contraloria,
                  // tslint:disable-next-line:object-literal-shorthand
                  tipoContraloriaDisplay: tipoContraloriaDisplay,
                  contraloriaAsistente: data.rows.item(i).contraloria_asistente,
                  habilitado: data.rows.item(i).habilitado,
                  statusEnviado: data.rows.item(i).status_enviado,
                  fechaEnvio: data.rows.item(i).fecha_envio
                });
              }
            }
          }
          resolve(this.arrayComitesProximo);
        }, (error) => {
          reject(error);
        });
      });
    }

    GetComitesHoy(idusuario: any, rol: any) {
      const date = new Date(this.fechaHoy);
      const fechaHoyFormat = this.datepipe.transform(date, 'MM/dd/yyyy');
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, contraloria_usuario_id, agenda_confirmada, origen, id_comite, num_comite, metodo, obra_id, status, agenda_fecha, agenda_hora_inicio, agenda_hora_fin, usuario_id, id_obra, fondo, norma_cs_aplica, descargado, normativa, metodo_contraloria, contraloria_asistente, habilitado, status_enviado, fecha_envio FROM comites WHERE descargado = ' + idusuario + ' AND agenda_fecha = "' + fechaHoyFormat + '"  AND status_enviado = 0 ORDER BY agenda_fecha DESC';
      this.arrayComitesHoy = [];
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            let tipoContraloriaDisplay: string;
            for (let i = 0; i < data.rows.length; i++) {
              if (data.rows.item(i).metodo_contraloria) {
              tipoContraloriaDisplay = data.rows.item(i).metodo_contraloria;
              } else {
              tipoContraloriaDisplay = data.rows.item(i).metodo;
              }

              // tslint:disable-next-line:max-line-length
              this.GetAgendaConfirmada(data.rows.item(i).obra_id, data.rows.item(i).id_comite, idusuario).then(async (dat) => {
                this.GetObraInfo(data.rows.item(i).obra_id, idusuario).then(async (dat2) => {

                  const agendaConfirmada = dat;
                  this.metodoIntegracionActa = null;
                  this.metodoCapacitacionActa = null;
                  if (dat2[0].tipofondo === 'ESTATAL') {
                  // 1 -> ejecutora, 2 -> cs
                  if (rol === 1 || rol === '1') {
                    this.metodoIntegracionActa = data.rows.item(i).metodo;
                    if (agendaConfirmada === 0) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo;
                    }
                  } else {
                    if (agendaConfirmada === 1) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                    } else {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo;
                    }
                  }
                } else {
                  // 1 -> ejecutora, 2 -> cs
                  if (rol === 1 || rol === '1') {
                    this.metodoIntegracionActa = 'fisico';
                    if (agendaConfirmada === 0) {
                      this.metodoCapacitacionActa = 'fisico';
                    }
                  } else {
                    if (agendaConfirmada === 1) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                    } else {
                      this.metodoCapacitacionActa = 'fisico';
                    }
                  }
                }
                  this.arrayComitesHoy.push({
                  idLocal: data.rows.item(i).id,
                  id: data.rows.item(i).id_comite,
                  usuarioOntraloria: data.rows.item(i).contraloria_usuario_id,
                  usuarioId: data.rows.item(i).descargado,
                  agendaConfirmada: data.rows.item(i).agenda_confirmada,
                  origen: data.rows.item(i).origen,
                  metodo: data.rows.item(i).metodo,
                  obraid: data.rows.item(i).obra_id,
                  numComite: data.rows.item(i).num_comite,
                  agendaFecha: data.rows.item(i).agenda_fecha,
                  fondo: data.rows.item(i).fondo,
                  normaCSAplica: data.rows.item(i).norma_cs_aplica,
                  normativa: data.rows.item(i).normativa,
                  metodoContraloria: data.rows.item(i).metodo_contraloria,
                  // tslint:disable-next-line:object-literal-shorthand
                  tipoContraloriaDisplay: tipoContraloriaDisplay,
                  contraloriaAsistente: data.rows.item(i).contraloria_asistente,
                  habilitado: data.rows.item(i).habilitado,
                  statusEnviado: data.rows.item(i).status_enviado,
                  fechaEnvio: data.rows.item(i).fecha_envio,
                  metodoCapacitacionActa: this.metodoCapacitacionActa,
                  metodoIntegracionActa: this.metodoIntegracionActa
                });
              });
            });

            }
          }
          resolve(this.arrayComitesHoy);
        }, (error) => {
          reject(error);
        });
      });
    }

    GetComitesEnviados(idusuario: any, rol: any) {
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, contraloria_usuario_id, agenda_confirmada, origen, id_comite, num_comite, metodo, obra_id, status, agenda_fecha, agenda_hora_inicio, agenda_hora_fin, usuario_id, id_obra, fondo, norma_cs_aplica, descargado, normativa, metodo_contraloria, contraloria_asistente, habilitado, status_enviado, fecha_envio FROM comites WHERE descargado = ' + idusuario + ' AND status_enviado = 1 ORDER BY agenda_fecha DESC';
      this.arrayComitesEnviado = [];
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            let tipoContraloriaDisplay: string;
            for (let i = 0; i < data.rows.length; i++) {
              if (data.rows.item(i).metodo_contraloria) {
              tipoContraloriaDisplay = data.rows.item(i).metodo_contraloria;
              } else {
              tipoContraloriaDisplay = data.rows.item(i).metodo;
              }

              // tslint:disable-next-line:max-line-length
              this.GetAgendaConfirmada(data.rows.item(i).obra_id, data.rows.item(i).id_comite, idusuario).then(async (dat) => {
                this.GetObraInfo(data.rows.item(i).obra_id, idusuario).then(async (dat2) => {

                  const agendaConfirmada = dat;
                  this.metodoIntegracionActa = null;
                  this.metodoCapacitacionActa = null;
                  if (dat2[0].tipofondo === 'ESTATAL') {
                  // 1 -> ejecutora, 2 -> cs
                  if (rol === 1 || rol === '1') {
                    this.metodoIntegracionActa = data.rows.item(i).metodo;
                    if (agendaConfirmada === 0) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo;
                    }
                  } else {
                    if (agendaConfirmada === 1) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                    } else {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo;
                    }
                  }
                } else {
                  // 1 -> ejecutora, 2 -> cs
                  if (rol === 1 || rol === '1') {
                    this.metodoIntegracionActa = 'fisico';
                    if (agendaConfirmada === 0) {
                      this.metodoCapacitacionActa = 'fisico';
                    }
                  } else {
                    if (agendaConfirmada === 1) {
                      this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                    } else {
                      this.metodoCapacitacionActa = 'fisico';
                    }
                  }
                }
                  this.arrayComitesEnviado.push({
                  idLocal: data.rows.item(i).id,
                  id: data.rows.item(i).id_comite,
                  usuarioOntraloria: data.rows.item(i).contraloria_usuario_id,
                  usuarioId: data.rows.item(i).descargado,
                  agendaConfirmada: data.rows.item(i).agenda_confirmada,
                  origen: data.rows.item(i).origen,
                  metodo: data.rows.item(i).metodo,
                  obraid: data.rows.item(i).obra_id,
                  numComite: data.rows.item(i).num_comite,
                  agendaFecha: data.rows.item(i).agenda_fecha,
                  fondo: data.rows.item(i).fondo,
                  normaCSAplica: data.rows.item(i).norma_cs_aplica,
                  normativa: data.rows.item(i).normativa,
                  metodoContraloria: data.rows.item(i).metodo_contraloria,
                  // tslint:disable-next-line:object-literal-shorthand
                  tipoContraloriaDisplay: tipoContraloriaDisplay,
                  contraloriaAsistente: data.rows.item(i).contraloria_asistente,
                  habilitado: data.rows.item(i).habilitado,
                  statusEnviado: data.rows.item(i).status_enviado,
                  fechaEnvio: data.rows.item(i).fecha_envio,
                  metodoCapacitacionActa: this.metodoCapacitacionActa,
                  metodoIntegracionActa: this.metodoIntegracionActa
                });

              });
            });
            }
          }
          resolve(this.arrayComitesEnviado);
        }, (error) => {
          reject(error);
        });
      });
    }

    GetComites(idobra: any, idobralocal: any, idusuario: any, rol: any) {
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT id, contraloria_usuario_id, agenda_confirmada, origen, id_comite, num_comite, metodo, obra_id, status, agenda_fecha, agenda_hora_inicio, agenda_hora_fin, usuario_id, id_obra, fondo, norma_cs_aplica, descargado, normativa, metodo_contraloria, contraloria_asistente, habilitado, status_enviado, fecha_envio FROM comites WHERE obra_id = ' + idobra + ' AND descargado = ' + idusuario;
    this.arrayComitesGrl = [];
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          let tipoContraloriaDisplay: string;
          for (let i = 0; i < data.rows.length; i++) {
            if (data.rows.item(i).metodo_contraloria) {
            tipoContraloriaDisplay = data.rows.item(i).metodo_contraloria;
            } else {
            tipoContraloriaDisplay = data.rows.item(i).metodo;
            }
            // tslint:disable-next-line:max-line-length
            this.GetAgendaConfirmada(data.rows.item(i).obra_id, data.rows.item(i).id_comite, idusuario).then(async (dat) => {
              this.GetObraInfo(data.rows.item(i).obra_id, idusuario).then(async (dat2) => {
                const agendaConfirmada = dat;
                this.metodoIntegracionActa = null;
                this.metodoCapacitacionActa = null;
                if (dat2[0].tipofondo === 'ESTATAL') {
                // 1 -> ejecutora, 2 -> cs
                if (rol === 1 || rol === '1') {
                  this.metodoIntegracionActa = data.rows.item(i).metodo;
                  if (agendaConfirmada === 0) {
                    this.metodoCapacitacionActa = data.rows.item(i).metodo;
                  }
                } else {
                  if (agendaConfirmada === 1) {
                    this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                  } else {
                    this.metodoCapacitacionActa = data.rows.item(i).metodo;
                  }
                }
              } else {
                // 1 -> ejecutora, 2 -> cs
                if (rol === 1 || rol === '1') {
                  this.metodoIntegracionActa = 'fisico';
                  if (agendaConfirmada === 0) {
                    this.metodoCapacitacionActa = 'fisico';
                  }
                } else {
                  if (agendaConfirmada === 1) {
                    this.metodoCapacitacionActa = data.rows.item(i).metodo_contraloria;
                  } else {
                    this.metodoCapacitacionActa = 'fisico';
                  }
                }
              }
                this.arrayComitesGrl.push({
              idLocal: data.rows.item(i).id,
              id: data.rows.item(i).id_comite,
              usuarioOntraloria: data.rows.item(i).contraloria_usuario_id,
              usuarioId: data.rows.item(i).descargado,
              agendaConfirmada: data.rows.item(i).agenda_confirmada,
              origen: data.rows.item(i).origen,
              metodo: data.rows.item(i).metodo,
              obraid: data.rows.item(i).obra_id,
              numComite: data.rows.item(i).num_comite,
              agendaFecha: data.rows.item(i).agenda_fecha,
              fondo: data.rows.item(i).fondo,
              normaCSAplica: data.rows.item(i).norma_cs_aplica,
              normativa: data.rows.item(i).normativa,
              metodoContraloria: data.rows.item(i).metodo_contraloria,
              // tslint:disable-next-line:object-literal-shorthand
              tipoContraloriaDisplay: tipoContraloriaDisplay,
              contraloriaAsistente: data.rows.item(i).contraloria_asistente,
              habilitado: data.rows.item(i).habilitado,
              statusEnviado: data.rows.item(i).status_enviado,
              fechaEnvio: data.rows.item(i).fecha_envio,
              metodoCapacitacionActa: this.metodoCapacitacionActa,
              metodoIntegracionActa: this.metodoIntegracionActa
            });
          });
        });
          }
        }
        resolve(this.arrayComitesGrl);
      },  (error) => {
        reject(error);
      });
    });
    }

    GetObraInfo(idObra: any, idUsuario: any) {
      // tslint:disable-next-line:prefer-const
      let obraInfo = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, id_obra, num_obra, inicio_obra, nombre_obra, tipofondo FROM obras WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra;
      this.arrayObrasGrl = [];
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            obraInfo.push({
              id: data.rows.item(i).id,
              idObra: data.rows.item(i).id_obra,
              nombreObra: data.rows.item(i).nombre_obra,
              numObra: data.rows.item(i).num_obra,
              inicioObra: data.rows.item(i).inicio_obra,
              tipofondo: data.rows.item(i).tipofondo
            });
          }
        }
        resolve(obraInfo);
        }, (error) => {
          reject(error);
      });
    });
    }

    GetObras(usuario: any) {
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, id_obra, num_obra, inicio_obra, nombre_obra, tipofondo FROM obras WHERE descargado = ' + usuario;
      this.arrayObrasGrl = [];
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayObrasGrl.push({
              id: data.rows.item(i).id,
              idObra: data.rows.item(i).id_obra,
              nombreObra: data.rows.item(i).nombre_obra,
              numObra: data.rows.item(i).num_obra,
              inicioObra: data.rows.item(i).inicio_obra,
              tipofondo: data.rows.item(i).tipofondo
            });
          }
        }
        resolve(this.arrayObrasGrl);
        }, (error) => {
          reject(error);
      });
    });
    }

    HabilitarCaptura(id: any, estado: any, idobra: any, idcomite: any, iduser: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE comites SET habilitado = ? WHERE id_comite = ? AND obra_id = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [estado, idcomite, idobra, iduser]).then((data) => {
          resolve(data);
          if (estado === 0) {
            this.BorrarContenidoComite(idobra, idcomite, iduser);
          }
        }, (error) => {
          reject(error);
      });
      });
    }

    BorrarContenidoObra(idobra: any, iduser: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM integracion_comites WHERE id_obra = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [idobra, iduser]).then((data) => {
          // tslint:disable-next-line:max-line-length
          const sql2 = 'DELETE FROM capacitacion_comites WHERE id_obra = ? AND descargado = ?';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql2, [idobra, iduser]).then((data2) => {
            // tslint:disable-next-line:max-line-length
            const sql3 = 'DELETE FROM evidencias WHERE id_obra = ? AND descargado = ?';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql3, [idobra, iduser]).then((data3) => {
              // tslint:disable-next-line:max-line-length
              const sql4 = 'DELETE FROM integrante_integracion WHERE id_obra = ? AND descargado = ?';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql4, [idobra, iduser]).then((data4) => {
                // tslint:disable-next-line:max-line-length
                const sql5 = 'DELETE FROM testigo_integracion WHERE id_obra = ? AND descargado = ?';
                // tslint:disable-next-line:max-line-length
                this.db.executeSql(sql5, [idobra, iduser]).then((data5) => {
                  // tslint:disable-next-line:max-line-length
                  const sql6 = 'DELETE FROM integrante_capacitacion WHERE id_obra = ? AND descargado = ?';
                  // tslint:disable-next-line:max-line-length
                  this.db.executeSql(sql6, [idobra, iduser]).then((data6) => {
                    // tslint:disable-next-line:max-line-length
                    const sql7 = 'DELETE FROM participante_capacitacion WHERE id_obra = ? AND descargado = ?';
                    // tslint:disable-next-line:max-line-length
                    this.db.executeSql(sql7, [idobra, iduser]).then((data7) => {
                      resolve(data7);
                    }, (error) => {
                      reject(error);
                    });
                  }, (error) => {
                    reject(error);
                  });
                }, (error) => {
                  reject(error);
                });
              }, (error) => {
              reject(error);
            });
            }, (error) => {
              reject(error);
            });
          }, (error) => {
            reject(error);
          });
          }, (error) => {
            reject(error);
          });
      });
    }

    BorrarContenidoComite(idobra: any, idcomite: any, iduser) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'DELETE FROM integracion_comites WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [idobra, idcomite, iduser]).then((data) => {
          // tslint:disable-next-line:max-line-length
          const sql2 = 'DELETE FROM capacitacion_comites WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql2, [idobra, idcomite, iduser]).then((data2) => {
            // tslint:disable-next-line:max-line-length
            const sql3 = 'DELETE FROM evidencias WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql3, [idobra, idcomite, iduser]).then((data3) => {
              // tslint:disable-next-line:max-line-length
              const sql4 = 'DELETE FROM integrante_integracion WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql4, [idobra, idcomite, iduser]).then((data4) => {
                // tslint:disable-next-line:max-line-length
                const sql5 = 'DELETE FROM testigo_integracion WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
                // tslint:disable-next-line:max-line-length
                this.db.executeSql(sql5, [idobra, idcomite, iduser]).then((data5) => {
                  // tslint:disable-next-line:max-line-length
                  const sql6 = 'DELETE FROM integrante_capacitacion WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
                  // tslint:disable-next-line:max-line-length
                  this.db.executeSql(sql6, [idobra, idcomite, iduser]).then((data6) => {
                    // tslint:disable-next-line:max-line-length
                    const sql7 = 'DELETE FROM participante_capacitacion WHERE id_obra = ? AND id_comite = ? AND descargado = ?';
                    // tslint:disable-next-line:max-line-length
                    this.db.executeSql(sql7, [idobra, idcomite, iduser]).then((data7) => {
                      resolve(data7);
                    }, (error) => {
                      reject(error);
                    });
                  }, (error) => {
                    reject(error);
                  });
                }, (error) => {
                  reject(error);
                });
              }, (error) => {
              reject(error);
            });
            }, (error) => {
              reject(error);
            });
          }, (error) => {
            reject(error);
          });
          }, (error) => {
            reject(error);
          });
      });
    }

    ActualizarComiteActualizacion(idObra: any, idComite: any, idUsuario: any, comiteInformacion: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE comites SET contraloria_usuario_id = ?, agenda_confirmada = ?, metodo = ?, status = ?, agenda_fecha = ?, agenda_hora_inicio = ?, agenda_hora_fin = ?, usuario_id = ?, fondo = ?, contraloria_asistente = ?, metodo_contraloria = ?, token = ?, normativa = ?, norma_cs_aplica = ?, cargo_ejecutora = ?, cargo_normativa = ?, cargo_dependencia_normativa = ? WHERE id_comite = ? AND obra_id = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [comiteInformacion.contraloria_usuario_id, comiteInformacion.agenda_confirmada, comiteInformacion.metodo, comiteInformacion.status, comiteInformacion.agenda_fecha, comiteInformacion.agenda_hora_inicio, comiteInformacion.agenda_hora_fin, comiteInformacion.usuario_id, comiteInformacion.fondo, comiteInformacion.contraloria_asistente, comiteInformacion.metodo_contraloria, comiteInformacion.token, comiteInformacion.normativa, comiteInformacion.fondo, comiteInformacion.cargo_ejecutora, comiteInformacion.cargo_normativa, comiteInformacion.cargo_dependencia_normativa, idComite, idObra, idUsuario]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    ActualizarObraActualizacion(idObra: any, idUsuario: any, obraInformacion: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE obras SET nombre_obra = ?, mmunicipio = ?, localidad = ?, status_obra = ?, monto_aprobado = ?, fondo = ?, ejecutora = ?, normativa = ?, inicio_obra = ?, termino_obra = ?, lat = ?, lon = ?, tipofondo = ?, token = ? WHERE id_obra = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [obraInformacion.nombre_obra, obraInformacion.mmunicipio, obraInformacion.localidad, obraInformacion.status_obra, obraInformacion.monto_aprobado, obraInformacion.fondo, obraInformacion.ejecutora, obraInformacion.normativa, obraInformacion.inicio_obra, obraInformacion.termino_obra, obraInformacion.lat, obraInformacion.lon, obraInformacion.tipofondo, obraInformacion.token, idObra, idUsuario]).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
      });
      });
    }

    GetComiteHabilitado(idcomite: any, idobra: any, iduser: any) {
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT habilitado FROM comites WHERE id_comite = ' + idcomite + ' AND obra_id = ' + idobra + ' AND descargado = ' + iduser;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        resolve(data.rows.item(0).habilitado);
        }, (error) => {
          reject(error);
      });
    });
    }

    FindObra(usuario: any, idObra: any) {
      let respuesta: any;
      const qry = 'SELECT id FROM obras WHERE id_obra = ' + idObra + ' AND descargado = ' + usuario;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          respuesta = 'existe';
        } else {
          respuesta = 'nuevo';
        }
        resolve(respuesta);
        }, (error) => {
          reject(error);
      });
    });
    }

    FindComite(usuario: any, idObra: any, idComite: any) {
      let respuesta: any;
      const qry = 'SELECT id FROM comites WHERE obra_id = ' + idObra + ' AND descargado = ' + usuario + ' AND id_comite = ' + idComite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          respuesta = 'existe';
        } else {
          respuesta = 'nuevo';
        }
        resolve(respuesta);
        }, (error) => {
          reject(error);
      });
    });
    }

    GetAsistenteIntegracionDetalle(idobra: any, idcomite: any, idusuario: any, idPartiiapnte: any) {
    // tslint:disable-next-line:prefer-const
      let arrayParticipanteDetalles = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, domicilio, telefono, cargo, firma, genero, edad, curp, correo FROM integrante_integracion WHERE id = ' + idPartiiapnte + ' AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            arrayParticipanteDetalles.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              firma: data.rows.item(i).firma,
              domicilio: data.rows.item(i).domicilio,
              telefono: data.rows.item(i).telefono,
              cargo: data.rows.item(i).cargo,
              genero: data.rows.item(i).genero,
              edad: data.rows.item(i).edad,
              curp: data.rows.item(i).curp,
              correo: data.rows.item(i).correo
            });
          }
        }
        resolve(arrayParticipanteDetalles);
      }, (error) => {
        reject(error);
      });
      });
    }

    GetTestigosIntegracionDetalle(idobra: any, idcomite: any, idusuario: any, idPartiiapnte: any) {
      // tslint:disable-next-line:prefer-const
      let arrayTestigoDetalles = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, firma, numero_testigo, genero, edad, curp, correo FROM testigo_integracion WHERE id = ' + idPartiiapnte + ' AND descargado = ' + idusuario + ' AND id_obra = ' + idobra + ' AND id_comite = ' + idcomite ;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            arrayTestigoDetalles.push({
              id: data.rows.item(i).id,
              nombre: data.rows.item(i).nombre,
              firma: data.rows.item(i).firma,
              numeroTestigo: data.rows.item(i).numero_testigo,
              genero: data.rows.item(i).genero,
              edad: data.rows.item(i).edad,
              curp: data.rows.item(i).curp,
              correo: data.rows.item(i).correo
            });
          }
        }
        resolve(arrayTestigoDetalles);
      }, (error) => {
        reject(error);
      });
      });
    }

    GuardarIntegracionComiteChange(nombreOrganoEstatal, cargoOrganoEstatal, obraid, idcomite, userid) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise ((resolve, reject) => {
          // tslint:disable-next-line:max-line-length
          const sql = 'SELECT id FROM integracion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql, []).then((data) => {
            if (data.rows.length > 0) {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'UPDATE integracion_comites SET nombre_organo_estatal = "' + nombreOrganoEstatal + '", cargo_organo_estatal = "' + cargoOrganoEstatal + '" WHERE id = ' + data.rows.item(0).id + '';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, []).then((data2) => {
                  resolve(data2);
                }, (error) => {
                  reject(error);
              });
            } else {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'INSERT INTO integracion_comites (id_obra, id_comite, nombre_organo_estatal, cargo_organo_estatal, descargado) VALUES (?, ?, ?, ?, ?)';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, [obraid, idcomite, nombreOrganoEstatal, cargoOrganoEstatal, userid]).then((data2) => {
                  resolve(data2);
              }, (error) => {
                reject(error);
              });
            }
          }, (error) => {
            reject(error);
          });
          });
    }

      // tslint:disable-next-line:max-line-length
    GuardarIntegracionComiteFirmas(obraid, idcomite, userid, nombreEjecutora, firmaEjecutora,  nombreNormativa, firmaNormativa, firmaOrganoEstatal) {
      if (firmaOrganoEstatal !== null) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise ((resolve, reject) => {
          // tslint:disable-next-line:max-line-length
          const sql = 'SELECT id FROM integracion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql, []).then((data) => {
            if (data.rows.length > 0) {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'UPDATE integracion_comites SET nombre_ejecutora = "' + nombreEjecutora + '", firma_organo_estatal = "' + firmaOrganoEstatal + '", nombre_normativa = "' + nombreNormativa + '" WHERE id = ' + data.rows.item(0).id + '';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, []).then((data2) => {
                  resolve(data2);
                }, (error) => {
                  reject(error);
              });
            } else {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'INSERT INTO integracion_comites (id_obra, id_comite, nombre_ejecutora, firma_organo_estatal, nombre_normativa, descargado) VALUES (?, ?, ?, ?, ?, ?)';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, [obraid, idcomite, nombreEjecutora, firmaOrganoEstatal, nombreNormativa, userid]).then((data2) => {
                  resolve(data2);
              }, (error) => {
                reject(error);
              });
            }
          }, (error) => {
            reject(error);
          });
          });
      }
      if (firmaEjecutora !== null) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise ((resolve, reject) => {
          // tslint:disable-next-line:max-line-length
          const sql = 'SELECT id FROM integracion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql, []).then((data) => {
            if (data.rows.length > 0) {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'UPDATE integracion_comites SET nombre_ejecutora = "' + nombreEjecutora + '", firma_ejecutora = "' + firmaEjecutora + '", nombre_normativa = "' + nombreNormativa + '" WHERE id = ' + data.rows.item(0).id + '';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, []).then((data2) => {
                  resolve(data2);
                }, (error) => {
                  reject(error);
              });
            } else {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'INSERT INTO integracion_comites (id_obra, id_comite, nombre_ejecutora, firma_ejecutora, nombre_normativa, descargado) VALUES (?, ?, ?, ?, ?, ?)';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, [obraid, idcomite, nombreEjecutora, firmaEjecutora, nombreNormativa, userid]).then((data2) => {
                  resolve(data2);
              }, (error) => {
                reject(error);
              });
            }
          }, (error) => {
            reject(error);
          });
          });
      }
      if (firmaNormativa !== null) {
        // tslint:disable-next-line:no-shadowed-variable
        return new Promise ((resolve, reject) => {
          // tslint:disable-next-line:max-line-length
          const sql = 'SELECT id FROM integracion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql, []).then((data) => {
            if (data.rows.length > 0) {
              // tslint:disable-next-line:max-line-length
              const sql2 = 'UPDATE integracion_comites SET nombre_ejecutora = "' + nombreEjecutora + '", nombre_normativa = "' + nombreNormativa + '", firma_normativa = "' + firmaNormativa + '" WHERE id = ' + data.rows.item(0).id + '';
              // tslint:disable-next-line:max-line-length
              this.db.executeSql(sql2, []).then((data2) => {
                  resolve(data2);
                }, (error) => {
                  reject(error);
              });
            } else {
            // tslint:disable-next-line:max-line-length
            const sql2 = 'INSERT INTO integracion_comites (id_obra, id_comite, nombre_ejecutora, nombre_normativa, firma_normativa, descargado) VALUES (?, ?, ?, ?, ?, ?)';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql2, [obraid, idcomite, nombreEjecutora, nombreNormativa, firmaNormativa, userid]).then((data2) => {
              resolve(data2);
            }, (error) => {
              reject(error);
            });
            }
          }, (error) => {
            reject(error);
          });
          });
      }
    }

    // tslint:disable-next-line:max-line-length
    GuardarCapacitacionComite(constituyo: any, observaciones: any, pregunta1: any, pregunta2: any, pregunta3: any, pregunta4: any, pregunta5: any, pregunta6: any, firmaAsignado: any, obraid: any, idcomite: any, userid: any, firma: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'SELECT id FROM capacitacion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, []).then((data) => {
          if (data.rows.length > 0) {
            // tslint:disable-next-line:max-line-length
            const sql2 = 'UPDATE capacitacion_comites SET constituyo = "' + constituyo + '", observaciones = "' + observaciones + '", pregunta1 = "' + pregunta1 + '", pregunta2 = "' + pregunta2 + '", pregunta3 = "' + pregunta3 + '", pregunta4 = "' + pregunta4 + '", pregunta5 = "' + pregunta5 + '", pregunta6 = "' + pregunta6 + '", firma = "' + firma + '" WHERE id = ' + data.rows.item(0).id + '';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql2, []).then((data2) => {
                resolve(data2);
              }, (error) => {
                reject(error);
            });
          } else {
            // tslint:disable-next-line:max-line-length
            const sql2 = 'INSERT INTO capacitacion_comites (constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, firma, id_obra, id_comite, descargado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql2, [constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, firma, obraid, idcomite, userid]).then((data2) => {
                resolve(data2);
            }, (error) => {
              reject(error);
            });
          }
        }, (error) => {
          reject(error);
        });
        });
    }

    GuardarIntegracionComite(obraid, idcomite, userid, normativaNombre, firmaNormativa, nombreEjecutora, firmaEjecutora) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'SELECT id FROM integracion_comites WHERE id_comite = ' + idcomite + ' AND id_obra = ' + obraid + ' AND descargado = ' + userid + '';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, []).then((data) => {
          if (data.rows.length > 0) {
            // tslint:disable-next-line:max-line-length
            const sql2 = 'UPDATE integracion_comites SET nombre_ejecutora = "' + nombreEjecutora + '", firma_ejecutora = "' + firmaEjecutora + '", nombre_normativa = "' + normativaNombre + '", firma_normativa = "' + firmaNormativa + '" WHERE id = ' + data.rows.item(0).id + '';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql2, []).then((data2) => {
                resolve(data2);
              }, (error) => {
                reject(error);
            });
          } else {
            // tslint:disable-next-line:max-line-length
            const sql2 = 'INSERT INTO integracion_comites (id_obra, id_comite, nombre_ejecutora, firma_ejecutora, nombre_normativa, firma_normativa, descargado) VALUES (?, ?, ?, ?, ?, ?, ?)';
            // tslint:disable-next-line:max-line-length
            this.db.executeSql(sql2, [obraid, idcomite, nombreEjecutora, firmaEjecutora, normativaNombre, firmaNormativa, userid]).then((data2) => {
                resolve(data2);
            }, (error) => {
              reject(error);
            });
          }
        }, (error) => {
          reject(error);
        });
        });
    }

    GetAppInfo(idUser: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, id_obra, token FROM obras WHERE descargado = ' + idUser ;
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            this.arrayObrasApp[i] = {id: data.rows.item(i).id, idObra: data.rows.item(i).id_obra, token: data.rows.item(i).token };
          }
        }
        }, (error) => {
          reject(error);
        });
        // tslint:disable-next-line:max-line-length
      const qry2 = 'SELECT id, obra_id, id_comite, token, agenda_fecha, agenda_hora_inicio, status_enviado FROM comites WHERE descargado = ' + idUser + ' AND habilitado = 0';
      this.db.executeSql(qry2, []).then((data2) => {
          if (data2.rows.length > 0) {
            for (let j = 0; j < data2.rows.length; j++) {
              // tslint:disable-next-line:max-line-length
              this.arrayComitesApp[j] = {id: data2.rows.item(j).id, idObra: data2.rows.item(j).obra_id, idComite: data2.rows.item(j).id_comite, token: data2.rows.item(j).token, agendaFecha: data2.rows.item(j).agenda_fecha, agendaHoraInicio: data2.rows.item(j).agenda_hora_inicio, statusEnvio: data2.rows.item(j).status_enviado};
            }
          }
        }, (error) => {
          reject(error);
        });
        // tslint:disable-next-line:max-line-length
      const qry4 = 'SELECT id, obra_id, id_comite, token, agenda_fecha, agenda_hora_inicio, status_enviado FROM comites WHERE descargado = ' + idUser + ' AND habilitado = 1';
      this.db.executeSql(qry4, []).then((data4) => {
          if (data4.rows.length > 0) {
            for (let l = 0; l < data4.rows.length; l++) {
              // tslint:disable-next-line:max-line-length
              this.arrayComitesHabilitadosApp[l] = {id: data4.rows.item(l).id, idObra: data4.rows.item(l).obra_id, idComite: data4.rows.item(l).id_comite, token: data4.rows.item(l).token, agendaFecha: data4.rows.item(l).agenda_fecha, agendaHoraInicio: data4.rows.item(l).agenda_hora_inicio, statusEnvio: data4.rows.item(l).status_enviado};
            }
          }
        }, (error) => {
          reject(error);
        });
      resolve('ok');
      });
    }

    validaEvidencia(idLocal: any, idObra: any, idComite: any, idUsuario: any, accion: any, modulo: any) {
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "' + accion + '" AND modulo = "' + modulo + '"';
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qry, []).then((data) => {
          if (data.rows.length > 0) {
            this.evidenciaCompleto = 0;
          } else {
            this.evidenciaCompleto = 1;
          }
          resolve(this.evidenciaCompleto);
        }, (error) => {
        reject(error);
      });
      });
    }

    validarIntegracionDigital(idLocal: any, idObra: any, idComite: any, idUsuario: any) {
    let presidente = 0; let tesorero = 0; let secretario = 0;
    let testigo = 0; let completo = 0;
    // tslint:disable-next-line:max-line-length
    const qryIntegracionFirmas = 'SELECT firma_ejecutora, firma_normativa FROM integracion_comites WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qryIntegracionFirmas, []).then((dataIntegracionFirmas) => {
        if (dataIntegracionFirmas.rows.length > 0) {
          // tslint:disable-next-line:max-line-length
          if (dataIntegracionFirmas.rows.item(0).firma_ejecutora !== null /* && dataIntegracionFirmas.rows.item(0).firma_normativa !== null */) {
            completo = 0;
          } else {
            completo = 1;
          }
        } else {
          completo = 1;
        }
        // tslint:disable-next-line:max-line-length
        const qryTestigo = 'SELECT id FROM testigo_integracion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND descargado = ' + idUsuario;
        this.db.executeSql(qryTestigo, []).then((dataTestigo) => {
          if (dataTestigo.rows.length === 2) {
            testigo = 2;
            completo = completo + 0;
          } else {
            completo = completo + 1;
          }
          // tslint:disable-next-line:max-line-length
          const qry = 'SELECT id, cargo FROM integrante_integracion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND descargado = ' + idUsuario;
          this.db.executeSql(qry, []).then((data) => {
              if (data.rows.length > 0) {
                // tslint:disable-next-line:prefer-for-of
                for (let l = 0; l < data.rows.length; l++) {
                  if (data.rows.item(l).cargo === 'Presidente') {
                    presidente = presidente + 1;
                  }
                  if (data.rows.item(l).cargo === 'Secretario') {
                    secretario = secretario + 1;
                  }
                  if (data.rows.item(l).cargo === 'Tesorero' || data.rows.item(l).cargo === 'vocal') {
                    tesorero = tesorero + 1;
                  }
                }
                if (presidente > 0 && secretario > 0 && tesorero > 0) {
                  completo = completo + 0;
                } else {
                  completo = completo + 1;
                }
              } else {
                completo = completo + 1;
              }
              this.integracionDigitalCompleto = completo;
              resolve(this.integracionDigitalCompleto);
            });
        });
      }, (error) => {
      reject(error);
    });
    });
    }

    validarCapacitacionDigital(idLocal: any, idObra: any, idComite: any, idUsuario: any) {
    let presidente = 0; let tesorero = 0; let secretario = 0; let participante = 0;
    let completo = 0;
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT id, cargo FROM integrante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
          // tslint:disable-next-line:prefer-for-of
          for (let l = 0; l < data.rows.length; l++) {
            if (data.rows.item(l).cargo === 'Presidente') {
              presidente = presidente + 1;
            }
            if (data.rows.item(l).cargo === 'Secretario') {
              secretario = secretario + 1;
            }
            if (data.rows.item(l).cargo === 'Tesorero' || data.rows.item(l).cargo === 'vocal') {
              tesorero = tesorero + 1;
            }
          }
          if (presidente > 0 && secretario > 0 && tesorero > 0) {
            completo = 0;
          } else {
            completo = 1;
          }
        } else {
          completo = 1;
        }
          // tslint:disable-next-line:max-line-length
        const qryParticipante = 'SELECT id FROM participante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
        this.db.executeSql(qryParticipante, []).then((dataParticipante) => {
            if (dataParticipante.rows.length > 0) {
              participante = dataParticipante.rows.length;
              completo = completo + 0;
            } else {
              completo = completo + 1;
            }
          });
          // tslint:disable-next-line:max-line-length
        const qryCapacitacion = 'SELECT constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta4, pregunta5, pregunta6, firma FROM capacitacion_comites WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
        this.db.executeSql(qryCapacitacion, []).then((dataCapacitacion) => {
          if (dataCapacitacion.rows.length > 0) {
            // tslint:disable-next-line:max-line-length
            if (dataCapacitacion.rows.item(0).constituyo !== null && dataCapacitacion.rows.item(0).constituyo !== 'null' && dataCapacitacion.rows.item(0).observaciones !== null && dataCapacitacion.rows.item(0).observaciones !== '' && dataCapacitacion.rows.item(0).pregunta1 !== null && dataCapacitacion.rows.item(0).pregunta1 !== 'null' && dataCapacitacion.rows.item(0).pregunta2 !== null && dataCapacitacion.rows.item(0).pregunta2 !== 'null' && dataCapacitacion.rows.item(0).pregunta3 !== null && dataCapacitacion.rows.item(0).pregunta3 !== 'null' && dataCapacitacion.rows.item(0).pregunta4 !== null && dataCapacitacion.rows.item(0).pregunta4 !== 'null' && dataCapacitacion.rows.item(0).pregunta5 !== null && dataCapacitacion.rows.item(0).pregunta5 !== 'null' && dataCapacitacion.rows.item(0).pregunta6 !== null && dataCapacitacion.rows.item(0).pregunta6 !== 'null' && dataCapacitacion.rows.item(0).firma !== null && dataCapacitacion.rows.item(0).firma !== 'null') {
              completo = completo + 0;
            } else {
              completo = completo + 1;
            }
          } else {
            completo = completo + 1;
          }
          this.capacitacionDigitalCompleto = completo;
          resolve(this.capacitacionDigitalCompleto);
        });
      }, (error) => {
      reject(error);
    });
    });
    }

    validarEvidenciaComite(idLocal: any, idObra: any, idComite: any, idUsuario: any) {
      this.evidenciaComiteCompleto = 0;
      // tslint:disable-next-line:max-line-length
      const qryEvidencia = 'SELECT id FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "comite"';
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        this.db.executeSql(qryEvidencia, []).then((dataEvidencia) => {
          if (dataEvidencia.rows.length > 0) {
            this.evidenciaComiteCompleto = this.evidenciaComiteCompleto + 0;
          } else {
            this.evidenciaComiteCompleto = this.evidenciaComiteCompleto + 1;
          }
          resolve(this.evidenciaComiteCompleto);
        }, (error) => {
          reject(error);
        });
    });
    }

    validarListaAsistencia(idLocal: any, idObra: any, idComite: any, idUsuario: any) {
      this.listaCompleto = 0;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
          // tslint:disable-next-line:max-line-length
      const qryLista = 'SELECT id FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "asistencia"';
      this.db.executeSql(qryLista, []).then((dataLista) => {
          if (dataLista.rows.length > 0) {
            this.listaCompleto = this.listaCompleto + 0;
          } else {
            this.listaCompleto = this.listaCompleto + 1;
          }
          resolve(this.listaCompleto);
      }, (error) => {
        reject(error);
      });
    });
    }

    getComiteInfo(idObra: any, idComite: any, idUsuario: any) {
      this.comiteInfoArray = [];
      this.listaAsisttenciaTmp = [];
      this.evidenciaComiteTmp = [];
      this.evidenciaIntegracionTmp = [];
      this.evidenciaCapacitacionTmp = [];
      this.fotoIntegracionTmp = [];
      this.fotoCapacitacionTmp = [];
      this.integracionComitesTmp = [];
      this.integranteIntegracionTmp = [];
      this.testigoIntegracionTmp = [];
      this.capacitacionComitesTmp = [];
      this.integranteCapacitacionTmp = [];
      this.participanteCapacitacionTmp = [];
      this.tokenComite = null;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const qryTokenComite = 'SELECT token FROM comites WHERE descargado = ' + idUsuario + ' AND obra_id = ' + idObra + ' AND id_comite = ' + idComite;
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(qryTokenComite, []).then((dataTokenComite) => {
            if (dataTokenComite.rows.length > 0) {
              this.tokenComite = dataTokenComite.rows.item(0).token;
            }
            // tslint:disable-next-line:max-line-length
            const qryLista = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "asistencia"';
            this.db.executeSql(qryLista, []).then((dataLista) => {
          if (dataLista.rows.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < dataLista.rows.length; index++) {
              this.listaAsisttenciaTmp.push(dataLista.rows.item(index));
            }
          }
          // tslint:disable-next-line:max-line-length
          const qryEvidenciaComite = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "comite"';
          this.db.executeSql(qryEvidenciaComite, []).then((dataEvidenciaComite) => {
              if (dataEvidenciaComite.rows.length > 0) {
                if (dataEvidenciaComite.rows.length > 0) {
                  // tslint:disable-next-line:prefer-for-of
                  for (let index = 0; index < dataEvidenciaComite.rows.length; index++) {
                    this.evidenciaComiteTmp.push(dataEvidenciaComite.rows.item(index));
                  }
                }
              }
              // tslint:disable-next-line:max-line-length
              const qryEvidenciaIntegracion = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "integracion"';
              this.db.executeSql(qryEvidenciaIntegracion, []).then((dataEvidenciaIntegracion) => {
                  if (dataEvidenciaIntegracion.rows.length > 0) {
                    if (dataEvidenciaIntegracion.rows.length > 0) {
                      // tslint:disable-next-line:prefer-for-of
                      for (let index = 0; index < dataEvidenciaIntegracion.rows.length; index++) {
                        this.evidenciaIntegracionTmp.push(dataEvidenciaIntegracion.rows.item(index));
                      }
                    }
                  }
                  // tslint:disable-next-line:max-line-length
                  const qryEvidenciaCapacitacion = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "evidencia" AND modulo = "capacitacion"';
                  this.db.executeSql(qryEvidenciaCapacitacion, []).then((dataEvidenciaCapacitacion) => {
                      if (dataEvidenciaCapacitacion.rows.length > 0) {
                        if (dataEvidenciaCapacitacion.rows.length > 0) {
                          // tslint:disable-next-line:prefer-for-of
                          for (let index = 0; index < dataEvidenciaCapacitacion.rows.length; index++) {
                            this.evidenciaCapacitacionTmp.push(dataEvidenciaCapacitacion.rows.item(index));
                          }
                        }
                      }
                      // tslint:disable-next-line:max-line-length
                      const qryFotoIntegracion = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "foto" AND modulo = "integracion"';
                      this.db.executeSql(qryFotoIntegracion, []).then((dataFotoIntegracion) => {
                          if (dataFotoIntegracion.rows.length > 0) {
                            if (dataFotoIntegracion.rows.length > 0) {
                              // tslint:disable-next-line:prefer-for-of
                              for (let index = 0; index < dataFotoIntegracion.rows.length; index++) {
                                this.fotoIntegracionTmp.push(dataFotoIntegracion.rows.item(index));
                              }
                            }
                          }
                          // tslint:disable-next-line:max-line-length
                          const qryFotoCapacitacion = 'SELECT * FROM evidencias WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite + ' AND accion = "foto" AND modulo = "capacitacion"';
                          this.db.executeSql(qryFotoCapacitacion, []).then((dataFotoCapacitacion) => {
                              if (dataFotoCapacitacion.rows.length > 0) {
                                if (dataFotoCapacitacion.rows.length > 0) {
                                  // tslint:disable-next-line:prefer-for-of
                                  for (let index = 0; index < dataFotoCapacitacion.rows.length; index++) {
                                    this.fotoCapacitacionTmp.push(dataFotoCapacitacion.rows.item(index));
                                  }
                                }
                              }
                              // tslint:disable-next-line:max-line-length
                              const qryIntegracionComites = 'SELECT * FROM integracion_comites WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                              this.db.executeSql(qryIntegracionComites, []).then((dataIntegracionComites) => {
                                  if (dataIntegracionComites.rows.length > 0) {
                                    if (dataIntegracionComites.rows.length > 0) {
                                      // tslint:disable-next-line:prefer-for-of
                                      for (let index = 0; index < dataIntegracionComites.rows.length; index++) {
                                        this.integracionComitesTmp.push(dataIntegracionComites.rows.item(index));
                                      }
                                    }
                                  }
                                  // tslint:disable-next-line:max-line-length
                                  const qryIntegranteIntegracion = 'SELECT * FROM integrante_integracion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                                  this.db.executeSql(qryIntegranteIntegracion, []).then((dataIntegranteIntegracion) => {
                                      if (dataIntegranteIntegracion.rows.length > 0) {
                                        if (dataIntegranteIntegracion.rows.length > 0) {
                                          // tslint:disable-next-line:prefer-for-of
                                          for (let index = 0; index < dataIntegranteIntegracion.rows.length; index++) {
                                            this.integranteIntegracionTmp.push(dataIntegranteIntegracion.rows.item(index));
                                          }
                                        }
                                      }
                                      // tslint:disable-next-line:max-line-length
                                      const qryTestigoIntegracion = 'SELECT * FROM testigo_integracion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                                      this.db.executeSql(qryTestigoIntegracion, []).then((dataTestigoIntegracion) => {
                                          if (dataTestigoIntegracion.rows.length > 0) {
                                            if (dataTestigoIntegracion.rows.length > 0) {
                                              // tslint:disable-next-line:prefer-for-of
                                              for (let index = 0; index < dataTestigoIntegracion.rows.length; index++) {
                                                this.testigoIntegracionTmp.push(dataTestigoIntegracion.rows.item(index));
                                              }
                                            }
                                          }
                                          // tslint:disable-next-line:max-line-length
                                          const qryCapacitacionComites = 'SELECT * FROM capacitacion_comites WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                                          this.db.executeSql(qryCapacitacionComites, []).then((dataCapacitacionComites) => {
                                              if (dataCapacitacionComites.rows.length > 0) {
                                                if (dataCapacitacionComites.rows.length > 0) {
                                                  // tslint:disable-next-line:prefer-for-of
                                                  for (let index = 0; index < dataCapacitacionComites.rows.length; index++) {
                                                    this.capacitacionComitesTmp.push(dataCapacitacionComites.rows.item(index));
                                                  }
                                                }
                                              }
                                              // tslint:disable-next-line:max-line-length
                                              const qryIntegranteCapacitacion = 'SELECT * FROM integrante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                                              this.db.executeSql(qryIntegranteCapacitacion, []).then((dataIntegranteCapacitacion) => {
                                                  if (dataIntegranteCapacitacion.rows.length > 0) {
                                                    if (dataIntegranteCapacitacion.rows.length > 0) {
                                                      // tslint:disable-next-line:prefer-for-of
                                                      for (let index = 0; index < dataIntegranteCapacitacion.rows.length; index++) {
                                                        this.integranteCapacitacionTmp.push(dataIntegranteCapacitacion.rows.item(index));
                                                      }
                                                    }
                                                  }
                                                  // tslint:disable-next-line:max-line-length
                                                  const qryParticipanteCapacitacion = 'SELECT * FROM participante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
                                                  // tslint:disable-next-line:max-line-length
                                                  this.db.executeSql(qryParticipanteCapacitacion, []).then((dataParticipanteCapacitacion) => {
                                                      if (dataParticipanteCapacitacion.rows.length > 0) {
                                                        if (dataParticipanteCapacitacion.rows.length > 0) {
                                                          // tslint:disable-next-line:prefer-for-of
                                                          for (let index = 0; index < dataParticipanteCapacitacion.rows.length; index++) {
                                                            // tslint:disable-next-line:max-line-length
                                                            this.participanteCapacitacionTmp.push(dataParticipanteCapacitacion.rows.item(index));
                                                          }
                                                        }
                                                      }
                                                      resolve(this.listaAsisttenciaTmp);
                                                  }, (error) => {
                                                    reject(error);
                                                  });
                                              }, (error) => {
                                                reject(error);
                                              });
                                          }, (error) => {
                                            reject(error);
                                          });
                                      }, (error) => {
                                        reject(error);
                                      });
                                  }, (error) => {
                                    reject(error);
                                  });
                              }, (error) => {
                                reject(error);
                              });
                          }, (error) => {
                            reject(error);
                          });
                      }, (error) => {
                        reject(error);
                      });
                  }, (error) => {
                    reject(error);
                  });
              }, (error) => {
                reject(error);
              });
          }, (error) => {
            reject(error);
          });
      }, (error) => {
        reject(error);
      });
    }, (error) => {
      reject(error);
    });
    });
    }

    setComiteGuardado(idObra: any, idComite: any, idUsuario: any) {
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
        // tslint:disable-next-line:max-line-length
        const sql = 'UPDATE comites SET status_enviado = 1, fecha_envio = ? WHERE obra_id = ? AND id_comite = ? AND descargado = ?';
        // tslint:disable-next-line:max-line-length
        this.db.executeSql(sql, [this.fechaHoy, idObra, idComite, idUsuario]).then((data) => {
          // tslint:disable-next-line:no-shadowed-variable
          const sql = 'UPDATE obras SET comites_enviados = 1 WHERE id_obra = ?';
          // tslint:disable-next-line:max-line-length
          this.db.executeSql(sql, [idObra]).then((data2) => {
            resolve(data2);
          });
        }, (error) => {
          reject(error);
      });
      });
    }


    // ----------------------Actas PDF-------------------------
    GetActaIntegracionGrlInfo(idObra: any, idComite: any, idUsuario: any) {
      let fechaComiteAgenda: any;
      // tslint:disable-next-line:prefer-const
      let infoObraActa = []; let cargoNormativa = ''; let cargoEjecutora = '';
      // tslint:disable-next-line:max-line-length
      const qry2 = 'SELECT agenda_fecha, cargo_ejecutora, cargo_normativa, cargo_dependencia_normativa FROM comites WHERE descargado = ' + idUsuario + ' AND id_comite = ' + idComite;
      this.db.executeSql(qry2, []).then((data3) => {
        fechaComiteAgenda = data3.rows.item(0).agenda_fecha;
        cargoNormativa = data3.rows.item(0).cargo_dependencia_normativa;
        cargoEjecutora = data3.rows.item(0).cargo_ejecutora;
      });
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, id_obra, num_obra, nombre_obra, mmunicipio, localidad, monto_aprobado, fondo, ejecutora, normativa, inicio_obra, termino_obra, tipofondo, programa FROM obras WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
           for (let i = 0; i < data.rows.length; i++) {
            infoObraActa.push({
              id: data.rows.item(i).id,
              idObra: data.rows.item(i).id_obra,
              nombreObra: data.rows.item(i).nombre_obra,
              numObra: data.rows.item(i).num_obra,
              municipio: data.rows.item(i).mmunicipio,
              localidad: data.rows.item(i).localidad,
              montoAprobado: data.rows.item(i).monto_aprobado,
              fondo: data.rows.item(i).fondo,
              ejecutora: data.rows.item(i).ejecutora,
              normativa: data.rows.item(i).normativa,
              inicioObra: data.rows.item(i).inicio_obra,
              terminoObra: data.rows.item(i).termino_obra,
              tipoFondo: data.rows.item(i).tipofondo,
              programa: data.rows.item(i).programa,
              fechaComite: fechaComiteAgenda,
              // tslint:disable-next-line:object-literal-shorthand
              cargoNormativa: cargoNormativa,
              // tslint:disable-next-line:object-literal-shorthand
              cargoEjecutora: cargoEjecutora
            });
          }
        }
        resolve(infoObraActa);
        }, (error) => {
          reject(error);
      });
    });
    }

    GetRepresentantesactaIntegracion(idObra: any, idComite: any, idUsuario: any) {
    // tslint:disable-next-line:prefer-const
    let infoObraActa = [];
    // tslint:disable-next-line:max-line-length
    const qry = 'SELECT nombre_ejecutora, firma_ejecutora, nombre_normativa, firma_normativa, nombre_organo_estatal, cargo_organo_estatal, firma_organo_estatal FROM integracion_comites WHERE descargado = ' + idUsuario + ' AND id_comite = ' + idComite;
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ((resolve, reject) => {
    this.db.executeSql(qry, []).then((data) => {
      if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            infoObraActa.push({
              nombreEjecutora: data.rows.item(i).nombre_ejecutora,
              firmaEjecutora: data.rows.item(i).firma_ejecutora,
              nombreNormativa: data.rows.item(i).nombre_normativa,
              firmaNormativa: data.rows.item(i).firma_normativa,
              nombreOrganoEstatal: data.rows.item(i).nombre_organo_estatal,
              cargoOrganoEstatal: data.rows.item(i).cargo_organo_estatal,
              firmaOrganoEstatal: data.rows.item(i).firma_organo_estatal
            });
          }
      } else {
        infoObraActa.push({
          nombreEjecutora: '',
          firmaEjecutora: null,
          nombreNormativa: '',
          firmaNormativa: null,
          nombreOrganoEstatal: '',
          cargoOrganoEstatal: '',
          firmaOrganoEstatal: null
        });
      }
      resolve(infoObraActa);
      }, (error) => {
        reject(error);
    });
    });
    }

    GetIntegrantesActaIntegracion(idObra: any, idComite: any, idUsuario: any, accion: any) {
      // tslint:disable-next-line:prefer-const
      let infoObraActa = [];
      // tslint:disable-next-line:prefer-const
      let presidenteActaGrl = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT nombre, domicilio, telefono, cargo, firma, genero, edad, curp, correo FROM integrante_integracion WHERE descargado = ' + idUsuario + ' AND id_comite = ' + idComite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              if ( data.rows.item(i).cargo === 'Presidente' && accion === 'presidente') {
                presidenteActaGrl.push({
                  nombre: data.rows.item(i).nombre,
                  domicilio: data.rows.item(i).domicilio,
                  telefono: data.rows.item(i).telefono,
                  cargo: data.rows.item(i).cargo,
                  firma: data.rows.item(i).firma,
                  genero: data.rows.item(i).genero,
                  edad: data.rows.item(i).edad,
                  curp: data.rows.item(i).curp,
                  correo: data.rows.item(i).correo
                });
                resolve(presidenteActaGrl);
              }
              infoObraActa.push({
                nombre: data.rows.item(i).nombre,
                domicilio: data.rows.item(i).domicilio,
                telefono: data.rows.item(i).telefono,
                cargo: data.rows.item(i).cargo,
                firma: data.rows.item(i).firma,
                genero: data.rows.item(i).genero,
                edad: data.rows.item(i).edad,
                curp: data.rows.item(i).curp,
                correo: data.rows.item(i).correo
              });
            }
        } else {
          presidenteActaGrl.push({
            nombre: '',
            domicilio: '',
            telefono: '',
            cargo: '',
            firma: null,
            genero: '',
            edad: '',
            curp: '',
            correo: ''
          });
          infoObraActa.push({
            nombre: '',
            domicilio: '',
            telefono: '',
            cargo: '',
            firma: null,
            genero: '',
            edad: '',
            curp: '',
            correo: ''
          });
        }
        if (accion === 'todos') {
          resolve(infoObraActa);
        }
        }, (error) => {
          reject(error);
      });
      });
    }

    GetActaCapacitacionGrlInfo(idObra: any, idComite: any, idUsuario: any) {
      const infoObraActa = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, constituyo, observaciones, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, firma, id_obra, id_comite, descargado FROM capacitacion_comites WHERE descargado = ' + idUsuario + ' AND id_obra = ' + idObra + ' AND id_comite = ' + idComite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
           for (let i = 0; i < data.rows.length; i++) {
            infoObraActa.push({
              id: data.rows.item(i).id,
              idObra: data.rows.item(i).id_obra,
              idComite: data.rows.item(i).id_comite,
              constituyo: data.rows.item(i).constituyo,
              observaciones: data.rows.item(i).observaciones,
              pregunta1: data.rows.item(i).pregunta1,
              pregunta2: data.rows.item(i).pregunta2,
              pregunta3: data.rows.item(i).pregunta3,
              pregunta4: data.rows.item(i).pregunta4,
              pregunta5: data.rows.item(i).pregunta5,
              pregunta6: data.rows.item(i).pregunta6,
              firma: data.rows.item(i).firma
            });
          }
        }
        resolve(infoObraActa);
        }, (error) => {
          reject(error);
      });
    });
    }

    GetParticipantesActaCapacitacion(idObra: any, idComite: any, idUsuario: any) {
      // tslint:disable-next-line:prefer-const
      let infoObraActa = [];
      // tslint:disable-next-line:prefer-const
      let presidenteActaGrl = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, nombre, dependencia, firma, id_obra, id_comite, descargado, genero, edad, curp, cargo FROM participante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_comite = ' + idComite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              infoObraActa.push({
                id: data.rows.item(i).id,
                nombre: data.rows.item(i).nombre,
                dependencia: data.rows.item(i).dependencia,
                firma: data.rows.item(i).firma,
                genero: data.rows.item(i).genero,
                edad: data.rows.item(i).edad,
                curp: data.rows.item(i).curp,
                cargo: data.rows.item(i).cargo
              });
            }
        } else {
          infoObraActa.push({
            id: '',
            nombre: '',
            localidad: '',
            firma: '',
            genero: '',
            edad: '',
            curp: '',
            correo: ''
          });
        }
        resolve(infoObraActa);
        }, (error) => {
          reject(error);
      });
      });
    }

    GetIntegrantesActaCapacitacion(idObra: any, idComite: any, idUsuario: any) {
      // tslint:disable-next-line:prefer-const
      let infoObraActa = [];
      // tslint:disable-next-line:prefer-const
      let presidenteActaGrl = [];
      // tslint:disable-next-line:max-line-length
      const qry = 'SELECT id, edad, genero, nombre, domicilio, telefono, cargo, material_entregado, firma, id_obra, id_comite, descargado, curp, correo FROM integrante_capacitacion WHERE descargado = ' + idUsuario + ' AND id_comite = ' + idComite;
      // tslint:disable-next-line:no-shadowed-variable
      return new Promise ((resolve, reject) => {
      this.db.executeSql(qry, []).then((data) => {
        if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              infoObraActa.push({
                id: data.rows.item(i).id,
                edad: data.rows.item(i).edad,
                genero: data.rows.item(i).genero,
                nombre: data.rows.item(i).nombre,
                domicilio: data.rows.item(i).domicilio,
                telefono: data.rows.item(i).telefono,
                cargo: data.rows.item(i).cargo,
                materialEntregado: data.rows.item(i).material_entregado,
                firma: data.rows.item(i).firma,
                curp: data.rows.item(i).curp,
                correo: data.rows.item(i).correo
              });
            }
        } else {
          infoObraActa.push({
            id: '',
            edad: '',
            genero: '',
            nombre: '',
            domicilio: null,
            telefono: '',
            cargo: '',
            materialEntregado: '',
            firma: '',
            curp: '',
            correo: ''
          });
        }
        resolve(infoObraActa);
        }, (error) => {
          reject(error);
      });
      });
    }
}
