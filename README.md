<!-- markdownlint-disable first-line-h1 -->
<!-- markdownlint-disable html -->
<!-- markdownlint-disable no-duplicate-header -->

# Super Sonar

<hr>
<p align="center">
<a href="https://github.com/NewFolder6/supersonar/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/NewFolder6/supersonar?style=flat&color=yellow"/></a>
<a href="mailto:hotinyuk@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Contact-Email-red"/></a>
</p>

## Overview

Supersonar is an application that uses machine learning to identify sound sources, their directions, and characteristics. Initially focused on processing game audio (Minecraft) to recognize and visualize sound locations in a virtual environment, with plans to expand to real-world audio environments. This application has potential as an accessibility solution by providing visual representations of audio cues.

## Documentation

- [Installation Guide](docs/installation.md)
- [Available Scripts](docs/scripts.md)
- [Dependencies](docs/dependencies.md)

## Repository Structure

```plaintext
supersonar/
├── app/              
│   ├── client/        
│   └── server/
├── data/
│   ├── recordings/
│   └── template/   
├── docs/ 
├── tools/
│   ├── audio/
│   ├── minecraft-extractor/
│   └── scripts/            
├── package.json       
└── README.md          
```

## Quick Start

### Requirement

- Node.js 14 or higher
- npm 6 or higher

### Installation

Ensure that you have Node.js installed. It is recommended to use the latest version.

```bash
# Clone the repository 
git clone https://github.com/NewFolder6/supersonar.git

# Navigate to project directory
cd supersonar

# Install dependencies
npm install
```
