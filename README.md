<h1 align="center">wallhaven-mini</h1>

<p align="center">
  壁纸客户端微信小程序版本。
</p>

<p align="center" style="margin-top: 20px;">
  <img src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-qr.jpg" alt="小程序码" title="小程序码" />
</p>

## 开源地址
- gitee：https://gitee.com/ml13/wallhaven-mini
- github：https://github.com/MaLuns/wallhaven-mini

## UI
<div>
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-home.jpg" alt="首页" title="首页" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-seach.jpg" alt="分类" title="分类" >
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-search2.jpg" alt="查询" title="查询" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-preview.jpg" alt="查看" title="查看" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-preview2.jpg" alt="查看" title="查看" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-my.jpg" alt="我的" title="我的" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-collection.jpg" alt="收藏" title="收藏" />
  <img width="24%" src="https://mp-8b005489-7724-4f8c-afdd-30192ff4f7ae.cdn.bspapp.com/wallhaven/mini-history.jpg" alt="历史" title="历史" />
</div>

## 个人搭建
### 后端部署

因为小程序需要 https 而且需要你的域名备案，如果你刚好有，你可以自建一个代理服务，将你请求代理到 [https://wallhaven.cc/api/v1](https://wallhaven.cc/api/v1)。如果你没有备案域名，你可以使用云开发或者云托管进行代理。

一个简易 Node 实现

``` js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = morgan("tiny");
const { createProxyMiddleware } = require("http-proxy-middleware");


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

const baseURL = 'https://wallhaven.cc/api/v1/'

app.use("/test", (req, res) => {
  res.send({
    state: true,
  });
})

// baseURL
app.use("/", createProxyMiddleware({
  target: baseURL,
  changeOrigin: true,
  onProxyReq(proxyReq) {
    let url = proxyReq.path
    proxyReq.path = url.replace(/categories=[01]{3}/g, 'categories=100').replace(/purity=[01]{3}/g, 'purity=100')
  }
}));

const port = process.env.PORT || 80;

async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
```

### 小程序部署

直接拉取代码，将小程序 appid 修改为你自己的即可。

根据你部署代理程序修改 `lib\config.ts` 中配置：

``` ts 
export default {
    apiVersion: "Api 类型", // HttpApi（https） | CloudApi (云托管)
    cloudEnv: "云托管 env",
    httpsApiBase: "Https请求地址"
}
```

小程序的数据请求相关写在 `miniprogram\lib\apis\core\` 里，如果你有自己实现版本，可以继承 abstractApi 实现相关方法，然后修改 config 里的 apiVersion 配置。默认实现里收藏历史记录等都是记录在小程序本地的，如果你需要存在服务器，可自行修改相关接口。

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式一起共建 :smiley:：

- 通过 Issue 报告 bug 或进行咨询。
- 提交 Pull Request 改进 wallhaven-mini 的代码。
