
//Vue für die linke Spalte in der die Witze stehen

var lustig = new Vue({
	el: ".witzspalte",
	data: {
		witze: [],
		token: null,
	},

	mounted: function(){

		//Speichert Token vom Benutzer


		this.$data.token = "Bearer "

				//this.$data.token = localStorage.getItem("token"); //hier Key von Amir einfügen!!
				this.$data.token += "eyJhbGciOiJIUzI1NiJ9.TGl0X2JveTY5.EM2R45WtYCgJrIe0zcNPg9yStoEsSwEHudxWA9NlaB8"; //noch meiner
				console.log(this.$data.token);

			},

			methods:{

				//Wenn ein Witz Positiv bewertet wird

				upvote(id){
					this.$http.get('https://legitjokes.herokuapp.com/api/vote?id=' + id + '&vote=up',
					{
						headers: {
							'Authorization': this.$data.token,
						}
					})
					.then(function(resp){

						//Um die Anzahl der Coins für einen User zu erhöhen für die Bewertung

						automat.$data.coins += 1;
						this.$http.get('https://legitjokes.herokuapp.com/api/user/coins?type=up',
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
					this.$http.get('https://legitjokes.herokuapp.com/api/vote?id=' + id + '&vote=down',
					{
						headers: {
							'Authorization': this.$data.token,

						}
					})
					.then(function(resp){
						
						//Um die Anzahl der Coins für einen User zu erhöhen für die Bewertung

						automat.$data.coins += 1;
						this.$http.get('https://legitjokes.herokuapp.com/api/user/coins?type=up',
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
		this.$http.get('https://legitjokes.herokuapp.com/api/categories')
		.then(function(resp) {
			this.$data.categories = resp.body.data;
		})
		.catch(function(err) {
			this.$data.random_witz = "Something went wrong: " + err
		})		
	},
	methods: {

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


			this.$http.get('https://legitjokes.herokuapp.com/api/joke?category=' + id )
			.then(function(resp) {


				lustig.$data.witze = resp.body.data;

			})
			.catch(function(resp){
				lustig.$data.witze = "Something went wrong: " + err
			})
		}

	}




})

//Vue für den Automaten auf der rechten Seite

var automat = new Vue({
	el: ".rechts",

	data: {
		zeit: 0,
		coins: 6, //anpassen
		random_witz: "Hallo user",
		rechteSeite: true,

		//coins = hier vom Server,
	},


	mounted: function(){
		
		//this.$data.coins = localStorage.getItem("coins"); //Coins von Amir

	},

	methods: {

		//Zufälliger Witz im Automaten wird von Datenbank ausgewählt

		zufall(){
			this.$data.zeit = 1;
			ruecksetzung();

      			//für unsere API:

      			this.$http.get('https://legitjokes.herokuapp.com/api/joke/random')
      			.then(function(resp) {
      				this.$data.random_witz = resp.body.data.Content


      	})

      			.catch(function(err) {
      				this.$data.random_witz = "Something went wrong: " + err
      			})		
      		}, 

      	}

      });



var timer;

//Der Timer für die Zeit in der der Automat seinen Hebel nach unten bewegt!

function ruecksetzung() {
	timer = setTimeout(change_back, 1300);
}

//Die Zeit wird zurück gesetz, damit der Automat sich nicht bewegt!

function change_back(){
	automat.$data.zeit = 0;
}

