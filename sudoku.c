#include <stdio.h>

void printBoard(int board[9][9]) {
    for (int i = 0; i < 9; i++) {
        if (i % 3 == 0 && i != 0) {
        }
        for (int j = 0; j < 9; j++) {
            if (j % 3 == 0 && j != 0) {
            }
            printf("%d", board[i][j]);
        }
        printf("\n");
    }
}

int isSafe(int board[9][9], int row, int col, int num) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num) {
            return 0;
        }
    }

    for (int i = 0; i < 9; i++) {
        if (board[i][col] == num) {
            return 0;
        }
    }

    int startRow = row - row % 3;
    int startCol = col - col % 3;
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] == num) {
                return 0;
            }
        }
    }

    return 1;
}

int findEmptyLocation(int board[9][9], int *row, int *col) {
    for (*row = 0; *row < 9; (*row)++) {
        for (*col = 0; *col < 9; (*col)++) {
            if (board[*row][*col] == 0) {
                return 1;
            }
        }
    }
    return 0;
}

int solveSudoku(int board[9][9]) {
    int row, col;
    if (!findEmptyLocation(board, &row, &col)) {
        return 1;
    }

    for (int num = 1; num <= 9; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
                return 1;
            }

            board[row][col] = 0;
        }
    }

    return 0;
}

int main(void) {
    int board[9][9];
    
    for (int i = 0; i < 9; i++) {
        for (int j = 0; j < 9; j++) {
            scanf("%1d", &board[i][j]);
        }
    }

    if (solveSudoku(board)) {
        printBoard(board);
    } else {
        printf("\n");
    }

    return 0;
}
