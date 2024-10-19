# Digitale O-Phase

A virtual city and campus tour for freshmen at the TH Ingolstadt.

Developed by the [Fachschaft Informatik](https://studverthi.de) in cooperation with [Neuland Ingolstadt e.V.](https://neuland-ingolstadt.de/)

Campustour inspired by the [Fachschaft Wiwi of the University of Göttingen](https://hochschulforumdigitalisierung.de/de/blog/o-phase-online).

Studyguide inspired by the [StuV of the OTH Regensburg](https://stuv.othr.de/dein-studienguide/).

## Deployment

Deploy via Docker Compose:

```yaml
version: "3"

services:
  app:
    #build: https://github.com/neuland-ingolstadt/orientierungsphase.git#main
    build: ./orientierungsphase
    restart: always
    init: true
    environment:
      - TZ=Europe/Berlin
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ophase.rule=Host(`ersti.neuland.app`)"
      - "traefik.http.routers.ophase.entrypoints=https"
      - "traefik.http.routers.ophase.tls=true"
      - "traefik.http.routers.ophase.tls.certresolver=le"

networks:
  web:
    external: true
```

## Transcoding

Transcode a folder full of videos:

```bash
for i in *.mp4; do ffmpeg -i "$i" -c:a copy -c:v libx264 -vf scale=1280:720 "../web/$i"; done
```

Generate poster images:

```bash
for i in *.mp4; do ffmpeg -i "$i" -vframes 1 -vf scale=1280:720 "../poster/$(basename "$i" .mp4).jpg"; done
```

Then add the video / poster URLs to `./data/tour.json`.

## License

AGPL-3.0, except for the `data/` folder.
