import game.wrapped_flappy_bird as game
import pygame
import numpy as np
import webview

ACTION = 2
def play_game():
    game_state = game.GameState()

    while True:
        a_t = np.zeros([ACTION])  # length = 2, num = 0

        a_t[0] = 1  # [1, 0] --> falls

        for event in pygame.event.get():
            if event.type == pygame.MOUSEBUTTONDOWN:
                a_t = np.zeros([ACTION])
                a_t[1] = 1 # [0, 1] --> jumps

        game_state.frame_step(a_t)

def main():
    play_game()

if __name__ == '__main__':
    main()