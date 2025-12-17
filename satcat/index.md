---
layout: default
title: SatCat User Guide
nav_order: 3
---

# 🛰️ Guide to Using Satcat.com

{: .important }
> This page is still under update. Will notify when it's finished

{: .important }
> **Disclaimer**
> This guide is based on my own experience, including several functions that I use more frequently. But feel free to explore other functionalities following their documentations! However, be cautious that their documentation is not THE MOST DETAILED :P, maybe need some trail and error.
Maybe you can also keep this document updated so it's a great reference for any other people who want to use it!

## 1. What is Satcat?
Satcat is a data aggregation platform for spaceflight safety, used by satellite operators to assess conjunction risk, maintain orbit custody, and coordinate maneuvers in an ever-growing congested space environment. Satcat combines operator-submitted ephemerides, commercial catalog data, and third party sensor networks to evaluate conjunction events and deliver data through APIs and standard file formats.

## 2. Satcat website

# 1. Searching and Filtering
Describe the main search features here: basic search by name, advanced filtering by launch year, orbit type, etc.

NORAD ID: The North American Aerospace Defense Command (NORAD) maintains the satellite catalog. Each tracked object is assigned a unique identifier known as the SATCAT number or NORAD ID.

* **Example Query:** Search for the International Space Station (ISS) using its NORAD ID (25544) or name.

# 2. Retrieving TLE Data
Two-Line Element (TLE) sets are the standard format for communicating orbital state vectors. You will usually retrieve these from Satcat.com.

* **Format:** TLEs are composed of two 69-character lines of data (plus an optional header line).
* **Usage:** TLEs are essential for performing orbit propagation (predicting future position).

# 3. Visualizing Orbits
(Describe any built-in visualization tools Satcat.com might have, or how to export data for external tools like GMAT or Python libraries.)

## 3. Satcat SDK


