const fs = require('fs');
const compiled = fs.readFileSync('app-compiled.js', 'utf8');
const head = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
  <meta name="apple-mobile-web-app-title" content="SECURA"/>
  <meta name="theme-color" content="#07090F"/>
  <link rel="manifest" href="/manifest.json"/>
  <link rel="apple-touch-icon" href="/icon-192.png"/>
  <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png"/>
  <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png"/>
  <title>SECURA</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{background:#07090F;overflow-x:hidden;-webkit-tap-highlight-color:transparent;}
    #root{max-width:430px;margin:0 auto;min-height:100vh;}
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
  <script>
`;
const foot = `
  </script>
</body>
</html>`;
fs.writeFileSync('index.html', head + compiled + foot);
console.log('index.html built! Size: ' + (head + compiled + foot).length + ' bytes');
