# Google search summary to csv
SEO用。
キーワードでGoogle検索をし、そのサマリーをCSV化するスクリプトです。

## 使用方法
### 初期設定
```
$ git clone git@github.com:tomohiroo/Google_search_summary_to_csv.git
$ npm init
$ npm install
```

### 使うとき
```
$ node search.js <キーワード>
```

以上をターミナルやコマンドプロンプトで実行すると `csv/<キーワード>.csv` という名前で、そのキーワードでのGoogle検索サマリーのCSVファイルができるはずです。
