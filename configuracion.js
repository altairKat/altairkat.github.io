var zoomMaxParcela=20;
var zoomMinParcela=15;



//CAPAS DE KATASTRO 
var capasKatastro = [{
  capa: "RED_TRANS_EJES_RED_VIARIA",
  titulo: "Ejes red viaria",
  id_idioma: "EJES_RED_VIARIA",
  id: "0",
  zoom: 16,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=RED_TRANS_EJES_RED_VIARIA"
},
{
  capa: "HID_FUENTES_POZOS",
  titulo: "Aguas",
  id_idioma: "AGUAS",
  id: "1",
  zoom: 17,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=HID_FUENTES_POZOS"
},
{
  capa: "REL_CURVA_NIVEL",
  titulo: "Curvas de Nivel",
  id_idioma: "CURVAS_DE_NIVEL",
  id: "2",
  zoom: 18,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=REL_CURVA_NIVEL"
},
{
  capa: "CART_DERIV_SOMBRAS",
  titulo: "Sombras",
  id_idioma: "SOMBRAS",
  id: "3",
  zoom: 3,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CART_DERIV_SOMBRAS"
},
{
  capa: "CART_DERIV_PENDIENTES_R",
  titulo: "Pendientes",
  id_idioma: "PENDIENTE",
  id: "4",
  zoom: 4,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CART_DERIV_PENDIENTES_R"
},
{
  capa: "CART_DERIV_ORIENTACIONES_R",
  titulo: "Orientaciones",
  id_idioma: "ORIENTACIONES",
  id: "5",
  zoom: 4,
  img: "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=CART_DERIV_ORIENTACIONES_R"
},
];

var capasVariablesForestales = [{
  capa: "VF_DENSIDAD_MEDIA_2012",
  titulo: "Densidad media(pies/ha)",
  id_idioma: "DENSIDAD_MEDIA",
  id: "0",
  zoom: 16,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=VF_DENSIDAD_MEDIA_2012"
},
{
  capa: "VF_AREA_BASIMETRICA_2012",
  titulo: "Área basimétrica (m2/ha)",
  id_idioma: "AREA_BASIMETRICA",
  id: "1",
  zoom: 17,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=VF_AREA_BASIMETRICA_2012"
},
{
  capa: "VF_VOLUMEN_MEDIO_2012",
  titulo: "Volumen medio (m3/ha)",
  id_idioma: "VOLUMEN_MEDIO",
  id: "2",
  zoom: 18,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=VF_VOLUMEN_MEDIO_2012"
},
{
  capa: "VF_VOLUMEN_MEDIO_SUP_CD40_2012",
  titulo: "Volumen medio >= CD40  (m3/ha)",
  id_idioma: "VOLUMEN_MEDIO_40",
  id: "3",
  zoom: 3,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=VF_VOLUMEN_MEDIO_SUP_CD40_2012"
},
{
  capa: "VF_CRECIMIENTO_ANUAL_2012",
  titulo: "Crecimiento anual (m3/ha-año)",
  id_idioma: "CRECIMIENTO_ANUAL",
  id: "4",
  zoom: 4,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=VF_CRECIMIENTO_ANUAL_2012"
}
];

var capasRiesgoViento = [{
  capa: "RV_RIESGO_VIENTO_2012",
  titulo: "Riesgo de derribo por viento",
  id_idioma: "RIESGO_VIENTO",
  id: "0",
  zoom: 16,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=RV_RIESGO_VIENTO_2012"
}
];

var capasUsoForestal = [{
  capa: "IF_MG_USOS_SUELO",
  titulo: "Mapa forestal - Uso de suelo ",
  id_idioma: "MAPA_FORESTAL_US",
  id: "0",
  zoom: 16,
  img: "http://www.geo.euskadi.eus/WMS_NEKAZARITZA?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=IF_MG_USOS_SUELO"
}
];

