#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_R 600
#define MAX_C 600

int countMines(char map[MAX_R][MAX_C], int r, int c, int row, int col) {
    int count = 0;
    for (int i = row - 1; i <= row + 1; i++) {
        for (int j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < r && j >= 0 && j < c) {
                if (map[i][j] == '*') {
                    count++;
                }
            }
        }
    }
    if (map[row][col] == '*') {
        count--;
    }
    return count;
}

void clear0(char map[MAX_R][MAX_C], int r, int c, int row, int col, int visited[r][c]) {
    if (countMines(map, r, c, row, col) != 0) return;
    
    map[row][col] = '.';
    visited[row][col] = 1;
    
    int i = row, j = col;
    if (map[i+1][j] == '#' && i < r - 1) {
        if (countMines(map, r, c, i + 1, j) == 0 && !visited[i+1][j]) {
            clear0(map, r, c, i + 1, j, visited);
        } else if (countMines(map, r, c, i + 1, j) != 0) {
            map[i+1][j] = countMines(map, r, c, i+1, j) + '0';
        }
    }
    
    if (map[i][j+1] == '#' && j < c - 1) {
        if (countMines(map, r, c, i, j+1) == 0 && !visited[i][j+1]) {
            clear0(map, r, c, i, j+1, visited);
            visited[i][j+1] = 1;
        } else if (countMines(map, r, c, i, j+1) != 0) {
            map[i][j+1] = countMines(map, r, c, i, j+1) + '0';
        }
    }
    
    if (map[i+1][j+1] == '#' && i < r - 1 && j < c - 1) {
        if (countMines(map, r, c, i+1, j+1) == 0 && !visited[i+1][j+1]) {
            clear0(map, r, c, i+1, j+1, visited);
            visited[i+1][j+1] = 1;
        } else if (countMines(map, r, c, i+1, j+1) != 0) {
            map[i+1][j+1] = countMines(map, r, c, i+1, j+1) + '0';
        }
    }
    
    if (map[i-1][j] == '#' && i > 0) {
        if (countMines(map, r, c, i-1, j) == 0 && !visited[i-1][j]) {
            clear0(map, r, c, i-1, j, visited);
            visited[i-1][j] = 1;
        } else if (countMines(map, r, c, i-1, j) != 0) {
            map[i-1][j] = countMines(map, r, c, i-1, j) + '0';
        }
    }
    
    if (map[i][j-1] == '#' && j > 0) {
        if (countMines(map, r, c, i, j-1) == 0 && !visited[i][j-1]) {
            clear0(map, r, c, i, j-1, visited);
            visited[i][j-1] = 1;
        } else if (countMines(map, r, c, i, j-1) != 0) {
            map[i][j-1] = countMines(map, r, c, i, j-1) + '0';
        }
    }
    
    if (map[i-1][j-1] == '#' && i > 0 && j > 0) {
        if (countMines(map, r, c, i-1, j-1) == 0 && !visited[i-1][j-1]) {
            clear0(map, r, c, i-1, j-1, visited);
            visited[i-1][j-1] = 1;
        } else if (countMines(map, r, c, i-1, j-1) != 0) {
            map[i-1][j-1] = countMines(map, r, c, i-1, j-1) + '0';
        }
    }
    
    if (map[i-1][j+1] == '#' && i > 0 && j < c - 1) {
        if (countMines(map, r, c, i-1, j+1) == 0 && !visited[i-1][j+1]) {
            clear0(map, r, c, i-1, j+1, visited);
            visited[i-1][j+1] = 1;
        } else if (countMines(map, r, c, i-1, j+1) != 0) {
            map[i-1][j+1] = countMines(map, r, c, i-1, j+1) + '0';
        }
    }
    
    if (map[i+1][j-1] == '#' && i < r - 1 && j > 0) {
        if (countMines(map, r, c, i+1, j-1) == 0 && !visited[i+1][j-1]) {
            clear0(map, r, c, i+1, j-1, visited);
            visited[i+1][j-1] = 1;
        } else if (countMines(map, r, c, i+1, j-1) != 0) {
            map[i+1][j-1] = countMines(map, r, c, i+1, j-1) + '0';
        }
    }
    
}

int zero(char map[MAX_R][MAX_C], int r, int c) {
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (countMines(map, r, c, i, j) == 0 && map[i][j] == '#') {
                return 1;
            }
        }
    }
    return 0;
}

int main(void) {
    int r, c;
    scanf("%d %d", &r, &c);

    char map[MAX_R][MAX_C];
    for (int i = 0; i < r; i++) {
        scanf("%s", map[i]);
    }
    
    int clicks = 0;
    int visited[r][c];
    memset(visited, 0, sizeof(visited));
    
    for (int i = 0; i < r; i++) {
         for (int j = 0; j < c; j++) {
             if (map[i][j] != '*') {
                 map[i][j] = '#';
             }
         }
     }
    
    while (zero(map, r, c)) {
        clear0(map, r, c, 0, 0, visited);
        clicks++;
    }
    
    for (int i = 0; i < r; i++) {
        for (int j = 0; j < c; j++) {
            if (map[i][j] == '#') {
                clicks++;
            }
        }
    }
    
    
    printf("%d\n", clicks);
    return 0;
}
