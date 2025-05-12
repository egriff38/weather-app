# TODO List
These items are updates I intend to make now that the main application has reached 0.2.0

## Code Quality
- [ ] Create a class in the frontend that holds the raw location and includes a method for getting the temperature; substitute the direct call to get the temperature 
- [ ] Create utility functions for all of the parametric UI things (which icon to show, color choices, etc.)
- [ ] Add e2e tests to the top level of the project, to verify user interactions work with playwright

## UI Style
- [x] Current City should show in title (use vueuse's `useTitle()`) composable with the current city
- [x] Current City should be shown in the CitySearch box when selected, and styling should be more prominent to show that it is the currently selected item rather than a text input
- [ ] Update style: Dashboard should be a frosted pane with a collection of cards styled with [nuomorphism](https://neumorphism.io).
- [ ] Add Icons to the various panes to reflect the weather conditions (consider [weather-icons](https://www.npmjs.com/package/@iconify-json/wi) with [unplugin-icons](https://github.com/unplugin/unplugin-icons))
- [ ] Change the color of the page to reflect the overcast + time of day/night
- [ ] Change the direction of the shadows for the cards based on the time of day
- [ ] Add a link to the Github repo from the website
- [ ] Allow Vueuse's `useFavicon()` to set the favicon image to an icon and color reflecting the weather and time-of-day respectively.

## UX
- [ ] Add a slider for time of day (should fetch new forecasts)
- [ ] Put the whole view in a carousel to view multiple locations
- [ ] Add the ability to save multiple locations, either to browser storage, or...
- [ ] Allow OAuth 2 social login with google to save locations between machines
- [ ] Add a button to pull current location

## Documentation
- [ ] Add an explanation of the RPC + Types / workspaces pattern
- [ ] Add a setup guide for all of the dependencies not included in pnpm (aws, op, etc.)
- [ ] Add an example env file, or a shell script that prompts the user to get the stuff to build one
- [ ] Add link to website at the top of the README