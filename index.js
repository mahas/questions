let random_questions = true;
let show_screen_game_over = true;
let restart_points_at_start_a_game = true;

window.onload = function () {
  questions_base = readText("resources/questions.json");
  interpreter_bp = JSON.parse(questions_base);
  selectRandomQuestion();
};

let question;
let possible_answers;
corresponding_btn = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let nquestions = [];

let asked_questions = 0;
let right_questions = 0;

function selectRandomQuestion() {
  let n;
  if (random_questions) {
    n = Math.floor(Math.random() * interpreter_bp.length);
  } else {
    n = 0;
  }

  while (nquestions.includes(n)) {
    n++;
    if (n >= interpreter_bp.length) {
      n = 0;
    }
    if (nquestions.length == interpreter_bp.length) {
      //Restarting game
      if (show_screen_game_over) {
          if (right_questions >= 15){
        swal.fire({
          title: "Haribol! Amazing",
          text:
            "Score: " + right_questions + "/" + (asked_questions ),
          icon: "success"
        });}
        else {
            swal.fire({
                title: "Jiv Jago, sorry",
                text:
                  "Score: " + right_questions + "/" + (asked_questions ),
                icon: "error"
              }
        );}
      }
      if (restart_points_at_start_a_game) {
        right_questions = 0
        asked_questions = 0
      }
      nquestions = [];
    }
  }
  nquestions.push(n);
  asked_questions++;

  choosQuestion(n);
}

function choosQuestion(n) {
  question = interpreter_bp[n];
  select_id("category").innerHTML = question.category;
  select_id("question").innerHTML = question.question;
  select_id("number").innerHTML = n+1;
  let pc = right_questions;
  if (asked_questions > 1) {
    select_id("score").innerHTML = pc + "/" + (asked_questions - 1);
  } else {
    select_id("score").innerHTML = "";
  }

  style("image").objectFit = question.objectFit;
  disorderResponses(question);
  if (question.image) {
    select_id("image").setAttribute("src", question.image);
    style("image").height = "200px";
    style("image").width = "100%";
  } else {
    style("image").height = "0px";
    style("image").width = "0px";
    setTimeout(() => {
      select_id("image").setAttribute("src", "");
    }, 500);
  }
}

function disorderResponses(question) {
  possible_answers = [
    question.answer,
    question.wrong1,
    question.wrong2,
    question.wrong3,
  ];
  possible_answers.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = possible_answers[0];
  select_id("btn2").innerHTML = possible_answers[1];
  select_id("btn3").innerHTML = possible_answers[2];
  select_id("btn4").innerHTML = possible_answers[3];
}

let disable_buttons = false;

function push_btn(i) {
  if (disable_buttons) {
    return;
  }
  disable_buttons = true;
  if (possible_answers[i] == question.answer) {
    right_questions++;
    corresponding_btn[i].style.background = "lightgreen";
  } else {
    corresponding_btn[i].style.background = "pink";
  }
  for (let j = 0; j < 4; j++) {
    if (possible_answers[j] == question.answer) {
      corresponding_btn[j].style.background = "lightgreen";
      break;
    }
  }
  setTimeout(() => {
    restart();
    disable_buttons = false;
  }, 3000);
}

// let p = prompt("number")

function restart() {
  for (const btn of corresponding_btn) {
    btn.style.background = "white";
  }
  selectRandomQuestion();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(local_path) {
  var text = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", local_path, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    text = xmlhttp.responseText;
  }
  return text;
}
