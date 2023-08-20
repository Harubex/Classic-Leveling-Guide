import * as cheerio from "cheerio";
import fs from "fs/promises";
const browser = require("browserless")({headless: "new"});

export const getPageHtml = async (url: string) => {
    const browserless = await browser.createContext();
    const html = await browserless.html(url);
    await browserless.destroyContext();
    return cheerio.load(html);
};

export const getFileJson = async (fileName: string) => {
    return JSON.parse((await fs.readFile(fileName, {encoding: "utf-8"})).toString());
}