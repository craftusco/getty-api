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
- api.postman_collection.json (all requests collection for Postman)
```

## 📦 Installation

[Node.js](https://nodejs.org/) v16.8+ is required to run the microservice.

1. Make sure you have git, node, and npm installed.
2. Clone this repository locally.
3. Execute ``` npm i ``` and then ``` node index ``` from the root directory of the repository.
4. Open ``` localhost:3000 ``` in your `Postman` or similar.


## 🤖 How to use
There are some routes inside

 1.  `/`
 2.  `/count` you will get images_count previous request & total images to sync
 3.  `/test` this action simpky updloas some random 3 getty images to cloudinary
 3.  `/sync` this route donloads and uplaods iamges between dates
		- can pass params `from` & `to` default is `today`



## 💊 Libraries inside the box


| Name | Link | Installed |
| ------ | ------ | ------ |
| NodeJS | https://nodejs.org/en | ✅
| Express | https://expressjs.com | ✅
| Axios | https://axios-http.com/docs/intro | ✅
| Knex | https://knexjs.org/ | ✅
| Cloudinary SDK | https://cloudinary.com/documentation/cloudinary_sdks | ✅
| GettyImages API | https://api.gettyimages.com/swagger/index.html | ✅
| Dayjs | https://day.js.org/ | ✅


