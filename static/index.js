class Question {
    constructor(question, correct_answer, incorrect_answers) {
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }
}

let questions = [];
let question_num;
let score = 0;

let time = 15;
let time_int;

function timer(){
    time--;
    if(time == 0){
        incorrect("You ran out of time!");
        clearInterval(time_int);
        time = 15;
        after_question();
    }
}

function get_question(){
    let options = {
        method: 'GET'
    }

    fetch('https://opentdb.com/api.php?amount=50&category=21&type=multiple', options)
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.results);
            if(data.result == false) {
                alert("Question could not be gotten");
            } else {
                for(i = 0; i < data.results.length; i++){
                    questions.push(new Question(data.results[i].question, 
                        data.results[i].correct_answer, data.results[i].incorrect_answers));
                }
                question_num = 0;
                update_question();
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function update_question(){
    let answers = [questions[question_num].correct_answer, ...questions[question_num].incorrect_answers];
    answers = answers.sort(() => Math.random() - 0.5);

    document.getElementById("q").innerHTML = questions[question_num].question;
    document.getElementById("a0").innerHTML = answers[0];
    document.getElementById("a1").innerHTML = answers[1];
    document.getElementById("a2").innerHTML = answers[2];
    document.getElementById("a3").innerHTML = answers[3];
}

function start(){
    if(questions.length == 0) {
        get_question();
    }
    document.getElementById("quiz").style.display = "block";
    document.getElementById("start").style.display = "none";
    time_int = setInterval(timer, 1000);
}

function decode_HTML(str){
    var element = document.createElement('div');
    element.innerHTML = str;
    return element.textContent || element.innerText;
}

function select(id){
    let selected_answer = document.getElementById(id).innerHTML;
    let correct_answer = decode_HTML(questions[question_num].correct_answer);
    console.log(selected_answer === correct_answer);
    console.log(selected_answer + ", " + correct_answer)

    clearInterval(time_int);
    time = 15;

    if (selected_answer === correct_answer) {
        correct();
    } else {
        incorrect("Incorrect! The answer was \"" + correct_answer + "\"");
    }
    after_question();
}

function after_question(){
    question_num++;
    if (question_num < questions.length) {
        update_question();
    } else {
        get_question();
    }
}

function next_question(){
    document.getElementById("body").style.backgroundColor = "#f0f0f0";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("correct").style.display = "none";
    document.getElementById("incorrect").style.display = "none";
    time_int = setInterval(timer, 1000);
}

function play_again(){
    score = 0;
    document.getElementById("score").innerHTML = score;
    document.getElementById('leaderboard').style.display = "none";
    next_question();
}

function incorrect(text){
    document.getElementById("body").style.backgroundColor = "red";
    document.getElementById("final_score").innerHTML = score;
    document.getElementById("end_text").innerHTML = text;
    document.getElementById("quiz").style.display = "none";
    document.getElementById("incorrect").style.display = "block";
}

function correct(){
    score++;
    document.getElementById("points").innerHTML = 1;
    document.getElementById("score").innerHTML = score;
    document.getElementById("current_score").innerHTML = score;
    document.getElementById("quiz").style.display = "none";
    document.getElementById("correct").style.display = "block";
    document.getElementById("body").style.backgroundColor = "#4CAF50";
}

function submit_score_helper(){
    let name = document.getElementById("name").value;
    name.trim();
    if(name === '') {
        alert("YOU MUST INPUT A NAME!!!");
        return;
    }
    submit_score(name);
}

function submit_score(name){
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: name, score: score})
    }

    fetch('http://localhost:5000/submit_score', options)
    .then(response => {
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        display_leaderboard(data);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

function display_leaderboard(data){
    html = "<table><tr><th>Place</th><th>Name</th><th>Score</th></tr>"

    for(i = 0; i < data.length; i++) {
        html += `<tr><td>${i+1}</td><td>${data[i].name}</td><td>${data[i].score}</td></tr>`;
    }

    html += "</table>";
    document.getElementById('incorrect').style.display = "none";
    document.getElementById('leaderboard_table').innerHTML = html;
    document.getElementById('leaderboard').style.display = "block";
}