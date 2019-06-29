export {version} from "../build/package";
export {
  default as loadData,
  areas as areas,
  reverseAreas as reverseAreas
} from "../src/dataLoader";
export {
  default as drawChart,
  paintPoints as paintPoints
} from "../src/chartBuilder";
export {
  handleClientLoad as handleClientLoad
} from "../src/auth";
export {default as getParameterByName} from "../src/params";
export {random as random} from "../src/random";
