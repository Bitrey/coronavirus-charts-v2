import { Router } from "express";
import { BAD_REQUEST, SERVICE_UNAVAILABLE } from "http-status";
import { countriesData } from "../..";

const router = Router();

// router.get("/Global", async (req, res) => {
//     if (countriesData.isFetchingData)
//         return res.sendStatus(SERVICE_UNAVAILABLE);

//         // Save cookie
//         res.cookie("lastCountry", "Global");

//     res.json(countriesData.globalData);
// });

router.get("/:country", async (req, res) => {
    let country = req.params.country;

    // Fix different country names
    if (country == "South Korea") {
        country = "Korea, South";
    } else if (country == "United States") {
        country = "US";
    } else if (country == "Swaziland") {
        country = "Eswatini";
    } else if (country == "Congo") {
        country = "Congo (Kinshasa)";
    } else if (country == "Palestine") {
        country = "occupied Palestinian territory";
    } else if (country == "Macedonia") {
        country = "North Macedonia";
    } else if (country == "Côte d’Ivoire") {
        country = "Cote d'Ivoire";
    } else if (country == "Czech Republic") {
        country = "Czechia";
    }

    if (countriesData.isFetchingData)
        return res.sendStatus(SERVICE_UNAVAILABLE);
    if (!countriesData.isValidCountry(country) && country !== "Global")
        return res.sendStatus(BAD_REQUEST);

    // Save cookie
    res.cookie("lastCountry", country);

    if (country === "Global") {
        res.json(countriesData.globalData);
        // console.log(countriesData.globalData);
    } else {
        res.json(countriesData.getCountryData(country));
        // console.log(countriesData.getCountryData(country));
    }
});

export default router;
