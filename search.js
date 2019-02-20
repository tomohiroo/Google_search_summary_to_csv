const Nightmare = require("nightmare");
const vo = require("vo");
const fs = require("fs-extra");
const argv = require("argv");

vo(run)(function(err) {
  console.log("saving...");
});

const exportCSV = (content, name) => {
  const formatCSV = content.reduce(
    (prevRow, nextRow) =>
      prevRow +
      "\n" +
      nextRow.reduce((prevItem, nextItem) => prevItem + ',"' + nextItem.split('。').join("。\n") + '"')
  );

  fs.mkdirsSync("./csv");
  fs.writeFile(`./csv/${name}.csv`, formatCSV, "utf8", err => {
    if (err) {
      console.log("failed...");
    } else {
      console.log(`./csv/${name}.csv has been saved!`);
    }
  });
};

function* run() {
  const nightmare = Nightmare({
    show: true
  });

  const query = argv.run().targets.reduce((a, b) => a + " " + b);

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

      var csv = [[query, "", ""], ["rank", "title", "url", "ユーザーの意図", "description", "アウトライン", "記事のいいところや他にない情報・気付き", "自分が書く記事に活かせそうなこと"]];

      for (var i = 0; i < links.length; i++) {
        csv.push([
          i + 1,
          links[i].querySelector("a").innerText.split("\n")[0],
          links[i].querySelector("a").href,
          "",
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
