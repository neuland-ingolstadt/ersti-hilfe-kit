# Digitale O-Phase

A virtual city and campus tour for freshmen at the TH Ingolstadt.

Developed by the [Fachschaft Informatik](https://www.thi.de/hochschule/ueber-uns/hochschulgremien/studierendenvertretung) in cooperation with [Neuland Ingolstadt e.V.](https://neuland-ingolstadt.de/)

Inspired by the [Fachschaft Wiwi of the University of Göttingen](https://hochschulforumdigitalisierung.de/de/blog/o-phase-online).

## Deployment

Deploy via Docker Compose:

```
version: "3"

services:
  app:
    build: https://github.com/neuland-ingolstadt/orientierungsphase.git#main
    restart: always
    environment:
      - TZ=Europe/Berlin
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ophase.rule=Host(`o-phase.neuland.app`)"
      - "traefik.http.routers.ophase.entrypoints=https"
      - "traefik.http.routers.ophase.tls=true"
      - "traefik.http.routers.ophase.tls.certresolver=le"
  assets:
    image: nginx
    restart: always
    volumes:
      - ./html:/usr/share/nginx/html:ro
    networks:
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.assets.rule=Host(`assets.neuland.app`)"
      - "traefik.http.routers.assets.entrypoints=https"
      - "traefik.http.routers.assets.tls=true"
      - "traefik.http.routers.assets.tls.certresolver=le"

networks:
  web:
    external: true
```

## Transcoding

Transcode a folder full of videos:
```
for i in *.mp4; do ffmpeg -i "$i" -c:a copy -c:v libx264 -vf scale=1280:720 "../web/$i"; done
```

Generate poster images:
```
for i in *.mp4; do ffmpeg -i "$i" -vframes 1 -vf scale=1280:720 "../poster/$(basename "$i" .mp4).jpg"; done
```

Then add the video / poster URLs to `./data/tour.json`.
