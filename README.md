<h1 align="center">wallhaven-mini</h1>

<p align="center">
  壁纸客户端微信小程序版本。
</p>

<p align="center" style="margin-top: 20px;">
  <img src="https://img.lkxin.cn/tu/2022/10/18/634e537320ee3.jpg" alt="小程序码" title="小程序码" />
</p>

## 开源地址
- gitee：https://gitee.com/ml13/wallhaven-mini
- github：https://github.com/MaLuns/wallhaven-mini

## UI
<div>
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397eefd8f1c2.jpg" alt="首页" title="首页" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397efec3e59e.jpg" alt="分类" title="分类" >
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397f14c851c3.jpg" alt="查询" title="查询" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397eefd93c94.jpg" alt="我的" title="我的" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/14/639973a0e93c0.jpg" alt="查看" title="查看" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/14/639973a115d9e.jpg" alt="查看" title="查看" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/14/639973a13219a.jpg" alt="查看" title="查看" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397eefda8b72.jpg" alt="我的" title="我的" />
  <img width="24%" src="https://img.lkxin.cn/tu/2022/12/13/6397f14ca2d3b.jpg" alt="我的" title="我的" />
</div>

## 个人搭建
### 后端部署

因为小程序需要 hppts 而且需要你的域名备案，如果你刚好有，你可以自建一个代理服务，将你请求代理到 [https://wallhaven.cc/api/v1](https://wallhaven.cc/api/v1)。如果你没有备案域名，你可以使用云开发或者云托管进行代理。

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

小程序的数据请求相关写在 `miniprogram\lib\apis\core\` 里，如果你有自己实现版本，可以继承 abstractApi 实现相关方法，然后修改 config 里的 apiVersion 配置。默认实现里收藏历史记录等都是记录在小程序本地的，如果你需要存在服务的，可自行修改相关接口。

## 参与贡献

非常欢迎你的贡献，你可以通过以下方式一起共建 :smiley:：

- 通过 Issue 报告 bug 或进行咨询。
- 提交 Pull Request 改进 wallhaven-mini 的代码。
