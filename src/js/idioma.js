var esJson = obtenerJsonIidoma("es");
var euJson = obtenerJsonIidoma("eu");

var resources = {
	'es': { translation: esJson },
	'eu': { translation: euJson }
};
//console.log(resources)

function cambiarIdioma(miidioma) {
	var idiomaactual = miidioma;


	switch (miidioma) {
		case 'es':
			idiomaactual = 'es';
			$('#id_euskera').removeClass('disabled');
			$('#id_espanol').addClass('disabled');

			localStorage.idioma = miidioma;
			break;

		case 'eu':
			idiomaactual = 'eu';

			$('#id_espanol').removeClass('disabled');
			$('#id_euskera').addClass('disabled');

			localStorage.idioma = miidioma;
			break;

		default:
			idiomaactual = 'es';
			$('#id_euskera').removeClass('disabled');
			$('#id_espanol').addClass('disabled');

			break;
	}
	localStorage.idioma = miidioma;


	i18n.init({
		lng: idiomaactual,
		fallbackLng: 'es',
		resStore: resources
	});

	$('[data-i18n]').i18n();
	/* estilo selecionado  */
	$("#idioma a").removeClass("active");
	$("#idioma #" + miidioma).addClass("active");



	cambiarIdiomaTitles();
};

function cambiarIdiomaTitles() {
	$('nav a#btnConsulta').attr("title", i18n.t("CONSULTA"));
	$('nav a#btnConsultaPredeterminada').attr("title", i18n.t("CONSULTA_PREDETERMINADA"));
	$('nav a#btnInformacion').attr("title", i18n.t("INFORMACION"));
	$('nav a#btnleyenda').attr("title", i18n.t("LEYENDA"));
	$('nav a#btnControlCapas').attr("title", i18n.t("CONTROL_CAPAS"));
	$('nav a#btnOrtofotos').attr("title", i18n.t("CONTROL_CAPAS_BASE"));
	$('nav a#btnOrtofotos').attr("title", i18n.t("CONTROL_CAPAS_BASE"));
	$('#btn-descargar').attr("title", i18n.t("DESCARGAS"))
}

function addTranslation(tag, textEs, textEu) {
	eval('resources.es.translation.' + tag + ' = "' + textEs + '"');
	eval('resources.eu.translation.' + tag + ' = "' + textEu + '"');
	cambiarIdioma(localStorage.idioma);
}

function obtenerJsonIidoma(idioma) {
	var ruta = "src/resources/" + idioma + ".json";
	var request = new XMLHttpRequest();
	request.open("GET", ruta, false);
	request.send(null)
	var idiomaJson = JSON.parse(request.responseText);

	return idiomaJson;

}

function pruebaFETCH(ruta) {

	var request = new Request(ruta, {
		method: 'GET',
		mode: 'cors'
	});
	console.log('request =', request);
	var a = fetch(request)
		.then(function (response) {
			console.log('response =', response);
			return response.text();
		})
		.then(function (data) {
			//console.log('data = ', data);
			devolverDATA(data);
		})
		.catch(function (err) {
			console.error(err);
		});
	console.log(a)

}
function devolverDATA(data) {
	console.log(data)
}