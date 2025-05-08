//importoidaan luokat
import { Aanestys } from "./class/Aanestys.js"
import { Vieraskirja } from "./class/Vieraskirja.js"
import { KoiraAPI } from "./class/KoiraAPI.js"

//Muuttujat
const sections = document.querySelectorAll('main > section')
const etusivuNappi = document.querySelector('#etusivubutton')
const aanestysNappi = document.querySelector('#aanestysbutton')
const tietoaNappi = document.querySelector('#tietoabutton')
const haeKuvaNappi = document.querySelector('#haeKuvabutton')
const aanestaNappi = document.querySelector('#aanestabutton')
const nimiKentta = document.querySelector('#nimi')
const rotuValinta = document.querySelector('#rotuselect')
const aanestaValinta = document.querySelector('#aanestaselect')
const koiranKuvaAlue = document.querySelector('#koirankuva')
const vierasListaAlue = document.querySelector('#vieraslista')
const topRodutAlue = document.querySelector('#toprodut')
const suosituinAlue = document.querySelector('#topaanestetyt')
const paivaysAlue = document.querySelector('#päiväys')
const aanestysIlmoitus = document.querySelector('#aanestysilmoitus')

// Luodaan oliot vieraskirjasta ja aanestyksesta kun sivu on latautunut

document.addEventListener('DOMContentLoaded', () => {
    const vieraskirja = new Vieraskirja();
    const aanestys = new Aanestys();

    ////Piilotetaan muut osiot ja näytetään vain pyydetty ID:n peruusteella
    function naytaOsio(id) {
        sections.forEach(section => section.classList.add('hidden'));
        const target = document.getElementById(id);
        if (target) {
            target.classList.remove('hidden');
        }
    }
    //Avataan etusivu
    etusivuNappi.addEventListener('click', e => {
        e.preventDefault();
        naytaOsio('AvaaPaasivu');
    });
    //Avataan aanestys
    aanestysNappi.addEventListener('click', e => {
        e.preventDefault();
        naytaOsio('AvaaVieraskirja');
        naytaTopRodut();
        naytaSuosituinRotu();
    });
    //Avataan tietoa
    tietoaNappi.addEventListener('click', e => {
        e.preventDefault();
        naytaOsio('AvaaTietoa');
    });
    //Tällä päivitetään kellonaikaa joka sekunttti
    setInterval(() => {
        const nyt = new Date();
        paivaysAlue.textContent = `${nyt.toLocaleDateString('fi-FI')} ${nyt.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }, 1000);
    //Haetaan kuva nappia painamalla ja kirjoitetaan vieraskirjaan
    haeKuvaNappi.addEventListener('click', async () => {
        //Haetaan nimi ja trimmataan se
        const nimi = nimiKentta.value.trim();
        //Haetaan rotuID
        const rotuId = rotuValinta.value;
        //Jos nimi puuttuu niin valittaa
        if (!nimi) {
            alert('Syötä etunimesi!');
            return;
        }
        //Lisää nimen vieraskirjaan
        vieraskirja.lisaaNimi(nimi);
        //Päivitetään viersakirjalista
        naytaVieraskirja();

        //Haetaan valitun rodun kuva APISTA id avulla
        const kuvaUrl = await KoiraAPI.haeRotuKuva(rotuId);
        koiranKuvaAlue.innerHTML = kuvaUrl ? `<img src="${kuvaUrl}" alt="Koira" style="max-width:100%">` : 'Kuvaa ei löydy.';
    });
    //Kun painetaan ÄÄnestä nappia
    aanestaNappi.addEventListener('click', () => {
        if (aanestys.onkoAanestanyt()) {
            //Ilmoitetaan mikäli on jo äänestänyt
            aanestysIlmoitus.textContent = 'Olet jo antanut äänesi';
            return;
        }
        //Haetaan valitun rodun ID ja rekisteröidään ääni
        const rotuId = aanestaValinta.value;
        aanestys.aanesta(rotuId);
        //Annetaan kiitos viesti äänestämisestä
        aanestysIlmoitus.textContent = 'Kiitos äänestämisestä :)';
        //Päivtetään top3 lista
        naytaTopRodut();
        //Pävitetään susoituin rotu
        naytaSuosituinRotu();
    });
    //Vierakirja toiminallisuus
    function naytaVieraskirja() {
        //Tyhjentän listan
        vierasListaAlue.innerHTML = '';
        vieraskirja.haeNimet().forEach(nimi => {
            //Luodaan uusi lista
            const li = document.createElement('li');
            //Asetetaannimi ja lisätäään se listaan
            li.textContent = nimi;
            vierasListaAlue.appendChild(li);
        });
    }
    //TÄllä näytetään top3 tulokset
    async function naytaTopRodut() {
        //Haetaan rodut APIN avulla
        const rodut = await KoiraAPI.haeRodut();
        //Haetaan top lista äänestyksestä
        const top = aanestys.topRodut();

        //Tyhjentää listan
        topRodutAlue.innerHTML = '';
        top.forEach(([id, maara]) => {
            //Etsitään rotu ID avulla
            const rotu = rodut.find(r => r.id == id);
            //Annetaan nimi muuten köytetään tuntematon
            const nimi = rotu?.name || 'Tuntematon';
            //Luodaan ja asetetaan listaan
            const li = document.createElement('li');
            li.textContent = `${nimi} (${maara} ääntä)`;
            topRodutAlue.appendChild(li);
        });
    }

    //Tällä nätetään susoituin koirarotu
    async function naytaSuosituinRotu() {
        //HAetaan rotu aanestys luokasta
        const top = aanestys.suosituinRotu();
        if (!top) {
            suosituinAlue.innerHTML = '<p>Ei vielä ääniä.</p>';
            return;
        }
        //Haetaan rodun ID
        const [topId] = top;
        const rodut = await KoiraAPI.haeRodut();
        const rotu = rodut.find(r => r.id == topId);
        if (rotu && rotu.reference_image_id) {
            //Haetaan rodun kuva
            const kuvaUrl = await KoiraAPI.haeKuvaViitteella(rotu.reference_image_id);
            suosituinAlue.innerHTML = `<h4>${rotu.name}</h4><img src="${kuvaUrl}" alt="${rotu.name}">`;
        } else {
            suosituinAlue.innerHTML = `<p>${rotu?.name || 'Tuntematon'} (kuvaa ei saatavilla)</p>`;
        }
    }

    KoiraAPI.haeRodut().then(rodut => {
        rotuValinta.innerHTML = '';
        aanestaValinta.innerHTML = '';

        rodut.forEach(rotu => {
            //Vaihtoehto1 kuvan hakuun
            const vaihtoehto1 = document.createElement('option');
            vaihtoehto1.value = rotu.id;
            vaihtoehto1.textContent = rotu.name;
            rotuValinta.appendChild(vaihtoehto1);

            //Vaihtoheto 2 äänestysvalintan
            const vaihtoehto2 = document.createElement('option');
            vaihtoehto2.value = rotu.id;
            vaihtoehto2.textContent = rotu.name;
            aanestaValinta.appendChild(vaihtoehto2);
        });
        //Näytetään vieraskirja
        naytaVieraskirja();
        //Näytetään top rodut
        naytaTopRodut();
        //Näytetään suosituin rotu
        naytaSuosituinRotu();
    });
});