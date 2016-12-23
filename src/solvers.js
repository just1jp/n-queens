/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  // need a array that stores queen placements
  var solution = [];
  // need an array of objects to store the coordinates of queen placements (var arrayDecisions = [{},n {}s])
  // keep track of decision by using arrayDecisions.length
  var arrayDecisions = [];
  // start by creating an empty board (var gameBoard = new Board({"n":n}))
  var gameBoard = new Board({'n': n});

  var makeDecisions = function(col) {
    if (arrayDecisions.length === n) {
      // if all decisions pass and we build full board
      for (var i = 0; i < arrayDecisions.length; i++) {
        solution.push(gameBoard.attributes[i]);
      }
      return solution;
    }
    // start at coordinates currentRow,0  (currentRow = arrayDecisions.length)
    var row = arrayDecisions.length;
    col = col || 0;
    // if current row has no ones (of gameBoard)
    
    if (gameBoard.attributes[row].indexOf(1) === -1) {
      // build {} that stores coordinates and push to arrayDecisions
      var decision = {'row': row, 'col': col};
      arrayDecisions.push(decision);
      // update gameBoard at gameBoard.attributes[currentRow][0] = 1 
      gameBoard.attributes[decision.row][decision.col] = 1;
    }
    // run all applicable tests
    if (gameBoard.hasAnyRooksConflicts()) {
      // if any tests return true, gameBoard.attributes[arrayDecisions[0].row][arrayDecisions[0].column] = 0 ...
      gameBoard.attributes[decision.row][decision.col] = 0; // possibly recurse after this point
      // increment column coordinate by 1 (arrayDecisions[0].column++)
      arrayDecisions.splice(arrayDecisions.length - 1, 1); // show this line to JUSTIN 
      decision.col++;
      // if column becomes larger than n...
      if (decision.col >= n) {
        // Splice off current decision from arrayDecisions (done on line 52)
        // update game board removing previous 1
        gameBoard.attributes[arrayDecisions[arrayDecisions.length - 1].row][arrayDecisions[arrayDecisions.length - 1].col] = 0;
        // increment last decision column coordinate by 1
        arrayDecisions[arrayDecisions.length - 1].col++;
        
        // Re run the entire process
        makeDecisions(arrayDecisions[arrayDecisions.length - 1].col);
      } else {
        // update gameBoard at new column coordinates
        // repeat tests
        makeDecisions(decision.col);
      }
    } else {
      // if all tests return false move to next row (repeat logic)
      makeDecisions();
    }
  };
  makeDecisions();
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};


window.copyBoard = function(board) {
  var rows = board.rows();
  var cloneRows = [];
  for (var i = 0; i < rows.length; i++) {
    cloneRows.push(rows[i].slice());
  }
  var newBoard = new Board(cloneRows);
  return newBoard;
};


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solution = [];

  // create a for loop that runs from 0 to n - 1
  // create a function that takes an object as a parameter
  // if obj is undefined, obj = obj || object with property of col: i, children: [], gameboard: [[]..[]]
  // create an object with property of col: i, and children: []


  // Passing in undefined into togglePiece function...FIX


  for (var col = 0; col < n; col++) {
    var treealizer = function(obj) {
      for (var j = 0; j < n; j++) {
        var childBoard = copyBoard(obj.board);
        var childNode = {'col': j, 'children': [], 'board': childBoard, 'depth': obj.depth + 1};
        childNode.board.togglePiece(childNode.depth, childNode.col);
        if (childNode.depth === n) {
          solution.push(obj.board);
          return;
        }
        if (!childBoard.hasAnyRooksConflicts()) {
          obj.children.push(childNode);
        }
        treealizer(obj.children[j]);
      }

    };
    var board = new Board({'n': n});
    board.togglePiece(0, col);
    treealizer({'col': col, 'children': [], 'board': board, 'depth': 0});
  }



// var board = new Board({'n': 3});
// var newBoard = Object.create(board);

// board.togglePiece(0, 0);
// var template = board.rows().slice();
// var newBoard = new Board(template);
// newBoard.togglePiece(1,0);


  console.log('Number of solutions for ' + n + ' rooks:', solution);
  return solution.length;
};






// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {  
  // need a array that stores queen placements
  var solution = [];
  // need an array of objects to store the coordinates of queen placements (var arrayDecisions = [{},n {}s])
  // keep track of decision by using arrayDecisions.length
  var arrayDecisions = [];
  // start by creating an empty board (var gameBoard = new Board({"n":n}))
  var gameBoard = new Board({'n': n});

  var makeDecisions = function(col) {
    // if (gameBoard.attributes[1] !== undefined) {
    //   if (gameBoard.attributes[1][2] === 1) {
    //     debugger;
    //   }
    // }
    if (arrayDecisions.length === n) {
      // if all decisions pass and we build full board
      for (var i = 0; i < arrayDecisions.length; i++) {
        solution.push(gameBoard.attributes[i]);
      }
      return solution;
    }
    // start at coordinates currentRow,0  (currentRow = arrayDecisions.length)
    var row = arrayDecisions.length;
    col = col || 0;
    // if current row has no ones (of gameBoard)
    
    if (gameBoard.attributes[row].indexOf(1) === -1) {
      // build {} that stores coordinates and push to arrayDecisions
      var decision = {'row': row, 'col': col};
      arrayDecisions.push(decision);
      // update gameBoard at gameBoard.attributes[currentRow][0] = 1 
      gameBoard.attributes[decision.row][decision.col] = 1;
    }
    // run all applicable tests
    if (gameBoard.hasAnyQueensConflicts()) {
      // if any tests return true, gameBoard.attributes[arrayDecisions[0].row][arrayDecisions[0].column] = 0 ...
      gameBoard.attributes[decision.row][decision.col] = 0; // possibly recurse after this point
      // increment column coordinate by 1 (arrayDecisions[0].column++)
      arrayDecisions.splice(arrayDecisions.length - 1, 1); // show this line to JUSTIN 
      decision.col++;
      // if column becomes larger than n...
      if (decision.col >= n) {
        // Splice off current decision from arrayDecisions
          // done on line 123
        // update game board removing previous 1
        // increment last decision column coordinate by 1
        var deletePastDecisions = function () {
          var temp = arrayDecisions[arrayDecisions.length - 1].col;
          gameBoard.attributes[arrayDecisions[arrayDecisions.length - 1].row][arrayDecisions[arrayDecisions.length - 1].col] = 0;
          arrayDecisions.splice(arrayDecisions.length - 1, 1);
          temp++;
          if (temp >= n) {
            if (arrayDecisions[arrayDecisions.length - 1] === undefined) {
              // gameBoard = new Board({'n': n});
              for (var m = 0; m < n; m++) {
                solution.push(gameBoard.attributes[m]);
              }
              return solution;
            }
            temp = arrayDecisions[arrayDecisions.length - 1].col;
            gameBoard.attributes[arrayDecisions[arrayDecisions.length - 1].row][arrayDecisions[arrayDecisions.length - 1].col] = 0;
            arrayDecisions.splice(arrayDecisions.length - 1, 1);
            temp++;
            makeDecisions(temp);
          } else {
            makeDecisions(temp);
          }
        };
        deletePastDecisions();

          // if (temp >= n) {
          //   arrayDecisions.splice(arrayDecisions.length - 1, 1);  
          // }
        // Re run the entire process
      } else {
        // update gameBoard at new column coordinates
        // repeat tests
        makeDecisions(decision.col);
      }
    } else {
      // if all tests return false move to next row (repeat logic)
      makeDecisions();
    }
  };
  makeDecisions();
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};


























