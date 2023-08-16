FROM node:18

LABEL maintainers="Vinicius Pereira + PROOF SOC"
LABEL PRJNAME="zapbot"
ENV TZ="America/Sao_Paulo"

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# These libs are necessary to puppetteer run
# Puppetteer is a dependency of Venom-bot
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt update && \
  apt install -y gconf-service \
  libasound2 libatk1.0-0 libc6 \
  libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 \
  libgconf-2-4 libgdk-pixbuf2.0-0 \
  libglib2.0-0 libgtk-3-0 libnspr4 \
  libpango-1.0-0 libpangocairo-1.0-0 \
  libstdc++6 libx11-6 libx11-xcb1 \
  libxcb1 libxcomposite1 libxcursor1 \
  libxdamage1 libxext6 libxfixes3 libxi6 \ 
  libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation \
  libappindicator1 libnss3 lsb-release  \
  xdg-utils wget libgbm-dev libu2f-udev libvulkan1;
RUN dpkg -i google-chrome-stable_current_amd64.deb

COPY --chown=node:node . /app

USER node

WORKDIR /app

RUN npm install

ENTRYPOINT ["node", "app.js"] 

#HEALTHCHECK CMD curl --fail http://localhost:1888/api/healthcheck
