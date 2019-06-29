FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html/build && mkdir -p /usr/share/nginx/html/data
COPY radar.html /usr/share/nginx/html/index.html
COPY build/* /usr/share/nginx/html/build/
COPY data/* /usr/share/nginx/html/data/
EXPOSE 8080
