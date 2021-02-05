import { Router } from "express";
import { BAD_REQUEST } from "http-status";
import path from "path";
import LocalCountry from "../../classes/LocalCountry";
import getLang from "../../functions/getLang";

const router = Router();

export const availableLanguages = ["en", "it"];

// Require languages
const lang = {
    en: require(path.join(__dirname, "../../..", "locales", "en.json")),
    it: require(path.join(__dirname, "../../..", "locales", "it.json"))
};

router.get("/", (req, res) => {
    res.render("index", { text: lang[getLang(req)] });
});

// Info page
router.get("/info", (req, res) => {
    res.render("info", { text: lang[getLang(req)] });
});

router.get("/set-lang/:lang", (req, res) => {
    const { lang } = req.params;
    if (lang !== "it" && lang !== "en") return res.sendStatus(BAD_REQUEST);
    res.cookie("lang", lang);

    res.redirect("back");
});

router.get("*", (req, res) => {
    res.redirect("/");
});

export default router;
