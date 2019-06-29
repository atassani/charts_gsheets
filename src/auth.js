export function handleClientLoad() {
  var config = {
    questionsjson: "data/questions.json",
    params: {
      teamName: radar.getParameterByName("teamName")
    }
  };
  radar.loadData(config);
}
