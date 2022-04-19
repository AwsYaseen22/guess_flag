document.querySelector(".start").addEventListener("click", startGame);
document.querySelector("#globImg").classList.toggle("hidden");
let formatNum = new Intl.NumberFormat("en-US");

function startGame() {
  // hide start btn
  document.querySelector("#start").classList.toggle("hidden");
  let random = Math.floor(Math.random() * 250);
  const url = `https://restcountries.com/v3.1/all`;
  fetch(url)
    .then((response) => response.json())
    .then((countries) => {
      if (!countries.length) {
        console.log(countries.message);
        throw new Error(countries.message);
      }
      filteredCountries = countries.filter((c) => c.cca3 !== "ISR");
      filteredCountries = filteredCountries.filter((c) => c.capital);
      // console.log(filteredCountries);
      let country = filteredCountries[random];
      if (country) {
        createList(country);
        return country;
      } else {
        throw new Error("please try again");
      }
    })
    .then((country) => {
      // console.log(country);
      // get the common name to compare the guess with it
      let answer = country.name.common;
      // set flag image
      document.querySelector("#flagImg").src = country.flags.png;

      document.querySelector(".answer").classList.toggle("hidden");
      // set the btn of the check answer
      document
        .querySelector("#checkAnswer")
        .addEventListener("click", () => checkAnswer(answer));

      // show the flag image
      document.querySelector("#flagImg").classList.toggle("hidden");
      // hide the glob image
      document.querySelector("#globImg").classList.toggle("hidden");
      // show hint1 btn
      document.querySelector("#hint1").classList.toggle("hidden");
      //  set hint1 and hint2 action
      document
        .querySelector("#hint1")
        .addEventListener("click", () => getHint(1, country));
      document
        .querySelector("#hint2")
        .addEventListener("click", () => getHint(2, country));
    })
    .catch((err) => {
      console.log(err.message);
      document.querySelector(".errorMsg").innerText = err.message;
      document.querySelector(".errorMsg").innerText +=
        "\nPlease check your internet connection";
      document.querySelector(".errorMsg").classList.toggle("hidden");
    });
}

function createList(country) {
  // console.log(country);
  let fullDetails = document.querySelector(".fullDetails");
  let continents = String(...country?.continents);
  let currencies =
    country.currencies[[Object.keys(country?.currencies)[0]]].name;
  let languages = Object.values(country?.languages);
  fullDetails.innerHTML = `  
    <h1>${country.name.common}</h1>
    <h4 id="resultText"></h4>		
    <ul class="countryFacts">
      <li>Capital: ${country?.capital[0]}</li>
      <li>Continents: ${continents}</li>
      <li>Currencies: ${currencies}</li>
      <li>Languages: ${languages}</li>
      <li>Region: ${country?.region}</li>
      <li>Sub region: ${country?.subregion}</li>
      <li>Area: ${formatNum.format(country?.area)} KM</li>
      <li>Car Side: ${country?.car.side}</li>
    </ul>
        `;
}

function checkAnswer(answer) {
  // get the guess text
  // hide all hints
  document.querySelector("#hint1").classList.add("hidden");
  document.querySelector("#hint1Text").classList.add("hidden");
  document.querySelector("#hint2").classList.add("hidden");
  document.querySelector("#hint2Text").classList.add("hidden");
  document.querySelector(".answer").classList.add("hidden");

  const guess = document.getElementById("answerText").value;
  let resultText = document.querySelector("#resultText");
  if (guess.toLowerCase() === answer.toLowerCase()) {
    // console.log("Congratulatios");
    resultText.innerText = "Congratulatios";
    document.querySelector(".fullDetails").classList.toggle("hidden");
  } else {
    // console.log("Better luck next time!");
    resultText.innerText = "Better luck next time!";
    document.querySelector(".fullDetails").classList.toggle("hidden");
  }
  document.querySelector("#restart").classList.toggle("hidden");
  document.querySelector("#restart").addEventListener("click", restart);
}

function restart() {
  window.location.reload(true);
}
function getHint(n, country) {
  if (n === 1) {
    // console.log(n, country.subregion);
    document.querySelector(
      "#hint1Text"
    ).innerText = `It's in the sub-reagion ${country.subregion}`;
    document.querySelector("#hint1Text").classList.toggle("hidden");

    document.querySelector("#hint2").classList.toggle("hidden");
  } else {
    // console.log(n, country.capital);
    document.querySelector(
      "#hint2Text"
    ).innerText = `It's capital: ${country.capital}`;
    document.querySelector("#hint2Text").classList.toggle("hidden");

    // document.querySelector("#showAnswer").classList.toggle("hidden");
  }
}
