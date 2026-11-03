#!/usr/bin/env bash
# Run any command and push its outcome to the Pushgateway.
# Usage: ./run_batch_job.sh <job-name> <command...>
# Example: ./run_batch_job.sh nightly-backup tar czf /backup/data.tgz /data
set -uo pipefail
PUSHGATEWAY="${PUSHGATEWAY:-http://localhost:9091}"
JOB="$1"; shift

start=$(date +%s.%N)
"$@"; status=$?
end=$(date +%s.%N)
duration=$(echo "$end - $start" | bc)
success=$([ "$status" -eq 0 ] && echo 1 || echo 0)

cat <<METRICS | curl -s --data-binary @- "$PUSHGATEWAY/metrics/job/$JOB/instance/$(hostname)"
# TYPE batch_job_duration_seconds gauge
batch_job_duration_seconds $duration
# TYPE batch_job_success gauge
batch_job_success $success
# TYPE batch_job_last_run_timestamp_seconds gauge
batch_job_last_run_timestamp_seconds $(date +%s)
METRICS

echo "job=$JOB status=$status duration=${duration}s pushed to $PUSHGATEWAY"
exit "$status"
