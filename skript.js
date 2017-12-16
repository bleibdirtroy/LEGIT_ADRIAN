
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
		switching(){
			automat.$data.rechteSeite = false;
			this.$data.rechteSeite = false;

		},
		back_switching(){
			automat.$data.rechteSeite = true;
			this.$data.rechteSeite = true;


		},

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



var automat = new Vue({
	el: ".rechts",

	data: {
		zeit: 0,
		coins: 6,
		random_witz: "Hallo user",
		rechteSeite: true,
		category_select: []


		//coins = hier vom Server,
	},
	mounted: function(){
		this.$data.category_select = category.$data.cate;
		//this.$data.coins = localStorage.getItem("coins"); //Coins von Amir

	},

	methods: {

		zufall(){
			this.$data.zeit = 1;
			ruecksetzung();

      			//für unsere API:

      			this.$http.get('https://legitjokes.herokuapp.com/api/joke/random')
      			.then(function(resp) {
      				this.$data.random_witz = resp.body.data.Content

      		//this.$data.random_witz = resp.body.data.Content

      	})

      			.catch(function(err) {
      				this.$data.random_witz = "Something went wrong: " + err
      			})		
      		}, 

      	}

      });

var timer;

function ruecksetzung() {
	timer = setTimeout(change_back, 1300);
}

function change_back(){
	veraenderung.$data.zeit = 0;
}

