var categries_link = 'https://legitjokes.herokuapp.com/api//categories';
var random_joke_link = 'https://legitjokes.herokuapp.com/api/joke/random';
var joke_in_category_link = 'https://legitjokes.herokuapp.com/api/joke?category='; //missing: example_category
var submit_joke_link = 'https://legitjokes.herokuapp.com/api//joke/submit'; //missig: examplejoke$category=example_category
var joke_vote_link = 'https://legitjokes.herokuapp.com/api/vote?id='; //missing: example_id(&vote=up or &vote=down)
var change_coins_link = 'https://legitjokes.herokuapp.com/api/user/coins?type='; //missing: up or down


//Vue für die linke Spalte in der die Witze stehen

var lustig = new Vue({
	el: ".witzspalte",
	data: {
		witze: [],
		token: null,
		active: true,
	},

	mounted: function(){

		//Speichert Token vom Benutzer


		this.$data.token = "Bearer "

				//this.$data.token = sessionStorage.getItem("token"); //hier Key von Amir einfügen!!
				this.$data.token += "eyJhbGciOiJIUzI1NiJ9.TGl0X2JveTY5.EM2R45WtYCgJrIe0zcNPg9yStoEsSwEHudxWA9NlaB8"; //noch meiner
				console.log(this.$data.token);

			},

			methods:{

				//Wenn ein Witz Positiv bewertet wird

				upvote(id){
					this.$http.get(joke_vote_link + id + '&vote=up',
					{
						headers: {
							'Authorization': this.$data.token,
						}
					})
					.then(function(resp){

						//Um die Anzahl der Coins für einen User zu erhöhen für die Bewertung

						automat.$data.coins += 1;
						this.$http.get(change_coins_link + 'up',
						{
							headers: {
								'Authorization': this.$data.token,

							}
						})
						.then(function(resp){
							console.log(resp);
						})
						.catch(function(err){
							console.log("FEHLER in coins");
						})


						console.log(resp);
					})
					.catch(function(err){
						console.log(err);
						console.log("fehler in upvote");
					})

				},

				//Wenn der Witz negativ bewertet wird

				downvote(id){
					this.$http.get(joke_vote_link + id + '&vote=down',
					{
						headers: {
							'Authorization': this.$data.token,

						}
					})
					.then(function(resp){
						
						//Um die Anzahl der Coins für einen User zu erhöhen für die Bewertung

						automat.$data.coins += 1;
						this.$http.get(change_coins_link + 'up',
						{
							headers: {
								'Authorization': this.$data.token,

							}
						})
						.then(function(resp){
							console.log(resp);
						})
						.catch(function(err){
							console.log("FEHLER in coins");
						})


						console.log(resp);
					})
					.catch(function(err){
						console.log(err);
						console.log("fehler downvote");
					})
				},	
			},			
		})


//Vue für die Navigationsleiste

var category = new Vue({
	el: ".navigation",

	data: {
		categories: [], //Array mit den JSON daten von den Kategorien
		rechteSeite: true,
	},

	//Kategorien werden vom Datenbank geladen

	mounted: function() {
		this.$http.get(categries_link)
		.then(function(resp) {
			this.$data.categories = resp.body.data;
			automat.$data.categories = resp.body.data;
		})
		.catch(function(err) {
			this.$data.random_witz = "Something went wrong: " + err
		})		
	},
	methods: {

		show_us(){
			lustig.$data.active = true;
		},

		//Wechsel zum Feld "Witz schreiben" auf der Rechten seite beim Klick auf den Button in der Menüleiste

		switching(){
			automat.$data.rechteSeite = false;
			this.$data.rechteSeite = false;

		},

		//Wechsel zurück auf den Automaten durck Klicken auf den Button in der Menüleiste

		back_switching(){
			automat.$data.rechteSeite = true;
			this.$data.rechteSeite = true;


		},

		//Wechselt in die jeweilige Kategorie druch klicken auf das entsprechende Feld!

		wechsel(id){


			this.$http.get(joke_in_category_link + id )
			.then(function(resp) {

				lustig.$data.witze = resp.body.data;
				lustig.$data.active = false;

			})
			.catch(function(resp){
				lustig.$data.witze = "Something went wrong: " + err
			})
		}

	}




})

//Vue für den Automaten und Textfeld auf der rechten Seite

var automat = new Vue({
	el: ".rechts",

	data: {
		zeit: 0,
		coins: 0, //anpassen
		random_witz: "Schau in einen Spiegel, da kannst du auch lachen",
		rechteSeite: true,
		categories: [],
		joke: "",
		selected_category: "Kategorie auswählen",
		//coins = hier vom Server,
	},


	mounted: function(){

		this.$data.coins =  3;//sessionStorage.getItem("coins"); //Coins von Amir

	},

	methods: {

		//Zufälliger Witz im Automaten wird von Datenbank ausgewählt


		zufall(){
			//movement of the machine
			this.$data.zeit = 1;

			if(this.$data.coins == 1){
				ruecksetzung_short();
			} else {
				ruecksetzung_long();
			}
			

			//check if the user has enough coins
			if(this.$data.coins > 0){

				this.$http.get(random_joke_link)
				.then(function(resp) {
      				//show the joke on the screen
      				this.$data.random_witz = resp.body.data.Content
      				//decrease coin on screen
      				this.$data.coins -= 1;
      				//decrease coin in database
      				this.$http.get(change_coins_link + 'down',{
      					headers: {
      						'Authorization': lustig.$data.token,
      					}
      				})
					//sessionStorage.setItem('coins', 'this.$data.coins');
				})

				//Failure
				.catch(function(err) {
					this.$data.random_witz = "Something went wrong: " + err
				})		
			}
		},

		submit_joke(){

			if(this.selected_category == "Kategorie auswählen"){
				this.selected_category = "opa";

			}
			else {
				this.$http.post(submit_joke_link,
					{
						content: this.$data.joke,
						category: this.$data.selected_category,

					},
      					headers: {
      						'Authorization': lustig.$data.token,
      					}
      				)


			}


		},
	}

});




//var FormSpellingValid = $Spelling.SpellCheckSuggest("textrea1,textarea2,textinput1") // true or false

var timer;

//Der Timer für die Zeit in der der Automat seinen Hebel nach unten bewegt!

function ruecksetzung_long() {
	timer = setTimeout(change_back, 1300);
}

function ruecksetzung_short() {
	timer = setTimeout(change_back, 1000);
}

//Die Zeit wird zurück gesetz, damit der Automat sich nicht bewegt!

function change_back(){
	automat.$data.zeit = 0;
}