
const Dashboard = Vue.component('dashboard',{
    
    template:`
    <div>
    <br>
    <br>
    <table>
        <tr>
            <th>Deck</th>
            <th>Description</th>
            <th>Last review Score</th>
            <th>Average review Score</th>
            <th>Last review time</th>
            <th>Actions</th>
        </tr>
        <tr v-for="deck in deck" :key="deck.deck_name" >
            <td>{{deck.deck_name}}</td>
            <td>{{deck["deck_description"]}}</td>
            <td>{{deck["score"]}}</td>
            <td>{{deck["avg_score"]}}</td>
            <td>{{deck["time"]}}</td>
            <td><router-link :to="'/edit/'+deck.deck_id"><button class="button1">Edit</button></router-link> <button class="button1" v-on:click="delete_deck(deck.deck_id)" > Delete </button> <router-link :to="'/review/'+deck.deck_name+'/'+deck.deck_id"><button class="button1">Review</button></router-link></td>
            </tr>
    </table>
    <router-link to="/add_deck"><button class="button button1" >Add deck</button></router-link>
    </div>`
    
,

data: function() {
    return {
        deck:[],
        user_id:current_user_id,
        refresh_key:0
        
    }
},
mounted:function(){
    console.log("mounted")
    fetch('/api/get/deck/'+this.user_id)
    .then(response=> response.json())
    .then(data=>{
        this.deck=data
    })},
methods:{
    refresh:function(){
        console.log("mounted")
        fetch('/api/deck/get/'+this.user_id)
        .then(response=> response.json())
        .then(data=>{
            this.deck=data
        })},
    delete_deck:function(deck_id){
        
        fetch('/api/deck/delete/'+deck_id,{
            method:'DELETE'
        }).then(response=>{if (!response.ok){alert('Couldnt delete deck');return response.json()}})
        .then(data=>{
            location.reload()
        })
        .catch(error=>{
            alert(error)
        })
        
        

    }
}
})



const Add_deck = Vue.component('Add_deck',{
    template:`
    <div>
    <h1>Add Deck</h1>
        <div>
            <label for="deck_name">Enter_name of deck</label><br>
            <input type="text" id="deck_name" v-model="deck_name" />
            <br>
            <br>
            <label for="deck_description">Description of deck</label><br>
            <input type="text" id="deck_description" v-model="deck_description" />
            <br>
            <button v-on:click="test" class="button button1">Add Deck</button>

        </div>
    </div>
    `
,
data:function(){
    return{
        deck_description:null,
        deck_name:null,

    }
},
methods:{
    test:function(){
        fetch('/api/deck/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                        "deck_name": this.deck_name,
                        "deck_description": this.deck_description
                    }),
                })
                .then(response=>response.json())
                .then(data=>{
                    if(Object.keys(data).length===0){
                        alert("Code:201\nMessage:Deck Added Successfully")
                    }
                    else{
                        if (data.message){
                            alert("Code:"+data.message.code+"\nMessage:-"+data.message.message+"")}
                        }
                    
                })
            
            }
    }
})


const Edit_deck = Vue.component('Edit_deck',{
    props:['id'],
    template:`
    <div>
    <div><h2>Name of the Deck: {{deck.deck_name}}</h2></div>
    <div><h2>Description of deck:{{deck.deck_description}}</h2></div>
    <table>
        <tr>
            
            <th>card</th>
            <th>Answer</th>
            <th>Last review Score</th>
            <th>Last review time</th>
            <th>Actions</th>

        </tr>
         
        <tr v-for="card in cards" :key="card.card_id">
            
            <td>{{card.front}}</td>
            <td>{{card.back}}</td>
            <td>{{card.score}}</td>
            <td>{{card.time}}</td>
            <td><router-link :to="'/edit/card/'+deck_id+'/'+card.card_id"><button class="button1">Edit</button></router-link> <button class="button1" v-on:click="delete_card(card.card_id)" > Delete </button></td> 
         
        </tr>
    </table>
    <router-link :to="'/add_card/'+deck_id"><button class="button button1" >Add Card</button></router-link>
    

        
    </div>
    `,
    data:function(){
        return{
            deck_id:this.id,
            deck:[],
            cards:[],
            check_var:98
            


        }
    },
    
    mounted:function(){
        console.log("mounted")
        fetch('/api/deck/get/'+this.deck_id)
        .then(response=> response.json())
        .then(data=>{
            this.deck=data
        
        fetch('/api/cards/get/'+this.deck_id)
        .then(response=>response.json())
        .then(data=>{
            this.cards=data
        })
        })},
    methods:{
        delete_card:function(card_id){
            fetch('/api/cards/delete/'+card_id,{
                method:'DELETE'
            }).then(response=>{if (!response.ok){alert('Couldnt delete deck');return response.json()}})
            .then(data=>{
                location.reload()
            })
            .catch(error=>{
                alert(error)
            })

        }

    }
        

    
})

