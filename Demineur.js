'use strict';

class Cell {
    constructor(displayableValue) {
        this.isVisible = false;
        this.isFlaged = false;
        this.displayableValue = displayableValue;
    }

    toString() {
        if (this.isVisible) {
            if (this.value === 0) {
                return ''
            } else {
                return this.displayableValue;
            }

        } else if (this.isFlaged) {
            return '⚐';
        } else {
            return '';
        }
    };
}

export class Mine extends Cell {
    constructor() {
        super('ඞ');
    }
}

export class Num extends Cell {
    constructor(value) {
        super(value);
        this.value = value;
    }
}

class Demineur {

    constructor(x, y) {
        this.GRID_HEIGHT = parseInt(y);
        this.GRID_WIDTH = parseInt(x);
        this.NUMBER_FO_MINES = 0;
        this.Win = false;
        this.Defait = false;
        this.isGameOver = "";

        this.setGrid()

        for (let i = 0; i < (this.GRID_WIDTH); i++) {
            for (let j = 0; j < (this.GRID_HEIGHT); j++) {
                if (this.grid[i][j] === undefined) {
                    let valeur = this.detectNumbers(i, j)
                    this.grid[i][j] = new Num(valeur);
                }
            }
        }

    }

    setGrid() {
        this.NUMBER_FO_MINES = Math.floor((this.GRID_HEIGHT * this.GRID_WIDTH) / 10);

        this.grid = [...Array(this.GRID_WIDTH)].map(x => Array(this.GRID_HEIGHT));

        console.log(this.grid.length, this.grid[0].length, "x :", this.GRID_WIDTH, "y :", this.GRID_HEIGHT)

        for (let i = 0; i < (this.NUMBER_FO_MINES); i++) {
            let x = Math.floor(Math.random() * this.GRID_WIDTH);
            let y = Math.floor(Math.random() * this.GRID_HEIGHT);
            while (this.grid[x][y] !== undefined) {
                x = Math.floor(Math.random() * this.GRID_WIDTH);
                y = Math.floor(Math.random() * this.GRID_HEIGHT);
            }
            this.grid[x][y] = new Mine();
        }
    }

    detectNumbers(i, j) {
        let NumberValue = 0;
        /*
         if (x > 0 && y > 0 && x < this.GRID_WIDTH && y < this.GRID_HEIGHT) {
            let xs = [x, x - 1, x + 1]; //Les coordonées X des cases adjacentes
            let ys = [y, y - 1, y + 1]; //Les coordonées Y des cases adjacentes

            //Avec 2 for on combine nos deux tableaux
            for (let i of xs) {
                for (let j of ys) {
                    if (i >= 0 && j >= 0 && i <= this.GRID_WIDTH && j <= this.GRID_HEIGHT) {
                        if (this.grid[i][j] instanceof Mine) {
                            NumberValue++;
                        }
                    }

                }
            }
        } */

        if (((i + 1) < this.GRID_WIDTH) && (this.grid[i + 1][j] !== undefined)) {
            if ((this.grid[i + 1][j] instanceof Mine)) {
                NumberValue++;
            }
        }
        if (((i - 1) >= 0) && (this.grid[i - 1][j] !== undefined)) {
            if ((this.grid[i - 1][j] instanceof Mine)) {
                NumberValue++;
            }
        }
        if ((j + 1 < this.GRID_HEIGHT) && (this.grid[i][j + 1] !== undefined)) {
            if ((this.grid[i][j + 1] instanceof Mine)) {
                NumberValue++;
            }
        }
        if (((j - 1) >= 0) && (this.grid[i][j - 1] !== undefined)) {
            if ((this.grid[i][j - 1] instanceof Mine)) {
                NumberValue++;
            }
        }

        if (((((i + 1) < this.GRID_WIDTH) && (j - 1 >= 0))) && (this.grid[i + 1][j - 1] !== undefined)) {
            if (this.grid[i + 1][j - 1] instanceof Mine) {
                NumberValue++;
            }
        }
        if (((((i - 1) >= 0) && ((j + 1) < this.GRID_HEIGHT))) && (this.grid[i - 1][j + 1] !== undefined)) {
            if (this.grid[i - 1][j + 1] instanceof Mine) {
                NumberValue++;
            }
        }

        if (((((i + 1) < this.GRID_WIDTH) && (j + 1 < this.GRID_HEIGHT))) && (this.grid[i + 1][j + 1] !== undefined)) {
            if (this.grid[i + 1][j + 1] instanceof Mine) {
                NumberValue++;
            }
        }
        if (((((i - 1) >= 0) && ((j - 1) >= 0))) && (this.grid[i - 1][j - 1] !== undefined)) {
            if (this.grid[i - 1][j - 1] instanceof Mine) {
                NumberValue++;
            }

        }
        return NumberValue;
    }

