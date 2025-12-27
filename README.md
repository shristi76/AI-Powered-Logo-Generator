# AI Powered Logo Generator

An AI-powered web application that generates logo designs from user-provided text prompts using Hugging Face Stable Diffusion XL.

This project focuses on integrating modern AI inference APIs with a full-stack JavaScript application while following clean architectural and design practices.

---

## Overview

The AI Powered Logo Generator allows users to describe a logo idea and receive an AI-generated logo image.  
The application demonstrates prompt engineering, backend API handling, rate limiting, and binary image processing.

---

## Key Features

- Text-to-image logo generation
- Hugging Face Stable Diffusion XL integration
- Prompt templating for consistent logo outputs
- Server-side rate limiting
- Responsive and minimal user interface
- Download generated logos in WEBP format

---

## Core Concepts Demonstrated

- RESTful API design using Express.js
- AI inference using Hugging Face Router API
- Prompt engineering for design-oriented image generation
- Handling binary image responses
- Client–server communication
- Basic request throttling
- Responsive UI design principles

---

## Technology Stack

**Frontend**
- HTML
- CSS
- Vanilla JavaScript

**Backend**
- Node.js
- Express.js
- Hugging Face Inference API

---
## Project Structure

AI-Powered-Logo-Generator/
│
├── server/
│ ├── public/
│ │ ├── index.html
│ │ ├── style.css
│ │ └── script.js
│ │
│ ├── index.js
│ ├── rateLimiter.js
│ ├── promptBuilder.js
│ ├── .env
│ └── package.json


---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Hugging Face account with API access

---

### Installation

```bash
git clone https://github.com/your-username/AI-Powered-Logo-Generator.git
cd AI-Powered-Logo-Generator/server
npm install


Create a .env file inside the server directory:
HF_API_KEY=your_huggingface_access_token


node index.js


---

## DEMO



