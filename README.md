## Getting Started

> The service saves the Bearer token in `SESSION`,
> all services are server-side. 
> Database is a MUST!!!

## ⏱️ Crons

`2 cronjobs` as following

1. every `30min` 
	1. runs count query (checking all new images)
	2. saves into db the new images with `filename` and `meta`
2. every `35min`
	1. runs the query to send to cloudinary donwloadable `URLS` from getty (url expires after some time)
	2. after upload successfull, update `downloaded: TRUE` into db, so service will know that image was uploaded
	3. finally running query to bulk edit `filename` & `meta` on all the iamges that was just uploaded 


Folder & Files architecture

## 🏠 Architecture

Folder & Files architecture
```jsx
- index.js
- config (all config keys for making service work)
- api (folder contains all api files with all functions)
- api.postman_collection.json (all requests collection for Postman)
- db.sql (mysql database schema)
```

## 📦 Installation

[Node.js](https://nodejs.org/) v16.8+ is required to run the microservice.

1. Make sure you have git, node, and npm installed.
2. Clone this repository locally.
3. Uplaod the `db.sql` file
4. Execute ``` npm i ``` and then ``` node index ``` from the root directory of the repository.
5. Open ``` localhost:3000 ``` in your `Postman` or similar.
6. Deploy on Vercel or other platforms


## 🤖 How to use
There are some routes inside

1.  `/`
2.  `/count` you will get images_count previous request & total images to sync
3.  `/test` this action simpky updloas some random 3 getty images to cloudinary
4.  `/logs` this route exports all logs saved into DB, so it makes a clear view foir you is any errors was found
5.  `/sync` this route donloads and uplaods iamges between dates
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


