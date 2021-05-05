window.addEventListener("DOMContentLoaded", async() => {
    let button = document.getElementById("loadCity");
    let selectCities = document.getElementById("ville");
    
    //recupere les données des villes en cliquant sur le bouton
    button.addEventListener("click", async() =>{
        let cities = await recupereData(`http://meteo.webboy.fr/`);
        selectCities.innerHTML = "";
        for(city of cities){
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            selectCities.appendChild(option);
        }
        weatherCity();
    })
    selectCities.addEventListener("change", weatherCity)

});


async function recupereData(x){
    let response = await fetch(x);
    let json = await response.json();
    return json;
}

//fonction mise en forme meteo ville
let weatherCity = async() =>{
    let selectCities = document.getElementById("ville");
    let divResult = document.getElementById("result");
    let nameCity = document.getElementById("nameCity");
    let temp = document.getElementById("temp");
    let speed = document.getElementById("speed");
    let gps = document.getElementById("gps");
    let weatherIcon = document.getElementById("icon");
    let wind = document.getElementById("windDirection");
    let lastUpdate = document.getElementById("lastReleve");
    let lastUpdateHour = document.getElementById("lastHour");

    let citySelectId = selectCities.options[selectCities.selectedIndex].value;
    let cityData = await recupereData(`https://api.openweathermap.org/data/2.5/weather?id=${citySelectId}&units=metric&appid=03737a7253db07448192caa57160684b`);
    console.log(cityData);
    nameCity.innerHTML = cityData.name;
    //icon
    let icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`
    weatherIcon.innerHTML = "";
    weatherIcon.appendChild(icon);
    temp.innerHTML = Math.floor(cityData.main.temp);
    speed.innerHTML = Math.floor(speedFr(cityData.wind.speed));
    wind.innerHTML = "";
    wind.appendChild(winDirection(cityData.wind.deg));
    gps.innerHTML = MiseEnFormeDms(cityData.coord.lat,cityData.coord.lon);
    divResult.style.display = "block";
    console.log(cityData.dt);
    lastUpdate.innerHTML = miseEnFormeDate(cityData.dt);
    lastUpdateHour.innerHTML = miseEnFormeHeure(cityData.dt);

}

//function m/s en km/h
let speedFr = (vitesse) =>{
    let speed = 0;
    speed = (vitesse*3600)/1000;
    return speed;
}

//function qui met en forme les coordonnées gps en DMS
let MiseEnFormeDms = (lat,lng) =>{
    let directionLat = (lat>0)? "N" : "S";
    let directionLng = (lng>0)? "E" : "O";
    let newLat = arrondi(lat)
    let newLng = arrondi(lng);
    let coordonnees = `${newLat}°${directionLat}, ${newLng}°${directionLng}`
    return coordonnees;

}

let arrondi = (valeur) => {
    let result = Math.round(valeur*10)/10;
    return result;
}

/*let getDms = (valeur) =>{
    let result = "";
    let val = Math.abs(valeur);
    let valDeg = Math.floor(val);
    let valMin = Math.floor((val-valDeg)*60);
    if(valMin == 0){
        result = `${valDeg}°`;
    }else{
        let valSec = Math.round((val - valDeg -valMin /60)*3600*1000)/1000;
        if(valSec == 0){
            result = `${valDeg}°${valMin}'`;
        }else{
            result = `${valDeg}°${valMin}'${valSec}"`;
        }
    }
    
    return result;
}*/

let winDirection = (degres) =>{
    let img = document.createElement("img");
    img.src = "fleche.png";
    img.classList.add("wind");
    img.style.transform = `rotate(${degres}deg)`
    return img;
}

//date
let miseEnFormeDate = (milliseconds) =>{
    let date = new Date(milliseconds);
    let options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
    return date.toLocaleDateString("fr-FR", options);
}

//heure
let miseEnFormeHeure = (milliseconds) =>{
    let date = new Date(milliseconds);
    let options = {hour: "2-digit", minute: "2-digit", second: "2-digit"};
    return date.toLocaleTimeString("fr-FR", options);
}





