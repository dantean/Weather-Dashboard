var apiKey="43307f36c133c1b4d80feb3644b2ab3e"
var dashboardEl=document.getElementById("dashboard")
var fiveDayEl=document.getElementById("five-day")
var searchInputEl=document.getElementById('search-input')
var searchBtnEl=document.getElementById("search-btn")
var sectionBtnEl=document.getElementById("historyBtn")
var historyArr =   JSON.parse(localStorage.getItem("history"))  ||  []

displayHistory()

function displayHistory(){
    sectionBtnEl.innerHTML=""
     for(var i =0; i < historyArr.length; i++){
        sectionBtnEl.innerHTML=sectionBtnEl.innerHTML+`    <button type="button" class="btn bg-secondary w-100 mx-3 my-1">${historyArr[i]}</button>`
     }
}

function populateData(event){
    var currentButton=event.target
    var cityName=currentButton.textContent
    currentWeather(cityName)
    fiveForecast(cityName)

}

sectionBtnEl.addEventListener("click", populateData)

function currentWeather(cityName){
    var url=`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(url)
    .then(function(response){
         return response.json()  
    })
    .then(function(data){
        console.log(data )
       
        if(historyArr.includes(data.name)===false){
            historyArr.push(data.name)

            localStorage.setItem("history", JSON.stringify(historyArr) )
            displayHistory()
        }

        dashboardEl.innerHTML=`
        <h3>${data.name} (${dayjs.unix(data.dt).format("MM/DD/YYYY")}) <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></h3>
        <p>Temp: 75 F</p>
        <p>Wind: 8.43 MPH</p>
        <p>Humidity: 44%</p>
        `
     

    })
}


function fiveForecast(cityName){
    var url=`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`

    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
        fiveDayEl.textContent=""

        /*
            <div class="col-sm-2 mb-3 mb-sm-0">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">1/30/2024</h5>
                            <img src="https://openweathermap.org/img/wn/10d@2x.png" />
                            <p class="card-text">
                             temp: 35F
                            </p>
                            <p class="card-text">
                             humidity:
                            </p>
                           
                              <p class="card-text">
                             wind:
                            </p>
                        </div>
                    </div>
                </div>
        */
        for(var i=3; i <data.list.length;i=i+8){
            var fiveDayArr=data.list
            console.log(fiveDayArr[i])
            var divCol=document.createElement("div")
            divCol.classList="col-sm-2 mb-3 mb-sm-0"

            var divCard= document.createElement("div")
            divCard.classList="card"

            var divBody=document.createElement("div")
            divBody.classList="card-body"

            var h5=document.createElement("h5")
            h5.classList="card-title"
            h5.textContent= dayjs.unix(fiveDayArr[i].dt).format("MM/DD/YYYY")
            divBody.appendChild(h5)
            var img=document.createElement("img")
            img.src="https://openweathermap.org/img/wn/" +fiveDayArr[i].weather[0].icon +"@2x.png"
            divBody.appendChild(img)
            var pTemp=document.createElement("p")
            pTemp.classList="card-text"
            pTemp.textContent="temp: "+fiveDayArr[i].main.temp
            divBody.appendChild(pTemp)
            divCard.appendChild(divBody)
            divCol.appendChild(divCard)

            fiveDayEl.appendChild(divCol)
         }
    })
}


function search(){
   var cityName=searchInputEl.value 
   currentWeather(cityName)
   fiveForecast(cityName)

}

searchBtnEl.addEventListener("click", search)