var configZoom = [
  { name: "Ejes red viaria", zoom: 15, id: 1 ,i18n:"EJES_RED_VIARIA" },
  { name: "Aguas", zoom: 17, id: 2 ,i18n:"AGUAS" },
  { name: "Curvas de Nivel", zoom: 16, id: 3 ,i18n:"CURVAS_DE_NIVEL" },
  { name: "Sombras", zoom: 4, id: 4 ,i18n:"SOMBRAS" },
  { name: "Pendientes", zoom: 4, id: 5  ,i18n:"PENDIENTE" },
  { name: "Orientaciones", zoom: 4, id: 6 ,i18n:"ORIENTACIONES" },

  { name: "Planeamiento", zoom: 15.01, id: 7  ,i18n:"PLANEAMIENTO" },
  { name: "Parcela", zoom: 15.01, id: 8  ,i18n:"PARCELA" },
  { name: "Subparcela", zoom: 15.01, id: 9  ,i18n:"SUBPARCELA" },

  { name: "Parametros forestales", zoom: 4, id: 10  ,i18n:"PARAMETROS_FORESTALES" },
  { name: "Densidad media(pies/ha)", zoom: 4, id: 11  ,i18n:"DENSIDAD_MEDIA" },
  { name: "Área basimétrica (m2/ha)", zoom: 4, id: 12  ,i18n:"AREA_BASIMETRICA" },
  { name: "Volumen medio (m3/ha)", zoom: 4, id: 13  ,i18n:"VOLUMEN_MEDIO" },
  { name: "Volumen medio >= CD40  (m3/ha)", zoom: 4, id: 14  ,i18n:"VOLUMEN_MEDIO_40" },
  { name: "Crecimiento anual (m3/ha-año)", zoom: 4, id: 15  ,i18n:"CRECIMIENTO_ANUAL" },

  { name: "Riesgo de derribo por viento", zoom: 4, id: 16  ,i18n:"RIESGO_VIENTO" },
  { name: "Mapa forestal - Uso de suelo", zoom: 4, id: 17  ,i18n:"MAPA_FORESTAL_US" },

];


