## dREAM-cACHER interface file structure

- `app`: where central parts of the interface are stored
  - `environment.js`: the three.js environment. initializes and manages three.js camera, scenes, and renderer
  - `view.js`: manages the DOM
  - `model.js`: makes API calls, passes data to the view
  - `controller.js`: binds event handlers to the DOM that coordinate between the model, view, and environment


- `services`: a collection of shared utilities


- `index.js`: the interface's entry point. sets `environment` as a global variable, initializes controller, and uses controller to bind event listeners
