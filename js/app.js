'use strict'

   let nome;
   async function pegarLocalizacaoNome(latitude, longitude) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c219198f8aaa470603af42046b258dc&units=metric&lang=pt_br`);
        const data = await response.json();
        nome = data.name;

        const titulo = document.querySelector('.chart-card-title');
        if (titulo) {
            titulo.textContent = nome;
        }

    } catch (error) {
        console.error("Erro ao pegar o nome da localização:", error);
        return null;
    }
   }
   let chart;


    function desenharGraficoTempUmi(labels, temperaturas, umidades){
    const ctx = document.getElementById('myChart');
    chart = new Chart(ctx, {
     type: 'line',
       data: {
         labels: labels,
           datasets: [
           {
            label: 'Temperatura (°C)',
            data: temperaturas,
            backgroundColor: '#66bb6a',
            borderWidth: 3,
            borderColor: '#66bb6a',
            tension: 0.3,
            fill: false
      },
      {
            label: 'Umidade (%)',
            data: umidades,
            backgroundColor: '#f58f8d',
            borderWidth: 3,
            borderColor: '#f58f8d',
            tension: 0.3,
            fill: false
      }
      ]
    },
      options: {
            responsive: true,
            maintainAspectRatio: false,
        plugins: {
      },
       scales: {
         y: {
            beginAtZero: true
        }
      }
        }
      });
}


    function desenharGraficoVento(labels, velocidade, graus, rajada){
    const ctx = document.getElementById('myChart2');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Velocidade (m/s)',
             data: velocidade,
             borderColor: '#1de9b6',
             backgroundColor: 'rgba(29, 233, 182, 0.4)',
             borderWidth: 2
          },
          {
             label: 'Direção (°)',
             data: graus,
             borderColor: '#e76f51',
             backgroundColor: 'rgba(231, 111, 81, 0.4)',
             borderWidth: 2
          },
          {
             label: 'Rajada (m/s)',
             data: rajada,
             borderColor: '#ffa726',
             backgroundColor: 'rgba(255, 167, 38, 0.4)',
             borderWidth: 2
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: true
            }
         },
         scales: {
            y: {
              beginAtZero: true,
              grid: {
                  color: "rgba(0, 0, 0, 0)"
               },
               ticks: {
                  beginAtZero: true
               }
            },
            x: {
              display: true,
              grid: {
                  color: "rgba(0,0,0,0)"
               }
            }
         }
      }
   });
}
    function desenharGraficoUvNuvens(labels, uv, nuvens){
    const ctx = document.getElementById('myChart3');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
         datasets: [
          {
             label: 'Ultravioleta ☀️',
             data: uv,
             borderColor: '#b18cd9',
             backgroundColor: 'rgba(177, 140, 217, 0.3)',
             borderWidth: 2
          },
          {
             label: 'Nuvens ☁️',
             data: nuvens,
              borderColor: '#87ceeb',
             backgroundColor: 'rgba(135, 206, 235, 0.3)',
             borderWidth: 2
          }
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: {
               display: true
            }
         },
         scales: {
            y: {
              beginAtZero: true,
              grid: {
                  color: 'rgba(130, 82, 179, 1)'
               },
               ticks: {
                  beginAtZero: true
               }
            },
            x: {
              display: true,
              grid: {
                  color: 'rgba(135, 206, 235, 1)'
               }
            }
         }
      }
   });
  }




     async function chamadaApiTempUmi(latitude, longitude) {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m&timezone=auto`;

      const resposta = await fetch(url);
      const data = await resposta.json();

      const horas = data.hourly.time;
      const temperaturas = data.hourly.temperature_2m;
      const umidades = data.hourly.relative_humidity_2m;

      const agora = new Date();
      const horaAtual = agora.getHours();

      const labels = [];
      const dadosTemperatura = [];
      const dadosUmidade = [];
         
      for (let i = 0; i <= horaAtual; i++) {
        const hora = new Date(horas[i]);
        labels.push(`${hora.getHours()}h`);
        dadosTemperatura.push(temperaturas[i]);
        dadosUmidade.push(umidades[i]);
      }

      desenharGraficoTempUmi(labels, dadosTemperatura, dadosUmidade);
    }
      
    async function chamadaApiVento(latitude, longitude) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0c219198f8aaa470603af42046b258dc&units=metric&lang=pt_br`;
      const resposta = await fetch(url);
      const data = await resposta.json();

      const agora = new Date();
      const horaAtual = agora.getHours();

      const labels = [`${horaAtual}h`];
      const dadosVelocidade = [data.wind.speed];
      const dadosGraus = [data.wind.deg];
      const dadosRajada = [data.wind.gust ?? 0];

      desenharGraficoVento(labels, dadosVelocidade, dadosGraus, dadosRajada);
    }

    async function chamadaApiUvNuvem(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index,cloudcover&timezone=auto`;
    const resposta = await fetch(url);
    const data = await resposta.json();
    
    const horas = data.hourly.time;

    const agora = new Date();
    const horaAtual = agora.getHours();
    
    const uv = data.hourly.uv_index;
    const nuvens = data.hourly.cloudcover;

    const labels = [];
    const dadosUv = [];
    const dadosNuvens = [];

    for (let i = 0; i <= horaAtual; i++) {
        const hora = new Date(horas[i]);
        labels.push(`${hora.getHours()}h`);
        dadosUv.push(uv[i]);
        dadosNuvens.push(nuvens[i]);
    }
    
    desenharGraficoUvNuvens(labels, dadosUv, dadosNuvens);
    }

    async function chamadaApiSensPeriodo(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature,is_day,visibility,soil_temperature_0cm,soil_moisture_0_to_1cm,precipitation_probability,weathercode&timezone=America/Sao_Paulo&daily=sunset`;
    const resposta = await fetch(url);
    const data = await resposta.json();

    const horas = new Date();
    const horaAtual = horas.getHours();
    const diaAtual = horas.getDay();

    const codigoDia = {
      0: "☀️ Céu limpo",
      1: "⛅ Parcialmente nublado",
      2: "☁️ Nublado",
      3: "🌧️ Chuva",
      4: "❄️ Neve",
      5: "⛈️ Tempestade"
    };

    const codigoNoite = {
      0: "🌙 Céu limpo",
      1: "🌙☁️ Parcialmente nublado",
      2: "☁️ Nublado",
      3: "🌧️ Chuva",
      4: "❄️ Neve",
      5: "⛈️ Tempestade"
    };

    const codigo = data.hourly.weathercode[horaAtual];
    const periodo = data.hourly.is_day[horaAtual];
    const sensacao = data.hourly.apparent_temperature[horaAtual];
    const visibilidade = data.hourly.visibility[horaAtual];
    const temperaturaSolo = data.hourly.soil_temperature_0cm[horaAtual];
    const umidadeSolo = data.hourly.soil_moisture_0_to_1cm[horaAtual];
    const chuva = data.hourly.precipitation_probability[horaAtual];
    const porDoSol = data.daily.sunset[diaAtual];

    const porDoSol2 = new Date(porDoSol).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"});

    const condicao = periodo === 1 ? codigoDia[codigo] : codigoNoite[codigo];

    const titulo = document.querySelector('.weather-title-hoje');
    titulo.textContent = condicao;

    const titulo2 = document.querySelector('.weather-title-sensacao');
    titulo2.textContent = "Sensação térmica atual 🌡️: " + sensacao;
    
    const titulo3 = document.querySelector('.weather-title-visibilidade');

    if(visibilidade < 1000){
    titulo3.textContent = "Visibilidade atual  ☁️: " + visibilidade + "m";
    }else if(visibilidade >= 1000){
    titulo3.textContent = "Visibilidade atual ☁️: " + (visibilidade/1000).toFixed(1) + " km";
    }
    
    const titulo4 = document.querySelector('.weather-title-temp-solo');
    titulo4.textContent = "Temperatura do solo 🌱: " + temperaturaSolo;

    const titulo5 = document.querySelector('.weather-title-umid-solo');
    titulo5.textContent = "Umidade do solo 💧: " + umidadeSolo;

    const titulo6 = document.querySelector('.weather-title-chuva');
    titulo6.textContent = "Chances de chuva 🌧️: " + chuva + "%";

    const titulo7 = document.querySelector('.weather-title-por-do-sol');
    titulo7.textContent = "Horário do pôr do sol ☀️: " + porDoSol2 + "h";
    }
   
   function desenharMapaMundi(latitude, longitude){
   var map = L.map('map').setView([latitude, longitude], 2);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   }

   function desenharMapaCidade(latitude, longitude){
   var map = L.map('map2').setView([latitude, longitude], 10);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);
   }
   
   function desenharMapaNuvens(latitude, longitude){
   var map = L.map('map3').setView([latitude, longitude], 3);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   L.tileLayer('https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=0c219198f8aaa470603af42046b258dc', {
   attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
   }).addTo(map);
   }
   
   function desenharMapaPrecipitacao(latitude, longitude){
   var map = L.map('map4').setView([latitude, longitude], 1);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   L.tileLayer('https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=0c219198f8aaa470603af42046b258dc', {
   attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
   }).addTo(map);
   }

   function desenharMapaTemperatura(latitude, longitude){
   var map = L.map('map5').setView([latitude, longitude], 3);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   L.tileLayer('https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=0c219198f8aaa470603af42046b258dc', {
   attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
   }).addTo(map);
   }

   function desenharMapaVento(latitude, longitude){
   var map = L.map('map6').setView([latitude, longitude], 6);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   L.tileLayer('https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=0c219198f8aaa470603af42046b258dc', {
   attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
   }).addTo(map);
   }

   function desenharMapaPressao(latitude, longitude){
   var map = L.map('map7').setView([latitude, longitude], 2);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   maxZoom: 19,
   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   }).addTo(map);

   L.tileLayer('https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=0c219198f8aaa470603af42046b258dc', {
   attribution: '&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
   }).addTo(map);
   }



document.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            pegarLocalizacaoNome(latitude, longitude); 
            chamadaApiTempUmi(latitude, longitude);
            chamadaApiVento(latitude, longitude);
            chamadaApiUvNuvem(latitude, longitude);
            chamadaApiSensPeriodo(latitude, longitude);
            desenharMapaMundi(latitude, longitude);
            desenharMapaCidade(latitude, longitude);
            desenharMapaNuvens(latitude, longitude);
            desenharMapaPrecipitacao(latitude, longitude);
            desenharMapaTemperatura(latitude, longitude);
            desenharMapaVento(latitude, longitude);
            desenharMapaPressao(latitude, longitude);
        });
    } else {
        console.log("Geolocalização não é suportada neste navegador.");
    }
});

