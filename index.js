class Question {
    constructor(question, correct_answer, incorrect_answers) {
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }
}

let questions = [];
let question_num = 0;
let correct = 0;
let score = 0;

function get_question() {
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
    get_question();
    document.getElementById("quiz").style.display = "block";
    document.getElementById("start").style.display = "none";
}

function select(id){
    let selected_answer = document.getElementById(id).innerHTML;
    let correct_answer = questions[question_num].correct_answer;

    if (selected_answer === correct_answer) {
        correct++;
        score += 1;
        document.getElementById("score").innerHTML = score;
        alert("Correct!");
    } else {
        alert("Incorrect!");
    }

    question_num++;
    if (question_num < questions.length) {
        update_question();
    }
}