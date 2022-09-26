// change mode with button up
let ButtonMode = document.getElementById("mode-btn");
ButtonMode.addEventListener('click', () => {
    document.body.classList.toggle("darkMode");
})



// variables of all app
getQueses();

let numberOf = document.querySelector(".number");
let titleQue = document.querySelector("section .content .title");
let AnswersContainer = document.querySelector("section .content .answers");
let NextButton = document.getElementById("nxt-button");
let buttonSound = new Audio("./assets/audios/buttonSound.mp3");



// app option key
let currentIndexData = 1;
let rightAnswer = 0;
var MinutesDown = 60 * 1.5;


// get questions from ajax
function getQueses() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(xhttp.readyState == 4 && xhttp.status == 200) {
            let data = JSON.parse(this.responseText);
            // console.log(data);
            //give number of length
            numberOf.innerHTML = `<span>${currentIndexData}</span> From ${data.length}`;
            addAllDataNow(data[currentIndexData - 1], data.length);

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
                        if(input.checked === true) { input.dataset.answer === data[currentIndexData - 1].correct_answer? rightAnswer++ : false ; }
                    });

                    // delete all of old data to get the next
                    let answers = document.querySelectorAll(".answers .answer");
                    answers.forEach(answer=> answer.remove());
                    document.querySelector("section .content .title h2").remove();

                    //addation for currentIndex to get another data from json
                    currentIndexData++;

                    numberOf.innerHTML = `<span>${currentIndexData}</span> From ${data.length}`;

                    // add the function of adding the elements
                    addAllDataNow(data[currentIndexData - 1], data.length);

                    // active interval with click
                    let time = document.querySelector(".info .time");
                    startTimer(MinutesDown, time);
                } else {
                    //check if the right answer with last answer
                    let checkInput = document.querySelectorAll(".answers .answer input");
                    checkInput.forEach((input)=> {
                        if(input.checked === true) { input.dataset.answer === data[currentIndexData - 1].correct_answer? rightAnswer++ : false ; }
                    });

                    let section = document.querySelector("section");
                    section.classList.add("hidden");
                    let resultSection = document.querySelector(".result");
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
    xhttp.open("GET", "./jsonQuestions/html_question.json", true);
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
    }, 1000);
}
