
# Introduction

Mua Hàng Việt Application

## Requirements
### Dev
- Nodejs 6.0 and above
- MongoDB
- Redis
- Elastic Search
- Nodemon: `npm install -g nodemon`

### Production
- Dev +
- pm2

## Install

```bash
cd web          # Change directory to web
npm install     # Install nodejs dependency
cd web/public/assets/admin # Change directory to admin
bower install   # Install bower dependency admin
cd web/public/assets/site # Change directory to admin
bower install   # Install bower dependency site

```
- Import/Export MongoDB Database

```bash
cd misc/seeds  # Change directory to misc/seeds
node import    # Run this command to import default cms data
node export    # Run this command to export your cms data and share to team members

```
- Default CMS Account
```bash
admin@gmail.com/iii3studi1

```

## How to run:

- Using Nodemon

```bash
npm start          # In the service folder - example: cms, web, api-user
nodemon app         # In the service folder
```
or
```bash
gulp
```

## List services:
- API Server: [http://localhost:9001/](http://localhost:9001/documentation)
- Admin CMS: [http://localhost:9002/](http://localhost:9002/documentation)
- Web:  [http://localhost:9006/](http://localhost:9006/)

##Solutions/Resources
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) ~ Mã hóa
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html) ~ Promise
- [Elasticsearch](https://www.elastic.co/) ~ Search
- [Mongoosastic](https://github.com/mongoosastic/mongoosastic) ~ Elasticsearch cho mongo
- [Slug](https://github.com/dodo/node-slug) ~ Format Slug

##Cấu trúc:
```bash
Project
| 
|--misc # Chứa hướng dẫn config server và import, export DB
|
|--web # Chứa code site 
    |
    |--app # Chứa app chính
        |
        |--bootstrap # boot đầu tiên khi vào app
 		|
 		|--config # Chứa những config của site
 		|
 		|--lib # Chứa config thư viện được sử dụng và các plugin
 		|
 		|--model # Chứa tất model (colection) trong mongoses
 		|
 		|--modules # Gồm những module admin, web, api 
 			|
 			|--(admin,web,api)-*
 				|
 				|--controller # Chứa controller server của module đó
 				|
 				|--util # chứa helper những function sử dụng chung cho module đó phía server 
 				|
 				|--view # Phần client
 					|
 					|--client # Chứa code client của module đó 
                index.js    # File chứa chính để load module đó vào hapi 
 		|
 		|--utils # phần helper dùng chung cho cả app, chứa middleware, event, socket của app
 		|
 		|--views # Chứa layout, partial của (app, module) và chứa helper của hadlebar template 
 	|
 	|--node_modules # thư viện node
 	|
    |--gulp # chứa các file phục vụ việc gulp
    |
 	|--public # phần công cộng
 		|
 		|--assets # Chứa (fonts, images, scripts, styles) của site
 		    |
 		    |--(admin,site)
                |
                |--bower_components # Chứa thư viện dung bower.
                |
                |--fonts # Chứa fonts
                |
                |--images # Chứa Hình ảnh cắt html
                |
                |--script # Chứa js util và biến setting của (admin,site) (những phần dùng chung)
                |
                |--styles # Chứa css những phần dùng chung và file main.scss để import css
            |
            |--global # Chứa 
        |
        |--build # Chứa js,css đã min rồi
        |
        |--dist # Chứa js,css min và fonts,image để move live
        |
        |--tmp # Chứa js,css chưa min
        |
        |--libs # Chứa thư viện dùng ngoài không dùng bower
 		|
 		|--files # Chứa files upload




    
