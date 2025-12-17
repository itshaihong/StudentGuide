---
layout: default
title: SatCat User Guide
nav_order: 3
---

# 🛰️ Guide to Using Satcat.com

{: .important }
> **Disclaimer**
> *This guide is based on my own experience, including several functions that I use more frequently. But feel free to explore other functionalities following their documentations! However, be cautious that their documentation is not THE MOST DETAILED :P, maybe need some trail and error.
Maybe you can also keep this document updated so it's a great reference for any other people who want to use it!*

## 1. What is Satcat?
Satcat is a data aggregation platform for spaceflight safety, used by satellite operators to assess conjunction risk, maintain orbit custody, and coordinate maneuvers in an ever-growing congested space environment. Satcat combines operator-submitted ephemerides, commercial catalog data, and third party sensor networks to evaluate conjunction events and deliver data through APIs and standard file formats.

## 2. Satcat website

### 2.1. Satellite Directory \[**Directory tab**\]
You can search for satellite directory here using satellite name/NORAD ID/COSPAR ID. It provides all related information for each traked satellite, including:
* Launcher & manufacturer
* Dimensions and other physical properties
* Visibility
* Orbit information: TLE data, Ephemerides
* Conjuctions
* etc...


{: .note}
> **NORAD ID**: The North American Aerospace Defense Command (NORAD) maintains the satellite catalog. Each tracked object is assigned a unique identifier known as the SATCAT number or NORAD ID.

> **Two-Line Element (TLE)** is a standard, text-based data format that concisely describes the orbit of an Earth-orbiting satellite or space object at a specific time (epoch). TLEs contain simplified Keplerian elements (like inclination, eccentricity, mean motion) plus drag/perturbation factors, allowing users to predict future positions and velocities using models like SGP4.

> **Ephemeris** is a table or dataset providing the predicted positions, velocities, and sometimes other data (like brightness) for satellites. There are 3 main types of files: OPM, OMM, and OEM.

### 2.2. Screening for Conjunctions \[**Screenings tab**\]
Screening allows you to submit a job to search for conjunctions providing a primary and/or secondary satellite. 

* Click one **New Screening Job**.
* Enter a title for this screening job at **Screening job title**.
* In the **Primary RSOs** field, you can search for the Ephemeris file of your primary satellites from the database, or upload your own Ephemeris file/TLE by clicking **Upload custom data**.
* In the **Secondary RSOs** field, upload Ephemeris file for your secondary satellite in the same manner. If you don't have a desired secondary satellite and want to do a general screening, you can tick the box of **Screen 18th SDS catalog**/**Screen Ephemeris Repository**, which will search through the database for all conjunctions related to primary satellite.
* When done, click **Start Screening job**.

Your screening job will appear as a box in panel with all the screening jobs. The update of search result is asychronous (other jobs can be carried out while one is running). You might observe the number of conjunctions detected keeps changing for a few minutes if the search space is big. When the job is finished, the top right conrner of your job will change to tick.

Click into one of the screening job box to see all the found conjunctions. Click into one of the boxes of conjunctions will bring you to **Conjunction tab**.


### 2.3. Conjunction Information \[**Conjunctions tab**\]
Each conjunction has a series of information associated with it. Including propability of collision (Pc), time of closest approach (TCA), miss distances, etc... You can read these directly from the website or download the conjunction data message (CDM) file.

### 2.4. Other useful tools
* **Sandbox tab**: to visualize 2 satellites movements. Upload TLE, or Ephemeries files, or simply search for them in the Ephemeris database. Satcat can generate a 3D animation for 2 satellites' orbit, as well as graphs for 2 satellites' relative ranges.

* **Tools tab**: time converter to convert timestamp across different formats, and TLE comprehension assistants to help you parse TLE and understand differnet segments.

**And some more to be explored...**



## 3. Satcat SDK

The Satcat SDK is a Python client library for automating interactions with Satcat's spaceflight safety services. It allows users to fetch event data, upload and manage ephemerides, trigger catalog screenings, and manage operational state—all without needing to manually interact with the web interface.

Follow the instructions here at [Satcat SDK \| Satcat Documentation](https://docs.satcat.com/satcat-sdk/) and [SDK full documentation](https://satcat-sdk-6d03a4.gitlab.io/latest/pages/SDK/index.html) to install the Python package, configure API key, and start coding!

You can perform the same functionanilty (get conjunctions, get ephemeris, ...) as you can do on Satcat website, but in Python scripts.

