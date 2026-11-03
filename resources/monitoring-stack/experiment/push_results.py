"""Push final results of a short experiment (one that ends before Prometheus can scrape it).

    pip install prometheus-client
    python push_results.py
"""
import time

from prometheus_client import CollectorRegistry, Gauge, push_to_gateway

registry = CollectorRegistry()
accuracy = Gauge("experiment_final_accuracy", "Accuracy at the end of the run", ["model"], registry=registry)
duration = Gauge("experiment_duration_seconds", "Wall-clock time of the run", ["model"], registry=registry)
success = Gauge("batch_job_success", "1 if the run finished without error", registry=registry)

start = time.time()
result = 0.947                       # <- run your experiment here and collect its result
accuracy.labels(model="xor-arbiter-lr").set(result)
duration.labels(model="xor-arbiter-lr").set(time.time() - start)
success.set(1)

push_to_gateway("localhost:9091", job="puf-attack-sweep", registry=registry)
print("pushed")
