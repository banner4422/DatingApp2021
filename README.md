# Dating App 2021
Lavet af Alexander, Ameer, Christian og Jonas 🍻

## Hvordan man opsætter development environment for Azure Functions
1. Download de to filer som findes [her](https://discord.com/channels/807236335445213224/829644283543289936/830529678967046154) (du skal have discord åben før du klikker på ''her) eller gå ind i #programmering på Discord serveren og download de to sidste filer jeg har uploaded
2. Indsæt de to filer ind i dating app mappen, for at være forbundet med databasen
3. `npm install` i terminalen for at downloade NPM packages
4. Start Azure Functions ved at skrive `func start` eller `npm start` i terminalen

Azure opdaterer selv hvis man f.eks. ændrer i en function, ændrer navn, tilføjer en ny function osv.

Åben og luk Visual Studio Code hvis du helt skal lukke Azure Functions
## Hvordan man opsætter development environment for React Frontend
Man kan godt arbejde i React og Azure Functions som opstilling er normalt, hvis man åbner en terminal som er inde i ./frontend mappen hvor man runner React

Man kan dog også godt åbne et nyt vindue som åbner ./frontend
1. Åben en terminal som er inde i ./frontend
2. Skriv `npm install` (download kan godt tage lidt tid, React fylder ca. et halvt GB)
3. Lav en `.env` fil i ./frontend mappen som gemmer environment variables
4. Lav følgende linje: `REACT_APP_backend=localhost:7071` og gem (gør det nemmere at ændre port evt. upload React)
5. Start React ved at skrive `npm start` i terminalen

React opdaterer selv når du laver ændringer (ligesom liveserver)

## Good practices for hver gang man åbner projektet
1. `git pull` for at hente opdateringer
2. `npm install` for at hente opdateringer eller nye packages

## Hvordan laver jeg en ny Azure Function?
Du kan nemt kopiere en Azure Function mappe og rename den til noget nyt, easy
