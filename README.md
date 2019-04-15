# Mandelbrot-Fractal Explorer
Mandelbrot-Fractal Explorer revamped version of the [Fractalvalley.net](http://fractalvalley.net/),a framework for hardware-accelerated web applications using cloud FPGAs with a demo application for exploring Mandelbrot fractals.

It is a Single-Page App (SPA) written in standard web technologies [HTML5](http://whatwg.org/html), [SCSS](http://sass-lang.com) and [TypeScript](http://www.typescriptlang.org). It leverages the popular [Angular](https://angular.io/) framework and [Angular Material](https://material.angular.io/) for material design components.

## Project Overview
The Project is a framework for hardware-accelerated web applications using cloud FPGAs with a demo application for exploring Mandelbrot fractals. Standard web protocols, WebSockets and REST APIs, will be able to stream custom data structures directly from software into hardware and visa-versa. This project is the development vehicle for an open-source framework for accelerating web applications (or services) using cloud FPGAs.

This Project was developed by considering the reference of the project [fpga-webserver](https://github.com/alessandrocomodi/fpga-webserver),where `fractal-image` component renders the Mandelbrot-Fractal Image.
`fractal-image` component completely relys on [fpga-webserver] as we make GET request(JSON) to the server to fetch the fractal-image.

## Status
This repository is a work-in-progress and will continue to evolve in future.Now it only contain `Fractal-image` component that renderes the fractal-image .Over the summer I have planned to add all the exisitng feature including improved performance optimization and develop a native custom component for “Fractal-Image”, so that anyone can use it in any environment and make the existing website more user interactive by adding the feature like image/video sharing of Fractal flythrough, Gallery, etc

## Directory Structure
- `e2e`: end-to-end testing folder.
- `src`: 
    - `app`: containing all the parts of the app.
    - `assets`: containing general assets.
    - `environments`: configuration for various environments.
    - `index.html`: the firstborn file of the entire app.
    - `style.css`: the main styling sheet of the app (here can be included Angular Material themes). 
    - ` main.ts, polyfill.ts, test.ts`: bootstrapping of the relevant parts of the app.
    
- `README`: general information about the app and “Getting Started”.
- `angular.json`: defines the black list for GIT.


## Getting started

1. Ensure you have the following installed in your system:

    [`git`](https://git-scm.com/downloads)

    [`npm`](https://nodejs.org/en/download/)

2. Install [angular-cli](https://github.com/angular/angular-cli) globally.
```
npm install -g @angular/cli@6.2.3
```

3. Clone the project locally into your system.
```
git clone https://github.com/meetcric/mandelbrot-fractals
```

4. `cd` into project root directory and make sure you are on the master branch.

5. Install the dependencies.
```
npm install
```

6. To preview the app, run the following command and navigate to `http://localhost:4200/`.
```
ng serve
```
### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).
