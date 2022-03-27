//Utilisation de l'API Foursquare et OpenWeather
//L'appilication permet d'Obtenir des information de la metéo et une liste des lieux recommandés à proximité de l'emplacement actuel 

//1. L'Api Foursquare fournit les endroits 
//2. L'Api openWeatherKey donne de données météorologiques actuelles

// Foursquare API Info : obligatoires
const clientId = '14RNODUK5Y3M0SSE1CDQ43LR0BPMKN2HOBCM5MXQU2NXVJU4';
const clientSecret = 'R0JQES1YIHMHQM3RJIERUDXOSHB5H4QRG15M10NTIMG533YV';
//API endpoint
//endpoint est le service fournit par l'API
//consultez la doc de l'Api pour mieux exploiter les endpoint de l'AP
//Ce endpont (explore venue)  renvoie une liste des lieux recommandés à proximité de l'emplacement actuel
//?near= est un paramètre sans valeur 
//la valeur du paramètre de near sera ajouter dynamiquement par l'utilisateur 
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info : Obligatoire
const openWeatherKey = 'fa0479350632b68fa52d6ed06826982a';
//endpoint de l'API OpenWeather
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Html Page Elements
//Syntaxe ES6,8 récupération des ID des éléments html
//Ex: document.querySelector('#city'); devient :$('#city');
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
//s'agit d'un tableau de lieu dans index.html où on afficherait les informations de lieu renvoyées par l'API Foursquare
//ici il y'a 4 lieux ,ils sont limités à 10 
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
//L'espace div pour afficher la méteo 
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// La fonction AJAX asynchrone qui renvoie une promesse 
//Retourne le venues
const getVenues = async () => {
  //Récupérer la valeur du champ de saisie de l'utilisateur
  const city = $input.val();
  //composition finale de l'url la requête endpoint API Foursquare
  //& pemet de séparer les paramètres ex:limit=5&client_id=1234
  //se document pour en savoir plus sur les param valeur de endpoind
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20180101`;
  try {
    //Méthode requête GET async await 
    //La var response va envoyer une démande à l'API et sauvegadera la promesse renvoyer par l'API
    const response = await fetch(urlToFetch);
    //Vérification de la reponse du serveur AP
    if (response.ok) {
      //Convertir la promesse retournée en un objet JSON
      const jsonResponse = await response.json();
      //obtenir un tableau de données de lieux 
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue);
      console.log(venues);
      return venues;
    }
    //affiche une erreur si n'y a pas de reponse de serveur API
    throw new Error('Request failed!');
  } catch (error) {
    console.log(error);
  }
};

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
   try {
     const response = await fetch(urlToFetch);
     if (response.ok) {
       const jsonResponse = await response.json();
       return jsonResponse;
       } 
  } catch (error) {
    console.log(error);
  }
}

// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues));
  getForecast().then(forecast => renderForecast(forecast));
  return false;
}

$submit.click(executeSearch)