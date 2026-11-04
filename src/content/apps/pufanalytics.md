---
title: PUFAnalytics
summary: Evaluate PUFs in your browser. Get quality metrics with confidence intervals, identification error rates, NIST tests, attack curves and key sizing, with the same numbers as the Python package.
url: https://koustav.isroot.in/PUFAnalytics/
category: Research
status: Live
date: 2026-11-04
tags: [PUF, Hardware security, Statistics]
stack: [JavaScript, Web Workers, SVG, Python, NumPy]
repo: https://github.com/TakMashhido/PUFAnalytics
paper: mondal2025pufanalytics
post: pufanalytics-guide
art: chip
screenshot: /images/apps/pufanalytics.webp
screenshotAlt: PUFAnalytics overview of a demo Arbiter PUF population, with a quality index of 94, NIST results, bit error rate and a radar chart
featured: true
---

## What it does

PUFAnalytics turns raw PUF read-outs into the numbers a hardware-security paper needs:

- **Quality metrics.** Uniformity, bit-aliasing, uniqueness, reliability, steadiness and per-condition bit error rate, each with a bootstrap confidence interval.
- **Identification.** Decidability, equal error rate, and false-acceptance and false-rejection rates extrapolated far below what the sample can show.
- **Randomness.** Eight NIST SP 800-22 tests and SP 800-90B entropy estimates.
- **Attacks and keys.** Machine-learning attack curves, and sizing for the error correction a key needs.

It also simulates seven kinds of PUF, runs Monte-Carlo sweeps, and draws 18 publication figures. You leave with a LaTeX table, a Markdown report, a methods paragraph and a Python script that reproduces every number.

Everything runs in your browser. Your data is never uploaded, and the app works offline.

## How to use it

1. **Load data.** Press *Explore a demo population*, simulate a PUF under *Data & simulation*, or drop in a CSV, TXT, JSON or NumPy file of your own measurements.
2. **Read the overview.** It shows a quality index, gauges for each headline metric, and the distance distributions.
3. **Work down the sidebar.** Go through *Quality metrics*, *Identification*, *Randomness & entropy*, *Attack lab* and *Key generation* in order. Each view links to its own method notes.
4. **Export.** *Report & export* gives you the tables, figures, JSON and a reproduction script. *Figure studio* downloads every figure as SVG, PNG and CSV in one zip.

## How it works

The web app's analysis engine is a line-by-line port of the PUFAnalytics Python package. It runs in a Web Worker so the page stays responsive. Both versions draw random numbers from the same portable generator (xoshiro128\*\*), so a population simulated with a given seed is identical in the browser and in Python. A parity test of more than 2,400 checks enforces this on every change. The blog post walks through every view and lists the full Python API.
