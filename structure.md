# dreamcacher structure

## interface

- `application.js`
- `auth.js`
- `geometryChooser.js`
- `helpers.js`

## mvc

- `model.js`
  - called by controller
  - makes ajax calls and then updates the view
  - dependencies:
    - jquery
    - j-toker
    - view.js
- `view.js`
  - puts dreams on screen
  - managing active tabs
  - managing modals
  - clearing shit
  - dependencies
    - jquery
    - THREE
    - THREE.geometryChooser
    - j-toker
      - to see if someones logged in or not
    - `model.js` for calling `#getAllDreams`
- `controller.js`
  - binding event listeners,
    - coordinating model and view
  - dependencies
    - model
    - view
    - jtoker
    - 'environment'
      - `renderer` specifically

## order loaded

- `jquery`
- `j-toker` and dependencies
- `bootstrap.js`
- `moment.js`

- `controller.js`
- `model.js`
- `view.js`

- `helpers.js`

- `three.js`
- `flycontrols`
- `threex.windowresize`
- `three.noiseshadermaterial`
- `geometryChooser` extension

- `auth`
- `application.js`

## rough idea of new file structure
  - environment: {
    scene: ,
    camera: ,
    renderer:
  } // everything related to three.js environment
  - Interface/view (interactions with the DOM)
  - RecordsInterface (makes calls to API)
