# 深夜檔案｜未結案卷宗 07

純 HTML、CSS、JavaScript 製作的繁體中文互動推理網站。沒有建置步驟或外部套件需求，使用瀏覽器開啟 `index.html` 即可預覽。Google Fonts 字型需要網路連線；無法連線時會使用系統字型。

## 目前功能

- 機密法醫卷宗視覺與虛構現場重建圖
- 房間現場、日記、通話紀錄、法醫摘要四份可切換證物
- 點選兩張事件卡片，交換時間軸位置
- 選擇推論答案並解鎖案件結論
- 可選擇開啟由瀏覽器合成的低音量環境音
- 桌面與手機版版面

所有案件人物與事件均為虛構。故事與答案邏輯集中在 `script.js`；視覺樣式在 `style.css`。

## 推送至 GitHub

在此資料夾開啟終端機，建立 GitHub 空白 repository 後，依照 GitHub 提供的 repository URL 執行：

```sh
git init
git add .
git commit -m "Create Deep Archive interactive case site"
git branch -M main
git remote add origin <你的 GitHub repository URL>
git push -u origin main
```

## 部署至 Vercel

在 Vercel 匯入該 GitHub repository。這是靜態網站，Framework Preset 選 **Other**，Build Command 與 Output Directory 留空，直接部署即可。後續推送至 `main` 會觸發新的部署。
