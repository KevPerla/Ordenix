#!/usr/bin/env bash
set -euo pipefail

RDS_CA_URL="https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem"
RDS_CA_DIR="certs"
RDS_CA_PATH="${RDS_CA_DIR}/rds-global-bundle.pem"
RDS_CA_TMP_PATH="${RDS_CA_PATH}.tmp"

npm ci --include=dev
npm run build

mkdir -p "${RDS_CA_DIR}"
trap 'rm -f "${RDS_CA_TMP_PATH}"' EXIT

curl \
  --fail \
  --silent \
  --show-error \
  --location \
  "${RDS_CA_URL}" \
  --output "${RDS_CA_TMP_PATH}"

test -s "${RDS_CA_TMP_PATH}"
grep -q -- '-----BEGIN CERTIFICATE-----' "${RDS_CA_TMP_PATH}"
grep -q -- '-----END CERTIFICATE-----' "${RDS_CA_TMP_PATH}"

mv "${RDS_CA_TMP_PATH}" "${RDS_CA_PATH}"
trap - EXIT
