import { Request } from "express";
import Negotiator from "negotiator";
import { countriesData } from "..";
import LocalCountry from "../classes/LocalCountry";
import { availableLanguages } from "../routes/client";

const isLocalCountry = (object: any): object is LocalCountry => {
    return "name" in object && "code" in object;
};

const getLastCountry = (req: Request): string => {
    // First, check if user has set a language (setting a "lang" cookie)
    const { lastCountry } = req.cookies;
    if (
        isLocalCountry(lastCountry) &&
        countriesData.data &&
        countriesData.isValidCountry(lastCountry.name)
    ) {
        return lastCountry.name;
    }
    return "Italy";
};

export default getLastCountry;
