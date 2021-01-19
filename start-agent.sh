docker run \
  -d --restart unless-stopped \
  --name newrelic-statsd \
  -h $(hostname) \
  -e NR_ACCOUNT_ID=1147177 \
  -e NR_API_KEY="ADD_KEY_HERE" \
  -e TAGS="ingest:false" \
  -p 8125:8125/udp \
  newrelic/nri-statsd:latest