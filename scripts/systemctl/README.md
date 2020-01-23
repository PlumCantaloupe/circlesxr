# SystemCTL Services

This folder contains SystemCTL service files. To install, as root, copy them to
`/etc/systemctl/system/` and then run `systemctl enable {file}`. This will
symlink it into the proper place. Then, the service can be started with
`systemctl start {service}`.

The service name is simple the name of the original service file with or without
`.service` at the end; both work.

## Janus Service

The `janus-sfu.service` service will start up Janus in the background so that it
can run indefinitely.
