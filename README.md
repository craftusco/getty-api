## Getting Started

> The service saves the Bearer token in a static file called token.json,
> all services are server-side.

Folder & Files architecture

## 🏠 Architecture

Folder & Files architecture
```jsx
- index.js
- config (all config keys for making service work)
- api (folder contains all api files with all functions)
- postman.json (all requests collection for Postman)
```

## 📦 Installation

DuckMa Console requires [Node.js](https://nodejs.org/) v16.8+ to run.

1. Make sure you have git, node, and npm installed.
2. Clone this repository locally.
3. Execute ``` npm i ``` and then ``` node index ``` from the root directory of the repository.
4. Open ``` localhost:3000 ``` in your browser.


## 🤖 How to use
There are some routes inside

 1.  `/`
 2.  `/sync` this route donloads and uplaods iamges between dates
		- can pass params `from` & `to` default is `today`
 3.  `/syncId` this route donloads and uplaods iamges between dates
		- can pass params `id` to sync only a requested image


## 💊 Libraries inside the box


| Name | Link | Installed |
| ------ | ------ | ------ |
| NodeJS | https://nodejs.org/en | ✅
| Express | https://expressjs.com | ✅
| Axios | https://axios-http.com/docs/intro | ✅
| Cloudinary SDK | https://cloudinary.com/documentation/cloudinary_sdks | ✅
| GettyImages API | https://api.gettyimages.com/swagger/index.html | ✅
| Dayjs | https://day.js.org/ | ✅


