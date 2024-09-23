# LekseHjelp

En applikasjon for å hjelpe deg med å håndtere mange lekser samtidig, og samle informasjon på ett sted.

## Kjøring (produksjon)

Her trenger du Docker installert.

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/LekseHjelp
# Bygg og kjør Docker-filen
$ docker compose up --build -d
```

## Utvikling

Du trenger Node installert, nåverende LTS er 20.17

```bash
# Klon repositoriet
$ git clone https://github.com/BluDood/LekseHjelp
# Installer node_modules, og start serveren i utviklings-modus
$ npm i
$ npm run dev
# Åpne en ny terminal
# Installer node_modules, og start nettsiden i utviklings-modus
$ cd web
$ npm i
$ npm run dev
```

## Credits

- BluDood
