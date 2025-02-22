class Question {
    constructor(question, correct_answer, incorrect_answers) {
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }
}

let questions = [];
let questionNum = 0;

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
    document.getElementById("q").innerHTML = questions[questionNum].question;
    document.getElementById("a1").innerHTML = questions[questionNum].correct_answer;
    document.getElementById("a2").innerHTML = questions[questionNum].incorrect_answers[0];
    document.getElementById("a3").innerHTML = questions[questionNum].incorrect_answers[1];
    document.getElementById("a4").innerHTML = questions[questionNum].incorrect_answers[2];
}

function start(){
    
}