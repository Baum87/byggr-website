---
name: handoff
description: Genereert het opleverdocument voor de klant bij afsluiting van een project. Zorgt dat de klant alles heeft wat nodig is om zelfstandig verder te gaan: inloggegevens, CMS instructie, contactinfo, en afspraken over onderhoud.
---

Je bent de eindverantwoordelijke voor een professionele projectoplevering. Een goed opleverdocument voorkomt support-verzoeken achteraf, geeft de klant vertrouwen, en positioneert Remco als een betrouwbare partner voor de lange termijn.

## Wanneer gebruik je deze agent?
Aan het einde van Sprint 5, ná de QA-goedkeuring en vóór de eindafrekening.

---

## Checklist vóór oplevering

Controleer dit voordat je het opleverdocument verstuurt:

**Technisch**
- [ ] DNS correct geconfigureerd, HTTPS actief
- [ ] Alle redirects werken (www → non-www of andersom)
- [ ] Google Search Console aangemeld en geverifieerd
- [ ] Google Analytics actief (indien afgesproken)
- [ ] Sitemap ingediend bij Google
- [ ] Alle formulieren getest (testmail ontvangen)
- [ ] CMS login werkt voor de klant

**Content**
- [ ] Geen Lorem ipsum meer aanwezig
- [ ] Alle afbeeldingen definitief
- [ ] Contactgegevens correct (adres, telefoon, e-mail)
- [ ] KVK-nummer en BTW-nummer in footer/colofon
- [ ] Privacyverklaring actueel
- [ ] Cookiebanner actief

**Overdracht**
- [ ] Klant heeft eigen CMS login (niet gedeeld met Remco)
- [ ] Klant heeft toegang tot hosting dashboard (indien relevant)
- [ ] Klant heeft toegang tot domeinbeheer
- [ ] GitHub repo: klant toegevoegd als read-only (optioneel)
- [ ] Alle wachtwoorden veilig gedeeld (niet via e-mail — gebruik bijv. 1Password of een eenmalige link)

---

## Opleverdocument template

Genereer dit als PDF of nette HTML-pagina voor de klant.

```
PROJECTOPLEVERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project:     [Naam project / website]
Klant:       [Naam bedrijf / contactpersoon]
Datum:       [Datum oplevering]
Gebouwd door: Remco Baumeister — Byggr (remco@byggr.nl)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WAT IS OPGELEVERD

[Korte omschrijving: bijv. "Een responsive website met 6 pagina's,
contactformulier, en een CMS waarmee u zelf teksten en foto's
kunt aanpassen."]

Pagina's:
- [Lijst van alle opgeleverde pagina's]

Functionaliteit:
- [Contactformulier / CMS / Webshop / etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UW WEBSITE — INLOGGEGEVENS

Website URL:     https://[domein]
CMS login:       https://[domein]/admin (of anders)
Gebruikersnaam:  [veilig gedeeld via aparte link]
Wachtwoord:      [veilig gedeeld via aparte link]

Hosting:         [Vercel / Netlify / anders]
Domeinbeheer:    [Vimexx / Transip / anders — met URL]
Google Analytics: https://analytics.google.com
Search Console:   https://search.google.com/search-console

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOE WERKT HET CMS?

[Korte uitleg op maat, bijv.:]

U kunt zelf teksten en afbeeldingen aanpassen via het CMS.
Zo werkt het:

1. Ga naar https://[domein]/admin
2. Log in met uw e-mailadres
3. Kies de pagina die u wilt aanpassen
4. Klik op het veld dat u wilt wijzigen
5. Sla op — de website wordt automatisch bijgewerkt

Wat u zelf kunt aanpassen:
✓ Teksten op alle pagina's
✓ Foto's vervangen
✓ [Specifiek voor dit project]

Wat u beter aan ons kunt overlaten:
✗ Structuur van de site wijzigen
✗ Nieuwe pagina's aanmaken
✗ Technische instellingen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNISCHE DETAILS (voor uw administratie)

Tech stack:      [bijv. HTML/CSS/JS + Decap CMS + Vercel]
Repository:      https://github.com/Baum87/[repo-naam] (privé)
Hosting:         [platform + URL dashboard]
SSL:             Automatisch verlenging via [Let's Encrypt / platform]
Backups:         [Automatisch via platform / handmatig maandelijks]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONDERHOUD & SUPPORT

[Indien onderhoudscontract:]
Uw onderhoudspakket: [Basis / Standaard / Plus — €X/maand]
Inclusief: [korte beschrijving]
Eerste factuurdatum: [datum]

[Indien geen onderhoudscontract:]
U beheert de website zelfstandig. Voor vragen of aanpassingen
kunt u altijd contact opnemen — uurtarief: €85 excl. BTW.

Voor vragen of storingen:
E-mail: remco@byggr.nl
Telefoon: [nummer]
Reactietijd: binnen 1 werkdag

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AANBEVELINGEN VOOR DE EERSTE MAAND

Na de lancering is het slim om het volgende te doen:

□ Deel de website op uw sociale media kanalen
□ Informeer bestaande klanten via e-mail of nieuwsbrief
□ Vraag tevreden klanten om een Google Review te plaatsen
□ Controleer of uw Google Business Profile up-to-date is
□ Stuur ons uw eerste indrukken — feedback is welkom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINANCIEEL AFSLUITING

Offertebedrag:       € [totaal excl. BTW]
Aanbetaling (50%):   € [bedrag] — ontvangen op [datum]
Restbetaling (50%):  € [bedrag] — factuur volgt separaat
Betalingstermijn:    14 dagen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bedankt voor het vertrouwen in Byggr.
Succes met de nieuwe website!

Remco Baumeister | Byggr
remco@byggr.nl
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Na verzending van het opleverdocument

- [ ] Eindfactuur (restbetaling) versturen
- [ ] Google Search Console: indexering aanvragen voor alle pagina's
- [ ] Klant uitnodigen voor onderhoudspakket (indien nog niet getekend)
- [ ] Project archiveren in eigen administratie
- [ ] Noteer: welke vragen stelde de klant? → verbeter de aanlevergids of FAQ
- [ ] Vraag de klant na 4 weken om feedback (en eventueel een referentie)

## Wat je oplevert
1. Ingevuld opleverdocument (PDF of HTML)
2. Veilig gedeelde inloggegevens (los van het document)
3. Korte CMS instructievideo (optioneel, grote meerwaarde — Loom of vergelijkbaar)
4. Eindfactuur klaarstaan voor verzending
