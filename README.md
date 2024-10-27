# Cloud WorkflowsでのETL処理のサンプル

S3などにCSV形式などで保存されたファイルをGoogle Cloudに転送、
複数のBigQueyのテーブルにデータを加工してロードするサンプルコードです。
(S3からのデータ転送を想定して作成しています。)

オンデマンド実行を指定して作成したstorage transfer、bigquery data transferを
cloud functionsで実行します。

storage transfer、bigquery data transfer自体はビジネスロジックの部分となり、
Google Cloud Console上で生成する設定する前提としてこちらのプログラミングコードコードはこのリポジトリに含まれていません。

## モチベーション

Storage Transfer Serviceを使用するとAWSのIAMユーザーのシークレットアクセスキーを使用せず、
ロール(AssumeRoleWithWebIdentity)を使用してS3からGCSにファイルを転送できます。

BigQuery Data Transfer Service for Amazon S3といったサービスがありますが、
シークレットアクセスキーが必要です。

※将来AssumeRoleWithWebIdentityに対応されれば、そちらを使用したいです。

## デプロイ

このサンプルはasia-northeast1リージョンでのデプロイを想定して作成しています。
デプロイして実行までするために以下が必要です。

- Google Cloudのプロジェクトを作成
- Cloud Functionsは第2世代を指定
- テーブルや転送用のバケットを準備
- storage transfer、bigquery data transferを作成
- 実行するサービスアカウント(ソース内でworkflows-sampleで定義)に適切な権限を付与

こちらの動作確認はAWSが公開しているサンプルデータセット(ML Insights Sample Dataset)を加工、使用しました。
https://docs.aws.amazon.com/ja_jp/quicksight/latest/user/ml-data-set-requirements.html

以下のコマンドでデプロイします。

- 各Cloud Functionsのデプロイ
``` bash
cd {各Cloud Functionsのディレクトリ}
npm run deploy
```

- Cloud Workflowのデプロイ
実行するstorage transferはTRANSFER_JOB_IDの環境変数にします。
``` bash
cd cloud-workflows
gcloud workflows deploy sample-etl --source=sample-etl.yaml --set-env-vars=TRANSFER_JOB_ID=XXXXXXXX
```

## そのほか

`jstDate`を指定せず実行すると日本時間で3日前のDateを処理に渡して実行する作りとなっています。
