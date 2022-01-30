const startBox = document.querySelector(".startbox"); // ekran poczatkowy
const loader = document.querySelector(".loader"); // loader
const numberBox = document.querySelector(".numberbox"); // box z formularzem
const popupBox = document.querySelector(".popup"); // popup
const popupTelBox = document.querySelector(".popuptel"); // popup o pozostawienie telefonu

const getBtn = document.querySelector(".startbox__btn"); //przycisk poczatkowy
const numberBtn = document.querySelector(".numberbox__btn"); // przycisk ekranu formularza
const popupBtnEnd = document.querySelector(".popup__buttons-end"); // zakonczenie procedury
const popupBtn = document.querySelector(".popup__buttons-back"); //przycisk kolejna paczka
const popupTelBtn = document.querySelector(".popuptel__buttons-back"); // przycisk konczacy - zostawiamy numer
const popupTelBtnEnd = document.querySelector(".popuptel__buttons-end"); // przycisk konczacy

const numberInput = document.querySelector("#tel"); //input numeru telefonu
const codeInput = document.querySelector("#cod"); //input kodu odbioru

const errorTelBox = document.querySelector(".errorTel"); //bład telefonu
const errorCodeBox = document.querySelector(".errorCode"); //błąd kodu
const howLong = document.querySelector(".howLong"); //element poakzujący czas spędzony przy odbiorze paczki

let countTime;
let seconds = 0;

const readyStart = () => {
	clearInterval(countTime);
	countTime = setInterval(() => {
		seconds++;
		console.log(countTime);
	}, 1000);
}; //funkcja rozpoczynająca naliczanie czasu

const stopCountingTime = () => {
	clearInterval(countTime); //zatrzymuje odliczanie
	howLong.textContent = `Całość zajęła Ci ${seconds} sekund!`;
	howLong.style.visibility = "visible";
}; //funkcja koncząca naliczanie pokazująca komunikat

// Nadawanie i zdjemowanie klasy hide w zależności od naciśniętego przycisku
const hideStatrBox = () => {
	startBox.classList.toggle("hide");
	loader.classList.remove("hide");
	readyStart();
	setTimeout(() => {
		numberBox.classList.toggle("hide");
		loader.classList.add("hide");
	}, 1000); //loader - klasy nadawane są po sekundzie
};

const moveOn = () => {
	popupBox.classList.remove("hide");
};
const moveBack = () => {
	popupBox.classList.toggle("hide");
};

const backToStart = () => {
	startBox.classList.remove("hide");
	popupBox.classList.add("hide");
	numberBox.classList.add("hide");
	seconds = 0;
};

const endProcedure = () => {
	popupTelBox.classList.toggle("hide");
	readyStart();
	seconds = 0;
};

const telStays = () => {
	popupBox.classList.toggle("hide");
	popupTelBox.classList.toggle("hide");
};

// -------------------------------------------------------------- FUNKCJE SPRAWDZAJĄCE FORMULARZ ------------------------------------------------

const checkForm = input => {
	const elements = input.map(el => el.value); //zwraca tablicę elementów

	if (elements[0] === "" || elements[1] === "") {
		showError([numberInput, codeInput]);
	} // sprawdzenie warunków - jeżeli chociaż jeden input nie jest wypełniony, włączamy funkcję pokaż błąd

	//sprawdzamy warunek długości wpisywanych cyfr
	checkTelLength(numberInput, 9);
	checkCodeLength(codeInput, 4);

	if (checkTelLength(numberInput, 9) === false &&	checkCodeLength(codeInput, 4) === false	) 
	{
		moveOn();
		stopCountingTime();
		popupBtnEnd.addEventListener("click", () => {
			backToStart();
			clearElements([numberInput, codeInput]);
		});
	}// jeżeli oba pola są wypełnione prawidłowo, przechodzimy dalej moveON() -pojawia się popup, przestajemy liczyć czas. Jeżeli "to wszystko na dziś" - popupBtnEnd wracamy do ekranu początkowego i czyścimy inputy
};

const showError = input => {
	input.forEach(el => {
		el.setAttribute("placeholder", "Pole nie może być puste!");
	});
}; // przy braku wypełnienia do inputów dodajemy placeholder jako komunikat błędu

const clearElements = input => {
	input.forEach(el => {
		el.removeAttribute("placeholder");
		el.value = "";
	});
};//funkcja czyszcząca inputy - usuwa placeholdery i czyści treść

// FUNKCJE SPRAWDZAJĄCE DŁUGOSĆ NUMERU TEL I KODU

const checkTelLength = (input, min) => {
	const element = input.value.length;
	if (element < min) {
		errorTelBox.textContent = `Telefon musi mieć minimum ${min} cyfr!`;
		errorTelBox.style.visibility = "visible";
		return true;
	} else {
		errorTelBox.style.visibility = "hidden";
		return false;
	}
};// nadane dwa argumenty, zmienna element pobiera długość wpisanego tektu jeżeli mniejsze niż wymagana długość textContent zastępuje napisany w HTML "!" na komunikat i ustawia styl na visible. "!" w HTML i style visible zastosowałem po to aby uniknąć "przeskoku" elementów storny podczas pojawiania się komuniktatu. "!" w HTML "rezerwuje" miejsce na komunikat przez co pojawienie się go nie wpływa na układ pozostałych elementów. If-y zwracają true lub false potrzebne później do warunku w funkcji checkForm()


const checkCodeLength = (input, min) => {
	const element = input.value.length;
	if (element < min) {
		errorCodeBox.textContent = `Kod odbioru musi mieć minimum ${min} cyfry!`;
		errorCodeBox.style.visibility = "visible";
		return true;
	} else {
		errorCodeBox.style.visibility = "hidden";
		return false;
	}
}; // analogogicznie jak z telefonem



// -------------LISTENERY------------------------


//LISTENERY na przyciski dodające/usuwające klasę "hide"
getBtn.addEventListener("click", hideStatrBox);
numberBtn.addEventListener("click", checkForm);
popupBtnEnd.addEventListener("click", backToStart);
popupBtn.addEventListener("click", telStays);


//listenery nadane na przyciski wywyołujące funkcje
numberBtn.addEventListener("click", e => {
	e.preventDefault();
	checkForm([numberInput, codeInput]);
});

//przyciski pozostawiające (lub nie) numer do kolejnej przesyłki
popupTelBtnEnd.addEventListener("click", () => {
	endProcedure();
	clearElements([numberInput, codeInput]);
});

popupTelBtn.addEventListener("click", () => {
	endProcedure();
	clearElements([codeInput]);
});
