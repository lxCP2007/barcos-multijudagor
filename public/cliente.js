document.addEventListener('DOMContentLoaded', () => {
/*Nota el querySelector es un metodo para ubiccar elementos, sin envargo aplica sin importar si es una clase, un id, 
tambien permite buscar un elemento especifico que este dentro de in id sin necesidad de que ese elemento tenga id */
    const userGrid = document.querySelector('.grid-user');
    const cpuGrid = document.querySelector('.grid-cpu');
    const displayGrid = document.querySelector('.grid-display');

    const ships = document.querySelectorAll('.ship');

    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const crusier = document.querySelector('.crusier-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');

    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#turn');
    const infoDisplay = document.querySelector('#info');

    const setupButtons = document.getElementById('setup-buttons');

    const width = 10;
    const userSquares = [];
    const cpuSquares = [];

    let isGameOver = false;
    let ready = false;
    let enemyReady = false;
    let allShipsPlaced = false;
    let playerNum = 0;
    let hotsFired = -1;
    let currentPlayer = 'user';
    let isHorizontal = true;

    const shipsArrray = [
        {
            name: 'destroyer',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: 'crusier',
            directions: [
                [0, 1, 2],
                [0, width, width * 2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width * 2, width * 3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4 ],
                [0, width, width * 2, width * 3, width * 4]
            ]
        }
    ];
        createBoard(userGrid, userSquares);
        createBoard(cpuGrid, cpuSquares);

        if (gameMode === 'singlePlayer'){
            startSingleplayer();
        }else{
            startMultiplayer();
        }

//Data set es un medio de poner cualqueir cosa que se desee a un elemento, en este caso se usa para sobreescribir el id
    function createBoard(grid, square) {
        for (let i = 0; i < width * width; i++){
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            square.push(square);
        }
    }

    function startSingleplayer(){
    }

    function generar(ship){ 
        let randomDirection = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDirection];
        if (randomDirection === 0) directions = 1;
        if (randomDirection === 0) directions = 10;

        const isTaken = current.some(index => cpuSquares[index].
            classList.contains('taken'));

            const isAtRightEdge = current.some( index => (index) % width === width -1);
            const isAtLeftEdge = current.some( index => (index) % width === width -0);
    }
/* puesto por el MC fuera de camara*/

    function playGameSingle(){
        if (isGameOver) return
        if (currentPlayer === 'user') {
            turnDisplay.innerHTML = 'Tu turno'
            computerSquare.forEach(square => square.addEventListener ('click', function(e) {
                shotFire = square.dataset.id
                revealSquare(square.classList)
            }));
        }
        if (currentPlayer === 'enemy') {
            turnDisplay.innerHTML = 'Turno enemigo'
            setTimeout(enemiGo, 1000)
        }
    }
    
   function startMultiplayer() {
        const socket = io();

    socket.on('player-number', num => {
        if (num === -1) {
            infoDisplay.innerHTML = 'Servidor lleno';
        } else {
            playerNum = parseInt(num);
        if (playerNum === 1) currentPlayer = "enemy";

        console.log(playerNum);

        socket.emit('check-players');
        }
    })

    socket.on('player-connection', num => {
        console.log(`Jugador ${num} se ha conectado`);

        playerisConnected(num);
    });

    socket.on('enemy-ready', num => {
        enemyReady = true;
        playerReady(num);
    });

    socket.on('check-players', players => {
        players.forEach((p, i) => {
            if (p.connected) playerisConnected(i);
            if (p.ready) {
                playerReady(i);
                if (i !== playerReady) enemyReady = true;
            }
        });
    });

    socket.on('timeout', () => {
        infoDisplay.innerHTML = "Te has pasado del tiempo de espera";
    });

    startButton.addEventListener('click', () => {
        if (allShipsPlaced){
            console.log("comienza el juego");

        //playGameMulti(socket); 
        } else {
            infoDisplay.innerHTML = "Por favor coloca TODOS los barcos";
        }
    });

    cpuSquares.forEach(square => {
        square.addEventListener('click', () => {
            if (currentPlayer === 'user' && ready && enemyReady){
            shotFire = square.dataset.id;
            socket.emit('fire', shotFire)
            }
        });
    });

    socket.on('fire', id => {
        enemiGo(id);
        const square = userSquares[id];
        socket.emit('fire-reply', square.classList);
        //playGameMulti(socket); 
    });

    socket.on('fire-reply', classList => {
        //Función para revelar el cuadro
    //playGameMulti(socket); 
    });

   }

   function playerReady(num){
    let player = `.p${parseInt(num) + 1}`;
    document.querySelector(`${player} .ready`).classList.toggle('active')
    if (ready){
        //playGameMulti(socket);
        setupButtons.style.display = 'none';
    }
   }

   function playerisConnected(num) {
    let player = `.p${parseInt(num) + 1}`;
    document.querySelector(`${player} .connected`).classList.toggle('active')

    if (parseInt(num) === playerNum)
    document.querySelector(player).style.fontWeight = 'bold';
   }

});