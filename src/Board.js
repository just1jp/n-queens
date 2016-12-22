// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var temp = 0;
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.attributes[rowIndex][i] === 1) {
          temp++;
          if (temp > 1) {
            return true;
          }
        }
      }
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var result = false;
      for (var i = 0; i < this.attributes.n; i++) {
        result = result || this.hasRowConflictAt(i);
      }
      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var count = 0;
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.attributes[i][colIndex] === 1) {
          count++;
          if (count > 1) {
            return true;
          }
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var results = false;
      for (var i = 0; i < this.attributes.n; i++) {
        results = results || this.hasColConflictAt(i);
      }
      return results;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var colPar = majorDiagonalColumnIndexAtFirstRow;
      var count = 0;

      // if parameter === 0 check 0,0 1,1 2,2 n-0,n
        // also check 1,0 2,1 n,n-1
        // also check 2,0 n,n-2
      // if parameter === 1 check 0,1 1,2 n-1,n 
      // if parameter === 2 check 0,2 n-2,n
      // if parameter === n return false

      // Start the check at row equal to (column-parameter) and column equal to parameter
      for (var i = colPar; i < this.attributes.n; i++) {
        var row = i - colPar;
        if (this.attributes[row][i] === 1) {
          count++;
          if (count > 1) {
            return true;
          }
        }  
      }
      if (colPar === 0) {
        for (var j = 1; j < this.attributes.n; j++) {
          count = 0;
          for (var k = colPar; k < this.attributes.n - j; k++) {
            if (this.attributes[k + j][k] === 1) {
              count++;
              if (count > 1) {
                return true;
              }
            }
          }
        }
      }
      return false;
      // Increment the column by 1 (row is equal to column minus parameter)
      // Stop when column becomes n

    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var results = false;
      for (var i = 0; i < this.attributes.n; i++) {
        results = results || this.hasMajorDiagonalConflictAt(i);
      }
      return results;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      
      // starts at (0, paramter) => ends at (parameter, 0)
        // starts at (startingrow, parameter) => ends at (n,n--)

      // parameter === 4 check 0,4 1,3 2,2 3,1 4,0  
        // also check 1,4 2,3 3,2 4,1
        // also check 2,4 3,3 4,2
        // also check 3,4 4,3
      // parameter === 3 check 0,3 1,2 2,1 3,0  
      // parameter === 2 check 0,2 1,1 2,0
      // parameter === 1 check 0,1 1,0
      // parameter === 0 return false

      var colPar = minorDiagonalColumnIndexAtFirstRow;
      var count = 0;
      for (var i = colPar; i >= 0; i--) {
        if (this.attributes[colPar - i][i] === 1) {
          count++;
          if (count > 1) {
            return true;
          }
        }
      }
      if (colPar === (this.attributes.n - 1)) {
        for (var j = 1; j < this.attributes.n; j++) {
          count = 0;
          var row = j;
          // we need to increment row at the same time we decrement column so we do not get excess count++
          for (var k = colPar; k >= j; k--) {
            if (this.attributes[row][k] === 1) {
              count++;
              if (count > 1) {
                return true;
              }
            }
            row++;
          }
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var results = false;
      for (var i = (this.attributes.n - 1); i >= 0; i--) {
        results = results || this.hasMinorDiagonalConflictAt(i);
      }
      return results;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());