    revealCells(grid, x, y) {
        if (x >= 0 && y >= 0 && x < this.GRID_WIDTH && y < this.GRID_HEIGHT && !grid[x][y].isVisible) {
            let cell = grid[x][y];
            if (!cell.isFlaged){
                cell.isVisible = true;
            }


            //Si cette case contient un 0, je vais afficher les cases adjacentes
            if (cell instanceof Num && cell.value === 0) {
                let xs = [x, x - 1, x + 1]; //Les coordonées X des cases adjacentes
                let ys = [y, y - 1, y + 1]; //Les coordonées Y des cases adjacentes

                //Avec 2 for on combine nos deux tableaux
                for (let i of xs) {
                    for (let j of ys) {
                        //On appel la fonction click sur toutes nos cases adjacentes
                        this.revealCells(grid, i, j);

                        //Note : ici on appel aussi click sur la case courante car ça simplifie l'algo
                        //Ce n'est pas gênant cet appel ne passera pas la première condition du
                        //!this.gridIsVisible[x][y]
                    }
                }

                // for(let i = x-1;i <= x+1; ++i) {}
            }
        }
    }

    //Methode display
    display() {
        //Pour chaque lignes
        this.grid.forEach((row) => {

            //On récupère les valeurs affichables de chaque cellules,
            //et on les join pour que ce soit plus joli
            //join(' ') ici transforme [1, 2, 3] en '1 2 3'
            var displayableRow = row
                .map((cell) => cell.toString())
                .join(' ');

            // let displayableRow = '';
            // row.forEach((cell) => displayableRow += cell.toString() + ' ')

            console.log(displayableRow);
        });

        //empty row
        console.log();
    };

    //Methode flag
    flag(x, y) {
        let cell = this.grid[x][y];

        if (cell.isVisible) {
            console.log('Action impossible, cellule déjà révélée');
        } else {
            cell.isFlaged = !cell.isFlaged;
        }
    }

    //Methode click
    click(x, y) {
        //Si la partie n'est pas finie
        //Si les coordonées sont valides (dans la grille)
        //et si la case n'est pas déjà visible (cette condition évite la récusion infinie)
        if (x >= 0 && y >= 0 && x < this.GRID_WIDTH && y < this.GRID_HEIGHT && !this.grid[x][y].isVisible) {
            if (this.grid[x][y].isFlaged) {
                return console.log('Action impossible, cette cellule a un flag');
            }

            this.revealCells(this.grid, x, y);

            //On regarde si on a gagnés
            if (this.grid[x][y] instanceof Mine) { // Si c'est une mine
                this.isGameOver = "defaite";
                this.Defait = true;
                this.grid.map((row) => row.map((nb) => nb instanceof Mine ? nb.isVisible = true : nb.Flaged = true ));

                console.log('You Lose !');
            } else { //Si ce n'est pas une mine

                //on regarde si toutes les cases non mines ont été révélées
                var nbVisibleCells = this.grid.reduce((res, row) => {
                    return row.reduce((res2, cell) => res2 + (cell.isVisible ? 1 : 0), res);
                }, 0);

                // let res = 0;
                // for (let row of this.grid) {
                //   for (let cell of row) {
                //     if (cell.isVisible) {
                //       res += 1;
                //     }
                //   }
                // }

                //Si le nombre de cases visibles est égale au nombre de cases de la grille moins le nombre de mines
                if (nbVisibleCells === this.GRID_WIDTH * this.GRID_HEIGHT - this.NUMBER_FO_MINES) {
                    this.isGameOver = 'victoire';
                    this.Win = true;
                    this.grid.map((row) => row.map((nb) => nb instanceof Mine ? (nb.isVisible = false, nb.isFlaged = true) : nb.isVisible = true));

                    console.log('You Win !');
                }
            }
        }
    }
}

//On expose la classe Demineur à require
export default Demineur;
