export class Vieraskirja {
    //Haetaan tallennetut nimet localStoragesta ja muutetaan ne takaisin taulukoksi, muutne käytetään tyhjä listaa
    constructor() {
        this.nimet = JSON.parse(localStorage.getItem('vieraskirja')) || [];
    }

    //Tällä lisätään uusi nimi vieraskirjaan 
    lisaaNimi(nimi) {
        //Tarkistaa että sama nimi ei ole listassa
        if (!this.nimet.includes(nimi)) {
            //Lisätään tauluikkoon
            this.nimet.push(nimi);
            //Tallennetaan LogaStorageen
            this.tallenna();
        }
    }
    //Tällä palautetaan nimet listana
    haeNimet() {
        return this.nimet;
    }
    //Tallentaan nimet LocalStorageen JSON muodossa
    tallenna() {
        localStorage.setItem('vieraskirja', JSON.stringify(this.nimet));
    }
}