var columnasTablaConsulta = [

  {
    title: "NOM_MUNICIPIO",
    field: "NOM_MUNICIPIO",
    sorter: "string",
    width: 120
  },
  {
    title: "POLIGONO",
    field: "POLIGONO",
    sorter: "string",
    width: 100,
    cellClick: function (e, cell) {/*console.log("cell click")*/ }
  }, {
    title: "PARCELA",
    field: "PARCELA",
    sorter: "number",
    width: 100
  },
  {
    title: "INSIDE_X",
    field: "INSIDE_X",
    sorter: "number",
    width: 200,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." , precision: 2 }
  },
  {
    title: "INSIDE_Y",
    field: "INSIDE_Y",
    sorter: "number",
    width: 200,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." , precision: 2 }
  },
  {
    title: "POLY_AREA",
    field: "POLY_AREA",
    sorter: "number",
    width: 150,
    formatter: "money", formatterParams: { decimal: ",", thousand: ".", precision: 2 }
  },
  {
    title: "NOMBRE_CAS",
    field: "NOMBRE_CAS",
    sorter: "string",
    width: 180
  },
  {
    title: "NOMBRE_EUS",
    field: "NOMBRE_EUS",
    sorter: "string",
    width: 180
  },
  {
    title: "CODIGO_CAR",
    field: "CODIGO_CAR",
    sorter: "string",
    width: 150
  },
  {
    title: "DIST_CARR",
    field: "DIST_CARR",
    sorter: "string",
    width: 120,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." , precision: 2 }
  },
  {
    title: "NOMFUENTE",
    field: "NOMFUENTE",
    sorter: "string",
    width: 200
  },
  {
    title: "CODIGO_FUE",
    field: "CODIGO_FUE",
    sorter: "string",
    width: 200
  },
  {
    title: "coordinates",
    field: "coordinates",
    visible: false,
   // download:false
  },
  {
    title: "COD_LITOLO",
    field: "COD_LITOLO",
    sorter: "string",
    width: 200
  },
  {
    title: "EVAPO",
    field: "EVAPO",
    sorter: "string",
    width: 200
  },
  {
    title: "DIST_FUEN",
    field: "DIST_FUEN",
    sorter: "string",
    width: 200
  },
  {
    title: "PEND_MIN",
    field: "PEND_MIN",
    sorter: "number",
    width: 200
  },
  {
    title: "PEND_MAX",
    field: "PEND_MAX",
    sorter: "number",
    width: 200
  },
 
  {
    title: "PEND_MED",
    field: "PEND_MED",
    sorter: "number",
    width: 200
  },
  {
    title: "ALT_MAX",
    field: "ALT_MAX",
    sorter: "number",
    width: 200
  },
  {
    title: "ALT_MIN",
    field: "ALT_MIN",
    sorter: "number",
    width: 200
  },
  {
    title: "ALT_MED",
    field: "ALT_MED",
    sorter: "number",
    width: 200
  },
  {
    title: "ORI_MED",
    field: "ORI_MED",
    sorter: "string",
    width: 150
  },

  //LITOLIGIA
  {
    title: "COD_LITOLO",
    field: "COD_LITOLO",
    sorter: "string",
    width: 100
  },

  //
  {
    title: "SIST_GEN",
    field: "SIST_GEN",
    sorter: "number",
    width: 200,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ACT_ECON",
    field: "ACT_ECON",
    sorter: "number",
    width: 200,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "NO_URBAN",
    field: "NO_URBAN",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "RESI",
    field: "RESI",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  ////DATOS INVENTARIO
  {
    title: "BOS_11",
    field: "BOS_11",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "AFLOR",
    field: "AFLOR",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ARBUS",
    field: "ARBUS",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "B_GAL",
    field: "B_GAL",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "B_PLA",
    field: "B_PLA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  // {
  //   title: "CANCH",
  //   field: "CANCH",
  //   sorter: "number",
  //   width: 100,
  //   formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  // },
  {
    title: "CULTI",
    field: "CULTI",
    sorter: "number",
    width: 100,
    formatter: "number", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "CUR_AGU",
    field: "CUR_AGU",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ENERGIA",
    field: "ENERGIA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "EQUIP",
    field: "EQUIP",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "HERBAZ",
    field: "HERBAZ",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "LAGUNA",
    field: "LAGUNA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "MARISMA",
    field: "MARISMA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "MOSAICO",
    field: "MOSAICO",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "PANTANO",
    field: "PANTANO",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "MATORRAL",
    field: "MATORRAL",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "PRADO",
    field: "PRADO",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "P_SETO",
    field: "P_SETO",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "TELECOM",
    field: "TELECOM",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ZONA_P",
    field: "ZONA_P",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ARTIF",
    field: "ARTIF",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  //sigpac
  {
    title: "AG",
    field: "AG",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "CA",
    field: "CA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "ED",
    field: "ED",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "FO",
    field: "FO",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "FY",
    field: "FY",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "IM",
    field: "IM",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },

  {
    title: "IV",
    field: "IV",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },

  {
    title: "PA",
    field: "PA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },

  {
    title: "PR",
    field: "PR",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },

  {
    title: "PS",
    field: "PS",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },

  {
    title: "TA",
    field: "TA",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  },
  {
    title: "TH",
    field: "TH",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  }, {
    title: "VI",
    field: "VI",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  }, {
    title: "ZU",
    field: "ZU",
    sorter: "number",
    width: 100,
    formatter: "money", formatterParams: { decimal: ",", thousand: "." }
  }
];



var municipiosCod = [
  { name: "Abadiño", value: 1 },
  { name: "Amorebieta-Etxano", value: 3 },
  { name: "Atxondo", value: 91 },
  { name: "Berriz", value: 19 },
  { name: "Durango", value: 27 },
  { name: "Elorrio", value: 32 },
  { name: "Ermua", value: 34 },
  { name: "Garai", value: 39 },
  { name: "Iurreta", value: 910 },
  { name: "Izurtza", value: 50 },
  { name: "Mallabia", value: 58 },
  { name: "Manaria", value: 59 },
  { name: "Zaldibar", value: 95 }
  
]
var tipoOrientacion = [
  { name: "LLANO", value: "LLANO", data: "LLANO" },
  { name: "N", value: "N", data: "N" },
  { name: "NE", value: "NE", data: "NE" },
  { name: "E", value: "E", data: "E" },
  { name: "SE", value: "SE", data: "SE" },
  { name: "S", value: "S", data: "S" },
  { name: "SO", value: "SO", data: "SO" },
  { name: "O", value: "O", data: "O" },
  { name: "NO", value: "NO", data: "NO" },
]
var tiposLitologias = [
  { name: "Depósitos superficiales", value: "01", data: "01_Litologia" },
  { name: "Rocas detríticas de grano grueso (Areniscas).Dominante", value: "02", data: "02_Litologia" },
  { name: "Rocas detríticas de grano medio (Limolitas).Dominante", value: "03", data: "03_Litologia" },
  { name: "Rocas detríticas de grano fino (Lutitas).Dominante", value: "04", data: "04_Litologia" },
  { name: "Detríticos alternantes", value: "08", data: "08_Litologia" },
  { name: "Caliza impuras y calcarenitas", value: "11", data: "11_Litologia" },
  { name: "Caliza", value: "12", data: "12_Litologia" },
  { name: "Rocas volcánicas piroclásticas", value: "13", data: "13_Litologia" },
  { name: "Rocas volcánicas en coladas", value: "14", data: "14_Litologia" },
  { name: "Alternacia de margocalizas, margas calizas y calcarenitas", value: "17", data: "17_Litologia" },
  { name: "Pizarras", value: "19", data: "19_Litologia" },
  { name: "Rocas ígneas", value: "20", data: "20_Litologia" }
]
var tiposEvapo = [
  { name: "Muy bajo", value: "1", data: "01_Evapo" },
  { name: "Bajo", value: "2", data: "02_Evapo" },
  { name: "Medio", value: "3", data: "03_Evapo" },
  { name: "Alto", value: "4", data: "04_Evapo" },
  { name: "Muy alto", value: "5", data: "05_Evapo" }
 
]
var tiposCarretera = [
  { name: "Autopistas, autovias y vias de doble calzada", value: "Autopistas, autovias y vias de doble calzada", data: "AUTOPISTAS_AV" },
  { name: "Otras vias revestidas", value: "Otras vias revestidas", data: "OVR" },

  { name: "Camino", value: "Camino", data: "CAMINO" },
  { name: "Carreteras principales", value: "Carreteras principales", data: "CARR_P" }

]
var codPendientesTramos = [
  { name: "<=3%", value: "1", min: "0%", max: "3%" },
  { name: "3-5%", value: "2" , min: "3%", max: "5%" },
  { name: "5-10%", value: "3" , min: "5%", max: "10%" },
  { name: "10-20%", value: "4" , min: "10%", max: "20%" },
  { name: "20-30%", value: "5" , min: "20%", max: "30%" },
  { name: "30-50%", value: "6" , min: "30%", max: "50%" },
  { name: "50-100%", value: "7" , min: "50%", max: "100%" },
  { name: ">=100%", value: "8" ,min: "100%", max: "<100%" }
]



var consulta_agricola_ = [
  {
    uso: "HUERTA",
    tag: "HUERTA",
    preferente: {
      DIST_CARR: "=<300",
      PEND_MAX: "< 10",
      ALT_MAX: "< 400"
    }
  },
  {
    uso: "FRUTAL",
    tag: "FRUTAL",
    preferente: {
      DIST_CARR: "=<300",
      PEND_MAX: " < 15",
      PEND_MIN: "=< 10",
      ALT_MAX: "< 400"
    }
  },
  {
    uso: "PRADERA1",
    tag: "PRADERA1",
    preferente: {
      DIST_CARR: " =< 300",
      PEND_MAX: " < 25",
      PEND_MIN: " => 15",
      ALT_MAX: " =< 600",
      ALT_MIN: " => 0"
    }
  },
  {
    uso: "PRADERA2",
    tag: "PRADERA2",
    preferente: {
      DIST_CARR: " =< 300",
      PEND_MAX: " =<15",
      PEND_MIN: " =>  0",
      ALT_MAX: " =< 600",
      ALT_MIN: " => 400"
    }
  },
  {
    uso: "PASTIZAL",
    tag: "PASTIZAL",
    preferente: {
      DIST_CARR: " < 300",
      PEND_MAX: " =< 25",
      PEND_MIN: "=<15",
      ALT_MIN: " <600"
    }
  }, {
    uso: "PASTIZAL2",
    tag: "PASTIZAL2",
    preferente: {
      DIST_CARR: " < 300",
      PEND_MAX: "=<15",
      ALT_MIN: " <600"
    }
  },
  {
    uso: "BASOA",
    tag: "BASOA",
    preferente: {
      PEND_MIN: "> 25",
    }
  }
]


var color_Verde1 = 'rgba(3 ,157 ,1, 0.3)';
var color_Verde2 = 'rgba(3 ,157 ,1, 1)';
var color_Amarillo1 = 'rgba(255, 235, 59, 0.3)';
var color_Amarillo2 = 'rgba(255, 235, 59, 1)';
var color_Naranja1 = 'rgba(255, 152, 0,0.3)';
var color_Naranja2 = 'rgba(255, 152, 0, 1)';
var color_Morado1 = 'rgba(103, 58, 183,0.3)';
var color_Morado2 = 'rgba(103, 58, 183, 1)';
