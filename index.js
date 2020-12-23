//On require la classe Demineur
import Demineur, {Mine, Num} from './Demineur.js';


const start = new Vue({
    el:'#start',
    data:{
        width: 5,
        height: 5,
        start: false,
        Win: false,
        Defait: false,
        demineur: undefined,
    },

    methods:{
        start_game: function(x,y){
            if (x > 0 && y > 0){
                this.start = true;
                console.log(x);
                console.log(y);
                this.demineur = new Demineur(x, y);
                this.grid = this.demineur.grid;
                this.Win = this.demineur.Win;
                this.Defait = this.demineur.Defait;
                this.nbrMine = this.demineur.NUMBER_FO_MINES;
                return false;
            }else{
                return true;
            }

        },

        condition_over: function(){
            this.Win;
            this.Defait;
            return !this.Win && !this.Defait;
        },

        clicks: function (x, y, e) {
            if (this.condition_over() === true){
                e.preventDefault()
                this.demineur.click(x, y);
                this.Defait = this.demineur.Defait;
                this.Win = this.demineur.Win;
            }

        },
        flags: function (x, y, e) {
            e.preventDefault();
            if (this.condition_over() === true) {
                this.demineur.flag(x, y);
            }
        },
    },

})


