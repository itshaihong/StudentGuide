---
title: Guide to Setup reComputer
layout: default
permalink: /recomputer-guide/
---

# reComputer J30/40 Setup Guide

This guide walks you through setting up your reComputer J30/40, based on the NVIDIA Jetson platform, to prepare it for deploying Edge AI projects.

---

## 1. Hardware Connection

Connect the necessary peripherals to power on and operate the device:
* **Ethernet:** Connect an Ethernet cable to the ethernet port.
* **Input Devices:** Connect a mouse and keyboard to the USB ports.
* **Display:** Connect a monitor via the HDMI ports.
* **Power:** Connect the power adapter to the power port.

## 2. Initial Power On and OS Setup

The reComputer comes pre-installed with an Ubuntu system.

* Power on the device and complete the standard Ubuntu system setup (setting username, password, timezone, etc.).
* **If you are new to Linux and the terminal,** you can familiarize yourself with basic commands and navigation using resources like: [The Linux command line for beginners](https://ubuntu.com/tutorials/command-line-for-beginners).

## 3. Check and Install Required Packages

Log in to your Ubuntu system, open the terminal, and run the following commands to install necessary tools and configure the power mode:

```bash
# Install pip (Python package installer)
sudo apt update
sudo apt install python3-pip

# Install jetson-stats for monitoring and management
sudo pip3 install jetson-stats

# Set Power Mode to MAX_N for full performance (Mode 0)
sudo nvpmodel -m 0
```

**Important**: After executing these commands, you must **Reboot the device**.

## 4. Docker Runtime Environment Configuration
Docker simplifies the deployment of complex AI projects by packaging applications and dependencies into standardized containers.

* Docker is an open-source platform designed to simplify the process of developing, shipping, and running applications. It achieves this by using containerization, a lightweight virtualization method that packages an application along with all its dependencies, libraries, and configurations into a single unit called a container. This ensures that the application runs consistently across different environments.

* To configure Docker specifically for the NVIDIA Jetson environment, follow the official documentation: [🔖 SSD + Docker - NVIDIA Jetson AI Lab](https://www.jetson-ai-lab.com/tips_ssd-docker.html#docker) (Docker chapter)

* Once configured, your device is ready to deploy containerized Edge AI projects!

## 5. Explore Jetson Examples
The following repository provides pre-built examples for running various AI models and applications on NVIDIA Jetson devices with a single command: [Seeed-Projects/jetson-examples on GitHub](https://github.com/Seeed-Projects/jetson-examples).

## 6. Advanced Performance and Deployment
If you require faster inference speeds, model tuning, or wish to train your own models:

* Refer to this guide which details optimizing a trained AI model for the NVIDIA Jetson Platform using the high-performance inference engine, TensorRT, and the multi-stream processing framework, [DeepStream SDK: Deploy YOLOv8 with TensorRT and DeepStream SDK](https://wiki.seeedstudio.com/YOLOv8-DeepStream-TRT-Jetson/).
