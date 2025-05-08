import { apiKey } from "../config.js";

export class KoiraAPI {
    // Hakee kaikki rodut TheDogAPI:sta ja palauttaa ne JSON-muodossa
    static async haeRodut() {
        //get pyynt rotujen listalle
        const vastaus = await fetch('https://api.thedogapi.com/v1/breeds', {
            headers: { 'x-api-key': apiKey }
        });
        //Muutetaan json muotoon ja palautetaan
        return vastaus.json();
    }

    //Hakee tietyn rodun kuvan ID:tä apuna käyttäen
    static async haeRotuKuva(rotuId) {
        const vastaus = await fetch(`https://api.thedogapi.com/v1/images/search?breed_id=${rotuId}`, {
            headers: { 'x-api-key': apiKey }
        });
        //Muutetaan json data taulukoksi
        const data = await vastaus.json();
        //Palautetaan esimmäisen tuloksen url 
        return data[0]?.url;
    }

    //Hakee kuvan viiteID:lla
    static async haeKuvaViitteella(viiteId) {
        //Haetaan GET pyynnöllä kuva kuvan ID:llä
        const vastaus = await fetch(`https://api.thedogapi.com/v1/images/${viiteId}`, {
            headers: { 'x-api-key': apiKey }
        });

        const data = await vastaus.json();
        return data.url;
    }
}