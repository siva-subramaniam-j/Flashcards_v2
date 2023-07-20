const datastore= new Vuex.Store({
    state:{
        decks:[],
        cards:[],
        user_id:current_user_id,
    },
    actions:{deck_fetch:function(){
        console.log("mounted")
        fetch('/api/get/deck/'+this.user_id)
        .then(response=> response.json())
        .then(data=>{
            this.decks=data
        })}

    }
})



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
            <td><router-link :to="'/edit/'+deck.deck_id"><button class="button1">Edit</button></router-link> <button class="button1" v-on:click="delete_deck(deck.deck_id)" > Delete </button> <router-link to="/review"><button class="button1">Review</button></router-link></td>
            
        </tr>
        
    </table>
    <router-link to="/add_deck"><button class="button button1" >Add deck</button>"</router-link>
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
            <th>Last review Score</th>
            <th>Last review time</th>
            <th>Actions</th>

        </tr>
         
        <tr v-for="card in cards" :key="card.card_id">
            
            <td>{{card.front}}</td>
            <td>{{card.score}}</td>
            <td>{{card.time}}</td>
            <td><router-link :to="'/edit/'+card.card_id"><button class="button1">Edit</button></router-link> <button class="button1" v-on:click="delete_deck(card.card_id)" > Delete </button></td> 
         
        </tr>
    </table>
    <router-link to="/add_card"><button class="button button1" >Add Card</button>"</router-link>

        
    </div>
    `,
    data:function(){
        return{
            deck_id:this.id,
            deck:[],
            cards:[],
            


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
        })}
        

    
})

const Add_card = Vue.component('Add_card',{
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

        </div>
    </div>
    `,


})















const routes = [
    {path: '/',component: Dashboard,props:{User:'Siva'},},
    {path:'/add_deck',component: Add_deck, name:'add_deck'},
    {path:'/edit/:id',component: Edit_deck, props:true},
    {path:'/add_card',component: Add_card}
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










const Edit_card= new Vue.component('Edit_card',{
    template:`<div>
    <h1>Add Card</h1>
        <div>
            <label for="card_front">Front of Card:</label><input type="text" id="front" v-model="front" />
            <br>
            <br>
            <label for="card_back">Back of Card:</label><input type="text" id="back" v-model="back" />
            <br>
            <button v-on:click="addcard" class="button button1">Add Card</button>
            <router-link :to="'/edit'+deck_id"><button class="button button1" >Back</button></router-link>
        </div>
    </div>`,
    mounted:function(){
        fetch('/api/cards/get/'+this.card_id)
        .then(response=>response.json())
        .then(data=>{
            this.cards=data
        })
        

    }
})



{path:'/edit/card/:card_id',component: Edit_card, props:true}