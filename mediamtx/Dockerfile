FROM alpine as download

ARG TARGETARCH
ARG VERSION

RUN apk add --no-cache curl tar

WORKDIR /download

RUN curl -L -o mediamtx.tar.gz https://github.com/bluenviron/mediamtx/releases/download/${VERSION}/mediamtx_${VERSION}_linux_${TARGETARCH}.tar.gz && \
    tar -xzf mediamtx.tar.gz && \
    rm mediamtx.tar.gz

FROM alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=download /download/mediamtx /app/

CMD ["./mediamtx"]
