document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const restartBtn = document.querySelector('#restart-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0

    const colors = [
        'orange',
        'red',
        'purple',
        'pink',
        'green',
        'blue',
        'brown'
    ]
    
    
    const llTetromino = [
        [1, width+1, width*2+1, width*2+2],
        [width,width+1,width+2,2],
        [0, 1, width+1, width*2+1],
        [width,width+1,width+2,width*2]
    ]
    const lrTetromino = [
        [1, width+1, width*2+1, width*2],
        [width,width+1,width+2,0],
        [1, width+1, width*2+1, 2],
        [width,width+1,width+2,width*2+2]
    ]
    const zlTetromino = [
        [0, 1, width+1, width+2],
        [1, width+1, width, width*2],
        [0, 1, width+1, width+2],
        [1, width+1, width, width*2]
    ]

    const zrTetromino = [
        [1 , width, width+1, 2],
        [0, width, width+1,width*2+1],
        [1 , width, width+1, 2],
        [0, width, width+1,width*2+1]
    ]
    const tTetromino = [
        [width+1, 1, width, width+2],
        [width+1, 1, width*2+1, width+2],
        [0, 1, 2, width+1],
        [width, width+1, width*2+1, 1]
    ]
    const oTetromino = [
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2],
        [1, 2, width+1, width+2]
    ]
    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [0, 1, 2, 3],
        [1, width+1, width*2+1, width*3+1],
        [0, 1, 2, 3],
    ]
    const theTetrominoes = [llTetromino, lrTetromino, zlTetromino, zrTetromino, tTetromino, oTetromino, iTetromino]
    let currentPosition = 4
    let currentRotation = 0
    //randomly selct a Tetromino
    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    //draw the Tetromino
    function draw() {
        current.forEach(index => {
            //let tet = []
            //tet.push(squares[currentPosition + index])
            //tet[0].classList.add('tetromino')
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor= colors[random]
            //squares[currentPosition + index].style.backgroundImage = url("Amir.jpg")
        })
    }
    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
            //squares[currentPosition + index].style.backgroundImage = ''
        })
    }
    //move down function
    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }
    // freeze functiom
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start a new Tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        } 
    }
    //asssign function to keyCodes
    function control(e){
        if(e.keyCode === 37 ) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
            score +=1
            scoreDisplay.innerHTML = score
        } else if (e.keyup === 32) {
            fallDown()
        }
    }
    document.addEventListener('keyup', control)

    //move the tetromino left, unless it is at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0) //true if at least one square in current tetromino is at the left edge

        if(!isAtLeftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }
    //move the tetromino right, unless it is at the edge or the is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }
    //rotate the tetromino
    function rotate() {
        undraw()
        const isInRightHalf = current.some(index => (currentPosition + index) % width === width -1 | (currentPosition + index) % width === width -2)
        const isInLeftHalf = current.some(index => (currentPosition + index) % width === 0 | (currentPosition + index) % width === 1 )
        //const isCloseToBottom = current.some(index => squares[currentPosition + index + width].classList.contains('taken') | squares[currentPosition + index + 2*width].classList.contains('taken') | squares[currentPosition + index + 3*width].classList.contains('taken'))
        currentRotation ++
        if(currentRotation == current.length) { //if the current rotationgets to 4, make it go back to 0
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        // wont allow rotation if fields in new space are taken
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentRotation --
            if(currentRotation == 0) { //if the current rotationgets to 0, make it go back to 4
            currentRotation = current.length
            }
            current = theTetrominoes[random][currentRotation]
        }
        
        // moves Tetrominons away from boundary when rotated
        if(isInLeftHalf) {
            const crossedOnce = current.some(index => (currentPosition + index) % width === width -1)
            const crossedTwice = current.some(index => (currentPosition + index) % width === width -2)
            if(crossedOnce && !crossedTwice) {
                currentPosition += 1
            }
            if(crossedTwice) {
                currentPosition +=2
            }
        }
        if(isInRightHalf) {
            const crossedOnce = current.some(index => (currentPosition + index) % width === 0)
            const crossedTwice = current.some(index => (currentPosition + index) % width === 1)
            if(crossedOnce && !crossedTwice) {
                currentPosition -= 1
            }
            if(crossedTwice) {
                currentPosition -=2
            }
        }
        draw()
        freeze() // needed to avoid Tetrominos of moving out of the bottom bpundary if rotated in the last moment
    }
    // let the tetromino fall down
    function fallDown() {
        const atBottom = current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
        console.log(atBottom)
        while(!atBottom){
            moveDown()
        }
    }
    //show up-next tetromino in mini_grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
    //the tetrominos without rotations
    const upNextTetromines = [
        [1, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //llTetromino 
        [2, displayWidth+2, displayWidth*2+2, displayWidth*2+1], //lrTetromino
        [0, 1, displayWidth+1, displayWidth+2], //zlTetromino
        [1 , displayWidth, displayWidth+1, 2], //zrTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [1,2, displayWidth+1, displayWidth+2], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromio
    ]
    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino from entire grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetromines[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functinality to restart button
    restartBtn.addEventListener('click', () => {
        for (let i=0; i<199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
        }
        clearInterval(timerId)
        timerId = null
        score = 0
        scoreDisplay.innerHTML = score
        currentPosition = 4
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        random = Math.floor(Math.random()*theTetrominoes.length)
        current = theTetrominoes[random][0]
        draw()
        displayShape()
        document.addEventListener('keyup', control)
    })
    //add functionality to the start button
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    //add score
    function addScore() {
        for (let i=0; i<199; i +=width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score +=10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }
    //enter name
    function enterName() {
        let text;
        let person = prompt("Please enter your name:", "Harry Potter");
        if (person == null || person == "") {
          text = " ";
        } else {
          text = person + " " + score;
        }
        document.getElementById("demo").innerHTML = text;
      }
    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
            document.removeEventListener('keyup', control)
            enterName()
         }
    }
})