---
title: PUF simulator
summary: Two chips from the same design, two different fingerprints. Set a 16-bit challenge and watch simulated arbiter PUFs answer it, right in your browser.
url: /play/puf-simulator/
category: Research
status: Live
date: 2026-11-02
tags: [PUF, Hardware security]
stack: [TypeScript, Astro]
post: how-a-puf-works
art: chip
---

## What it does

A physical unclonable function (PUF) turns tiny, random manufacturing differences inside a chip into a digital fingerprint that nobody can copy, not even the factory that made the chip. This app simulates two such chips built from the same design and lets you compare how they answer the same question.

## How to use it

1. **Set a challenge.** Click the 16 bits to flip them between 0 and 1, or press **Random challenge**.
2. **Press "Ask both chips".** Chip A and Chip B each return a 16-bit response.
3. **Compare.** Bits where the two chips disagree get a yellow ring, and the summary tells you how many bits differ. For a good PUF, about half of them should.

Ask the same challenge again and each chip gives the same answer: that repeatability is what makes a PUF useful for authentication.

## How it works

Each response bit comes from an arbiter PUF modelled with the standard additive delay model. Every chip gets its own random delay values, drawn once from a fixed seed, so a chip keeps the same "silicon" on every visit. The challenge decides which path the signal takes through each stage, and the sign of the total delay difference gives the bit.

Everything runs locally in your browser; nothing is sent anywhere.
