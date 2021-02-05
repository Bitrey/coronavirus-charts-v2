import { Request } from "express";
import Negotiator from "negotiator";
import { availableLanguages } from "../routes/client";

const getLang = (req: Request): "it" | "en" => {
    // First, check if user has set a language (setting a "lang" cookie)
    const { lang } = req.cookies;
    if (lang === "en" || lang === "it") return lang;

    const negotiator = new Negotiator(req);
    negotiator.languages(availableLanguages);

    const possibleLang = negotiator.language(availableLanguages);
    if (possibleLang === "en" || possibleLang === "it") return possibleLang;

    return "en";
};

export default getLang;
