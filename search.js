const Nightmare = require("nightmare");
const vo = require("vo");
const fs = require("fs-extra");

vo(run)(function(err) {
  console.log("saving...");
});

const exportCSV = (content, name) => {
  let formatCSV = "";
  for (var i = 0; i < content.length; i++) {
    var value = content[i];
    for (var j = 0; j < value.length; j++) {
      var innerValue = value[j] === null ? "" : value[j].toString();
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) formatCSV += ",";
      formatCSV += result;
    }
    formatCSV += "\n";
  }
  fs.mkdirsSync("./csv");
  fs.writeFile(`./csv/${name}.csv`, formatCSV, "utf8", err => {
    if (err) {
      console.log("failed...");
    } else {
      console.log(`${name}.csv has been saved!`);
    }
  });
};

function* run() {
  const nightmare = Nightmare({
    show: true
  });

  const query = process.argv.splice(2).reduce((a, b) => a + b);

  yield nightmare
    .goto("https://google.com")
    .type(
      "#tsf > div:nth-child(2) > div > div.RNNXgb > div > div.a4bIc > input",
      query
    )
    .click(
      '#tsf > div:nth-child(2) > div > div.FPdoLc.VlcLAe > center > input[type="submit"]:nth-child(1)'
    )
    .wait("div.rc")
    .evaluate(query => {
      var results = document.querySelectorAll("div.rc");
      var links = [];
      for (var i = 0; i < results.length; i++) {
        if (results[i].querySelector("span.st")) {
          links.push(results[i]);
        }
      }

      var csv = [[query, "", ""], ["title", "url", "discription"]];

      for (var i = 0; i < links.length; i++) {
        csv.push([
          links[i].querySelector("a").innerText.split("\n")[0],
          links[i].querySelector("a").href,
          links[i].querySelector("span.st").innerText
        ]);
      }
      return csv;
    }, query)
    .end()
    .then(csv => {
      exportCSV(csv, query);
    });
}
