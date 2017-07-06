# Name
English Study App
Đồ án xây dựng ứng dụng hỗ trợ học tiếng Anh sử dụng giải thuật phân lớp dữ liệu
# Info
	- Name: Nguyễn Tất Chủ
	- Class: 55CNTT1.NTU
## Requirements
### Dev
- Nodejs 7.0 and above
- MongoDB
- Redis
- Nodemon: `npm install -g nodemon`
- Yarn: `npm install -g yarn`
- OpenCV 		#version < 3

Create file development.conf.js in /serer/app/config with copy example_development.config.js

### Production
- Dev +
- pm2

## Install

```bash
cd web           # Change directory to web
yarn install     # Install nodejs dependency

```
- Add default database
`node commander initRoleUsers`

```
- Default CMS Account
```bash
tatchu.it@gmail.com/88888888

```

## How to run:
- Using Gulp

```bash
npm start          	# In the server folder - example: cms, web, api-user
nodemon app         # In the server folder
gulp				# In the server folder
```
## List services:
- API Server: [http://localhost:9022/](http://localhost:9022/documentation)
- Admin CMS: [http://localhost:9021/]
- Web:  [http://localhost:9020/)

##Solutions/Resources Hapi
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) ~ Mã hóa
- [Bluebird](http://bluebirdjs.com/docs/getting-started.html) ~ Promise
- [Elasticsearch](https://www.elastic.co/) ~ Search
- [Mongoosastic](https://github.com/mongoosastic/mongoosastic) ~ Elasticsearch cho mongo
- [Slug](https://github.com/dodo/node-slug) ~ Format Slug
##Solutions/Resources Front end
- [Select2](https://github.com/angular-ui/ui-select2) ~ Select2
- [CKEditor](https://github.com/angular-ui/ui-select2) ~ Select2

##Cấu trúc:
```bash
Project
|--ocr # Chứa code xử lý nhận dạng chữ
    |--code # Chứa mã xử lý
        |-- img-proccess # Chứa mã xử lý ảnh
        |-- neural-network # Chứa mã xử lý mạng nơ-ron
        |-- image	# Thư mục chứa ảnh xử lý
    |--package.json  # Tập tin khai báo module sử dụng trong xử lý mạng nơn-ron
|--web-app # Chứa code website 
    |--package.json  # Tập tin khai báo module sử dụng trong ứng dụng web
    |--app # Chứa app chính
        |--bootstrap # boot đầu tiên khi vào app
 		|--config # Chứa những config của site
 		|--lib # Chứa config thư viện được sử dụng và các plugin
 		|--model # Chứa tất model (colection) trong mongoses
 		|--modules # Gồm những module admin, web, api 
 			|--(admin,web,api)-*
 				|--controller # Chứa controller server của module đó
 				|--util # chứa helper những function sử dụng chung cho module đó phía server 
 				|--view # Phần client
 					|--client # Chứa code client của module đó 
                index.js    # File chứa chính để load module đó vào hapi 
 		|--utils # phần helper dùng chung cho cả app, chứa middleware, event, socket của app
 		|--views # Chứa layout, partial của (app, module) và chứa helper của hadlebar template 
 	|--node_modules # thư viện node
    |--gulp # chứa các file phục vụ việc phát triển ứng dụng
 	|--public # phần công cộng
 		|--assets # Chứa (fonts, images, scripts, styles) của site
 		    |--(admin,site)
                |--bower_components # Chứa thư viện dung bower.
                |--fonts # Chứa fonts
                |--images # Chứa Hình ảnh cắt html
                |--script # Chứa js util và biến setting của (admin,site) (những phần dùng chung)
                |--styles # Chứa css những phần dùng chung và file main.scss để import css
            |--global # Chứa 
        |--libs # Chứa thư viện dùng ngoài không dùng bower
        |--files # Chứa files upload
```