# SlackCleaner

Slackの特定のチャンネルのメッセージを削除する Google Apps Script プロジェクト

## 使い方

### 事前準備
- SlackのToken ( channels:history と chat:write:bot の permission が必要)
- 適用したいチャンネルのID

### デプロイ
- プロジェクトの作成
- デプロイ (`.clasp.sample.json` を使ってください)
- スクリプトのプロパティを設定
  - CHANNEL_ID: string
  - TOKEN: string
  - LEAVE_DAY_PERIOD: int
- main関数の定期実行トリガーを設定する

### 備考
- Slack API の仕様で一度に削除できるメッセージは100件までです
