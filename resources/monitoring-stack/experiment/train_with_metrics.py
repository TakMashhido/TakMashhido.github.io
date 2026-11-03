"""Expose live metrics from a long-running experiment so Prometheus can scrape them.

    pip install prometheus-client
    python train_with_metrics.py          # metrics at http://localhost:8000/metrics

Replace the fake training loop with your own code; keep the metric updates.
"""
import math
import random
import time

from prometheus_client import Counter, Gauge, Histogram, start_http_server

LOSS = Gauge("experiment_loss", "Current training loss")
ACCURACY = Gauge("experiment_accuracy", "Current validation accuracy (0-1)")
EPOCH = Gauge("experiment_epoch", "Current epoch")
LR = Gauge("experiment_learning_rate", "Current learning rate")
STEPS = Counter("experiment_steps", "Training steps completed")  # exported as experiment_steps_total
STEP_TIME = Histogram(
    "experiment_step_duration_seconds",
    "Time per training step",
    buckets=(0.05, 0.1, 0.2, 0.3, 0.5, 1, 2),
)
LAST_STEP = Gauge("experiment_last_step_timestamp_seconds", "Unix time of the last completed step")


def train(epochs: int = 50, steps_per_epoch: int = 100) -> None:
    lr = 0.01
    for epoch in range(epochs):
        EPOCH.set(epoch)
        LR.set(lr)
        for step in range(steps_per_epoch):
            with STEP_TIME.time():                      # measures how long this block takes
                time.sleep(random.uniform(0.08, 0.25))  # <- your real training step goes here
            progress = epoch + step / steps_per_epoch
            LOSS.set(2.3 * math.exp(-progress / 8) + random.uniform(0, 0.05))
            STEPS.inc()
            LAST_STEP.set_to_current_time()
        ACCURACY.set(min(0.99, 1 - math.exp(-(epoch + 1) / 6) + random.uniform(-0.01, 0.01)))
        lr *= 0.95


if __name__ == "__main__":
    start_http_server(8000)   # serves /metrics in a background thread
    train()
