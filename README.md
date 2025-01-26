## Layer Edge Auto Referral Bot

This bot automates the process of creating accounts and using referral codes for the LayerEdge.

## Features

- Automatically generates wallet.
- Auto connect light node.
- Uses proxies to avoid IP bans.
- Logs the created accounts.

## Requirements

- Node.js v18.20.6 LTS [Download](https://nodejs.org/dist/v18.20.6/node-v18.20.6-x64.msi).
- Account Layer Edge https://dashboard.layeredge.io/

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Rambeboy/layeredge-autoreff-bot.git && cd layeredge-autoreff-bot
   ```

2. Install the dependencies:

   ```sh
   npm install && npm run build
   ```

3. Create a `proxy.txt` file in the root directory and add your proxies (one per line).

## Usage

1. Run the bot:

   ```sh
   npm run start
   ```

2. Follow the prompts to enter your referral code , and then input (how many refferal)

## Output

- The created accounts will be saved in `accounts.txt`.

## Notes

- Make sure to use valid proxies to avoid IP bans.

## Disclaimer

This tool is for educational purposes only. Use it at your own risk.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.