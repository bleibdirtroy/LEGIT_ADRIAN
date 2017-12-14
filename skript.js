
		var lustig = new Vue({
			el: ".witzspalte",
			data: {
				witze: [],
			},
			mounted: function() {

				this.$http.get('https://legitjokes.herokuapp.com/api/joke?category=1')
				.then(function(resp) {
					this.$data.witze = resp.body.data;

				})
				.catch(function(resp){
					this.$data.witze = "Something went wrong: " + err
				})



			}



		})

		var category = new Vue({
			el: ".navigation",

			data: {
				categories: [],
				cate:[],
				rechteSeite: true,
			},


			mounted: function() {
				this.$http.get('https://legitjokes.herokuapp.com/api/categories')
				.then(function(resp) {
					this.$data.categories = resp.body.data;
					for (var i of this.$data.categories) {
						this.$data.cate.push({Name: i.Category,ID: i.CategoryID});  

					}
				})
				.catch(function(err) {
					this.$data.random_witz = "Something went wrong: " + err
				})		
			},
			methods: {
				switching(){
					veraenderung.$data.rechteSeite = false;
					this.$data.rechteSeite = false;
					
				},
				back_switching(){
					veraenderung.$data.rechteSeite = true;
					this.$data.rechteSeite = true;


				},

				wechsel(id){
					
				console.log(id)
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



		var veraenderung = new Vue({
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

