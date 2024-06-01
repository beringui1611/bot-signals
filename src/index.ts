//index.ts
import config from "./config";

import Moralis from "moralis";

import { EvmChain } from "@moralisweb3/common-evm-utils";

import { Telegraf } from "telegraf";


const bot = new Telegraf(config.TELEGRAM_BOT);

let data = [3240];

async function getPrice(): Promise<number> {
    const { result } = await Moralis.EvmApi.token.getTokenPrice({
        address: config.TOKEN_ADDRESS,
        chain: EvmChain.ETHEREUM,
        exchange: config.EXCHANGE
    })


    const decreasePercent = data[0] * 10 /100;
    const increasePercent = data[0] * 10 / 100;

    const feed = parseInt(`${result.usdPrice}`)

   if( feed <= data[0] - decreasePercent){
    const message = `WETH/USD $${feed} price below 10% 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨`
    await bot.telegram.sendMessage(config.CHAT_ID, message);
    data[0] = feed

   }
   else if(feed >= data[0] + increasePercent){
    const message = `WETH/USD $${feed} price rose 10% 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀`
    await bot.telegram.sendMessage(config.CHAT_ID, message);
    data[0] = feed
   }
   else{
        const message = `WETH/USD $${feed} price has remained in the last 5 minutes 🍕🍕🍕`;
        await bot.telegram.sendMessage(config.CHAT_ID, message)
    data[0] = feed
   }
  
    console.log(data)
    return feed
}

 async function start() {
    await Moralis.start({
        apiKey: config.API_KEY
    })

    await getPrice();

    setInterval(getPrice, config.INTERVAL);
}

start();