const Add_card = Vue.component('Add_card',{
    props:["deck_id"],
    template:`
    <div>
    <h1>Add Card</h1>
        <div>
            <label for="card_front">Front of Card:</label><input type="text" id="front" v-model="front" />
            <br>
            <br>
            <label for="card_back">Back of Card:</label><input type="text" id="back" v-model="back" />
            <br>
            <button v-on:click="addcard" class="button button1">Add Card</button>
            <router-link :to="'/edit/'+deck_id"><button class="button button1" >Back</button></router-link>
        </div>
    </div>
    `,
    data:function(){
        return{
            deckid:this.deck_id,
            front:null,
            back:null,
        }
    },
    watch:{
        front:function(){
            this.front=this.front
        },
        back:function(){
            this.back=this.back
        }
    },
    methods:{
        addcard:function(){
            fetch('/api/cards/post', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                            "deck_id": this.deckid,
                            "front": this.front,
                            "back":this.back,
                            })
                        })
                        .then(response=>response.json())
                        .then(data=>{
                            if(Object.keys(data).length===0){
                                alert("Code:201\nMessage:Card Added Successfully")
                            }
                            else{
                                if (data.message){
                                    alert("Code:"+data.message.code+"\nMessage:-"+data.message.message+"")}
                                }
                            
                        })
                        this.front=null
                        this.back=null

        }
    }
})

const Edit_card= Vue.component('Edit_card',{
    props:['card_id','deck_id'],
    template:`<div>
    <h1>Edit Card</h1>
        <div>
            <label for="card_front">Front of Card:</label><input type="text" id="front" v-model="frontside" />
            <br>
            <br>
            <label for="card_back">Back of Card:</label><input type="text" id="back" v-model="backside" />
            <br>
            <button v-on:click="updatecard"  class="button button1">Save Card</button>
            <router-link :to="'/edit/'+deck_id"><button class="button button1" >Back</button></router-link>
        </div>
    </div>`,
    data:function(){
        return{
            frontside:null,
            backside:null,

        }
    },
    methods:{
        updatecard:function(){
            fetch('/api/cards/put',{
                
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                        "card_id": this.card_id,
                        "front": this.frontside,
                        "back":this.backside,
                        })
            })
            .then(response=>response.json())
            .then(data=>{
                if(Object.keys(data).length===0){
                    alert("Code:201\nMessage:Card Updated Successfully")
                }
                else{
                    if (data.message){
                        alert("Code:"+data.message.code+"\nMessage:-"+data.message.message+"")}
                    }
            })

        }
    },
    mounted:function(){
        fetch('/api/get/card/'+this.card_id)
        .then(response=>response.json())
        .then(data=>{
            this.card=data
            this.frontside=data.front
            this.backside=data.back
        })
        

    },

})

