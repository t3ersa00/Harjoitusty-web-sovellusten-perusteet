export class Aanestys {
    //Lataa aiemmat äänet LogalSToresta, jos ei löydä tietoja niin aloittaa tyhjällä listalla
    constructor() {
        this.aanet = JSON.parse(localStorage.getItem('aanet')) || {};
    }
    //Tarkistaa myös onko köyttäjä jo äänestanyt
    onkoAanestanyt() {
        return localStorage.getItem('aanestanyt') === 'true';
    }
    //Jos on äänestänyt niin ei anna äänestää uudelleen, ei voi spämmiä samaa rotua mieleiseksi :)
    //Lisää äänen rodulle ID:n avulla ja tallentaa äänen, merkitsee että on äänestetty
    aanesta(rotuId) {
        this.aanet[rotuId] = (this.aanet[rotuId] || 0) + 1;
        this.tallenna();
        localStorage.setItem('aanestanyt', 'true');
    }
    //Palautaa äänet
    haeAanet() {
        return this.aanet;
    }
    // Palautetaan 3 äänestetyintä rotua
    topRodut(maara = 3) {
        return Object.entries(this.aanet)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maara);
    }
    //Plalauttaa susoituimman äänestetyn rodun
    suosituinRotu() {
        return Object.entries(this.aanet)
            .sort((a, b) => b[1] - a[1])[0];
    }
    //Tallennetaan äänet logalStorageen
    tallenna() {
        localStorage.setItem('aanet', JSON.stringify(this.aanet));
    }
}
