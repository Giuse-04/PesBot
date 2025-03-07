# Discord Bot for Tournament Management

This is a Discord bot designed to manage a football tournament. The bot allows users to update the tournament table with match results and display the current standings.

## Features

- **Update Table**: Update the tournament table with match results.
- **Display Table**: Display the current standings of the tournament.

## Commands

### `/update_table`

Updates the tournament table with the results of a match.

### `/display_table`

Displays the current standings of the tournament.


## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd bot-ds
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `config.json` file in the root directory with your bot token, client ID, and guild ID:
    ```json
    {
        "token": "YOUR_BOT_TOKEN",
        "clientId": "YOUR_CLIENT_ID",
        "guildId": "YOUR_GUILD_ID"
    }
    ```

4. Create a `table.json` file in the root directory to store the tournament data:
    ```json
    {
        "players": []
    }
    ```