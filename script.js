var app = new Vue({
  el: '#app',
  data: {
    number: '',
    current: {},
    questions: {},
    questions_json: {},
    page: 0,
    loading: true,
    menu: false,
    scoreboard: false,
    handle_questions_json: 0,
    picked: '',
    difficulty: 'easy',
    num_questions: '10',
    score: 0,
    scoring: 0,
    mistake: 0,
  },
  created: function() {
    this.menu = true;
  },
  watch: {
    handle_questions_json: function(value,oldvalue) {
      console.log('handle_questions')
      for (i = 0; i < this.questions_json.results.length; i++) {
	var result = this.questions_json.results[i];
	console.log(i);
	console.log(result.category);
	
	if (!(i in this.questions))
	  Vue.set(app.questions, i, new Array);
	answers = this.shuffle(result);
	correct_index = answers.indexOf(result.correct_answer);
	console.log(answers);
	this.questions[i].push({q:result.question, a:answers[0], b:answers[1], c:answers[2], d:answers[3], correct_a:result.correct_answer, index:correct_index});	
      }
      console.log(this.questions[0][0]);
      this.current = this.questions[0][0];
      this.loading = false;
    },
  },
  methods: {
    get_questions: function() {
      console.log('get_questions');
      this.menu = false;
      this.loading = true;
      if (this.num_questions > 50)
	this.num_questions = 50;
      var url = "https://opentdb.com/api.php?amount=" +this.num_questions+ "&category=15&difficulty=" + this.difficulty + "&type=multiple"; 

      fetch(url).then(response => {
	return response.json();
      }).then (json => {
	console.log(json);
	this.questions_json = json;
	this.handle_questions_json += 1;
	return true;
      }).catch(err => {
      }); 
    },
    shuffle: function (result) {
      var a = []
      for (i = 0; i < result.incorrect_answers.length; i++ ) {
	a.push(result.incorrect_answers[i]);
      }
      a.push(result.correct_answer);
      console.log(a);
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    },
    check_answer: function() {
      var letters = ['a','b','c','d'];
      if (letters.indexOf(this.picked) === this.current.index) {
	this.score += 1;
      }
      else {
	this.mistake += 1;
      }
      this.next_page();
    },
    next_page: function() {
      if (this.page < this.num_questions-1) {
        this.page += 1;
	this.update_current();
      }
      else {
	this.scoreboard = true;
	this.scoring = (this.score / this.num_questions) * 100;
      }
    },
    update_current: function() {
      this.current = this.questions[this.page][0];
    },
  }
});
