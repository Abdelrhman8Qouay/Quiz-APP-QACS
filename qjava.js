// change mode with button up
let ButtonMode = document.getElementById("mode-btn");
ButtonMode.addEventListener('click', () => {
    document.body.classList.toggle("darkMode");
})



// app option key
let currentIndexData = 1;
let rightAnswer = 0;
var MinutesDown = 60 * 1.25;
let containQuestions;
let randomNum = shuffle([1,2,3,4,5]);
console.log(randomNum);


let jsQuestions = "./jsonQuestions/Javascript_question.json";
let htmlQuestions = "./jsonQuestions/html_question.json";


// variables of all app

// getQueses();

let numberOf = document.querySelector(".number");
let titleQue = document.querySelector("section .content .title");
let AnswersContainer = document.querySelector("section .content .answers");
let NextButton = document.getElementById("nxt-button");
let buttonSound = new Audio("./assets/audios/buttonSound.mp3");
let section = document.querySelector("section");
let resultTitle = document.querySelector(".result .title");
let imgResult = document.querySelector(".result img");
let resultSection = document.querySelector(".result");


// modal game with page
let containerModal = document.getElementById("modal-container");
window.onload = ()=> { containerModal.classList.add("show_modal") }

let questionCards = document.querySelectorAll(".modal-content .card-modal");
questionCards.forEach((card)=> {
    card.addEventListener('click', ()=> {
        containerModal.classList.remove("show_modal");
        containQuestions = card.dataset.quiz;
        getQueses();

        let nameCard = document.querySelector(".containerA .info .categ span");
        nameCard.textContent = card.children[1].textContent;
    })
})

let questionCardsPage = document.querySelectorAll(".content .categories .category");
questionCardsPage.forEach((card)=> {
    card.addEventListener('click', ()=> {
        // clearInterval(timingInterval);
        removeQuestion();
        currentIndexData = 1;
        rightAnswer = 0;
        if (section.classList.contains("hidden") && resultSection.classList.contains("active")) {
            section.classList.remove("hidden");
            resultSection.classList.remove("active");
        }
        containQuestions = card.dataset.quiz;
        getQueses();

        let nameCard = document.querySelector(".containerA .info .categ span");
        nameCard.textContent = card.children[1].textContent;
    })
})



// get questions from ajax
function getQueses() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            let data = JSON.parse(this.responseText);

            //give number of length
            numberOf.innerHTML = `<span>${currentIndexData}</span> From ${data.length}`;
            addAllDataNow(data[randomNum[currentIndexData - 1] - 1], data.length);

            // interval function
            let time = document.querySelector(".info .time");
            startTimer(MinutesDown, time);

            // add function when click on next button
            NextButton.onclick = () => {
                buttonSound.play();
                if (currentIndexData < data.length) {

                    //check if the right answer or and get it up
                    let checkInput = document.querySelectorAll(".answers .answer input");
                    checkInput.forEach((input)=> {
                        if(input.checked === true) { input.dataset.answer === data[randomNum[currentIndexData - 1] - 1].correct_answer? rightAnswer++ : false ; }
                    });

                    // delete all of old data to get the next
                    let answers = document.querySelectorAll(".answers .answer");
                    answers.forEach(answer=> answer.remove());
                    document.querySelector("section .content .title h2").remove();

                    //addation for currentIndex to get another data from json
                    currentIndexData++;

                    numberOf.innerHTML = `<span>${currentIndexData}</span> From ${data.length}`;

                    // add the function of adding the elements
                    addAllDataNow(data[randomNum[currentIndexData - 1] - 1], data.length);

                    // active interval with click
                    let time = document.querySelector(".info .time");
                    startTimer(MinutesDown, time);
                } else {
                    //check if the right answer with last answer
                    let checkInput = document.querySelectorAll(".answers .answer input");
                    checkInput.forEach((input)=> {
                        if(input.checked === true) { input.dataset.answer === data[currentIndexData - 1].correct_answer? rightAnswer++ : false ; }
                    });


                    // section.classList.add("hidden");
                    section.classList.add("hidden");
                    resultSection.classList.add("active");

                    // put all results information
                    let resultTitle = document.querySelector(".result .title");
                    let imgResult = document.querySelector(".result img");

                    if(rightAnswer == data.length) {
                        resultTitle.innerHTML = `<span>Full Mark</span> your result is ${rightAnswer} From ${data.length}`;
                        imgResult.src = "https://www.pngall.com/wp-content/uploads/8/Work-PNG-Image-File.png";
                    }
                    if(rightAnswer == (data.length / 2) || rightAnswer < data.length) {
                        resultTitle.innerHTML = `<span>Nice Work</span> your result is ${rightAnswer} From ${data.length}`;
                        imgResult.src = "https://cutewallpaper.org/24/good-job-png/job-4beaa-png-a68d3-amp-02473-svg-a144e-transparent-f1c0c-background-cbc4b-to-6b333-download.png";
                    }
                    if(rightAnswer < (data.length / 2)) {
                        resultTitle.innerHTML = `<span>Bad Work</span> your result is ${rightAnswer} From ${data.length}`;
                        imgResult.src = "https://cdn0.iconfinder.com/data/icons/dismissal-fill-outline/64/BAD-bad_work-negative_vote-thumbs_down-man-512.png";
                    }
                }
            }
        }
    }
    xhttp.open("GET", containQuestions, true);
    xhttp.send();
}



// function of answers
function addAllDataNow(data, bigLength) {
    let h2 = document.createElement("h2");
    h2.appendChild(document.createTextNode(data.title));
    titleQue.appendChild(h2);

    for (let i = 1; i < 4; i++){
        //add elements of contain every information
        let div = document.createElement("div");
        div.setAttribute("class", "answer");
        let input = document.createElement("input");
        // add all attributes for input id + name + type + dataset
        input.setAttribute("type", "radio");
        input.setAttribute("id", `answer_${i}`);
        input.setAttribute("name", "question");
        input.dataset.answer = data[`answer_${i}`]

        if(i == 1) input.checked = true;

        // to add label and for attribute
        let label = document.createElement("label");
        label.setAttribute("for", `answer_${i}`);
        label.appendChild(document.createTextNode(data[`answer_${i}`]))

        div.appendChild(input);
        div.appendChild(label);
        AnswersContainer.appendChild(div);
    }
}




// function interval
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    let timingInterval = setInterval(function () {

        NextButton.addEventListener('click', ()=> { clearInterval(timingInterval); })

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;


        if (--timer < 0) {
            timer = duration;
            clearInterval(timingInterval);
            NextButton.click();
        }

        questionCardsPage.forEach((card)=> {
            card.addEventListener('click', ()=> {
                clearInterval(timingInterval);
            })
        })
    }, 1000);
}


// function to remove data from content questions
function removeQuestion() {
    // stop CountDown of time
    // clearInterval(timingInterval);

    // delete all of old data to get the next
    let answers = document.querySelectorAll(".answers .answer");
    answers.forEach(answer=> answer.remove());
    document.querySelector("section .content .title h2").remove();
}

function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;

    }

    return array;
}