const Review = Vue.component('Review',{
    props:['deck_id','deck_name'],
    template:`
    <div>
          <h1 id=carddeckname>{{deck_name}} </h1>
      
      <div class="container">
          <div class="card" v-on:click="flip">
            <div class="front">
              <h1>{{cards[0].front}}</h1>
              
            </div>
            <div class="back">
              <h1>{{cards[0].back}}</h1>
            </div>
          </div>
        </div>
        <form @submit.prevent="next">
          <input type="text" style="display: none;" value="49" name="card_id">
          <input type="radio" v-model="difficulty" value="easy" checked="">
          <label>Easy</label>
          <input type="radio" v-model="difficulty" value="medium">
          <label>Medium</label>
          <input type="radio" v-model="difficulty" value="hard">
          <label>Hard</label>
          <input style="background-color: lightgreen;" id="nextbutton" type="submit" value="Next">
      </form>

      </div>
 
      </div>`,
      data:function(){
          return{
              cardfro:'hi',
              cards:[],
              difficulty:'easy',
              deck_score:0
            }
      },
    watch:{
        cards:function(){
            if (this.cards.length===0){
                console.log("yes")
                this.$router.push('/reviewcomplete')
                fetch('/api/deck/put',{
                    method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                "deck_id":this.deck_id,
                "score":this.deck_score

                })
            })
            .then(response=>response.json())
            .then(data=>{
            if(Object.keys(data).length!=0){
                if (data.message){
                    alert("Code:"+data.message.code+"\nMessage:-"+data.message.message+"")}
                }
        })
    }

    }},
  methods:{
      flip:function(event){
       
            var element = event.currentTarget;
            if (element.className === "card") {
            if(element.style.transform == "rotateY(180deg)") {
              element.style.transform = "rotateY(0deg)";
            }
            else {
              element.style.transform = "rotateY(180deg)";
            }
          }
        
      },
    next:function(){
        
        var score=0;
        console.log(this.difficulty)
        if (this.difficulty==='easy'){
            score=15;
            }
        if(this.difficulty==='medium'){
            score=10;
        }
        if(this.difficulty==='hard'){
            score=5;
        }
        this.deck_score+=score
        console.log(score)
        fetch('/api/put/card_score',{
                
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                "card_id": this.cards[0].card_id,
                "score":score
                })
    })
    .then(response=>response.json())
    .then(data=>{
        if(Object.keys(data).length!=0){
            if (data.message){
                alert("Code:"+data.message.code+"\nMessage:-"+data.message.message+"")}
            }
    })
    this.cards.splice(0, 1)
  
    }
 
  },
  created:function(){
    fetch('/api/cards/get/'+this.deck_id)
    .then(response=>{
        if (!response.ok){
            this.$router.push('/nocards')
        }
        else{ return response.json()}})
    .then(data=>{
        this.cards=data
    })
  }
    })

const Nocards=Vue.component('Nocards',{
    template:`
    <div>
    <h1>No cards found in the deck</h1>
    <h2>Add cards to the deck</h2>

    <router-link to="/"><button class="button button1" >Go To Home</button></router-link>
    </div>
    `
})

const Reviewcomplete=Vue.component('Reviewcomplete',{
    template:`
    <div>
    <h1>Deck Review Complete</h1>

    <router-link to="/"><button class="button button1" >Go To Home</button></router-link>
    </div>`
})

const routes = [
    {path: '/',component: Dashboard,props:{User:'Siva'}},
    {path:'/add_deck',component: Add_deck, name:'add_deck'},
    {path:'/edit/:id',component: Edit_deck, props:true},
    {path:'/add_card/:deck_id',component: Add_card, props:true},
    {path:'/edit/card/:deck_id/:card_id',component: Edit_card, props:true},
    {path:'/review/:deck_name/:deck_id',component: Review,props:true},
    {path:'/reviewcomplete',component:Reviewcomplete},
    {path:'/nocards',component:Nocards}

]

const router = new VueRouter({
    routes // short for `routes: routes`
  })

var app = new Vue({
    el: '#app',
    router: router,
    data: {
        grand_total: 0,
        User:'siva',
        
    },
    methods: {
        add_grand_total: function() {
            console.log("in grand_total");
            this.grand_total = this.grand_total + 1;
        }
    }

})