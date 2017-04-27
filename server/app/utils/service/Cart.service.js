'use strict';

const aguid = require('aguid');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Promise = require("bluebird");
let internals = {};
let redisClient = null;

exports.register = function (server, options, next) {
	redisClient = server.redis;
	server.expose('addCart', internals.addCart);
	server.expose('deleteCart', internals.deleteCart);
	server.expose('deleteItem', internals.deleteItem);
	server.expose('addItem', internals.addItem);
	server.expose('setQuantity', internals.setQuantity);
	server.expose('getCart', internals.getCart);

	next();
};

exports.register.attributes = {
	name: 'service-cart'
};

/*======================Internals=============================*/
/*
* Add cart to session 
* @param session_id: session request
* @param: product: id product
* @param: quantity: quantity of product
	- default: 1
	- Note: Khi thêm product làm giảm số lượng (quanti <= 0)
		quantity sẽ chuyển về 0 mà không xoá sản phẩm khỏi cart
 Return: Promise with session update
*/
internals.addCart = function (session_id, product, quantity) {
	return new Promise(function (resolve, reject) {
		redisClient.get(session_id, (err, sessionUser) => {
			if (err) {
				return reject(err);
			}
			let currentQty = 0; // this variavle to set data reply
			if (sessionUser) {
				// Nếu session đã có cart => cập nhật cart
				// console.log("get sessionUser: ", sessionUser);
				sessionUser = JSON.parse(sessionUser);
				if (sessionUser.hasOwnProperty('id_cart')) {
					// console.info("Updating cart");
					redisClient.get(sessionUser.id_cart, (err, oldCart) => {
						if (err) {
							// console.info("Cart id incorrect => creating new cart");
							let id_cart = 'cart_' + aguid();
							let cart = {
								id_cart: id_cart,
								items: [
									{
										id_product: product,
										quantity: Number(quantity)
									}
								],
								createAt: Date.now(),
								updateAt: Date.now()
							};
							currentQty = quantity;
							// console.log("new cart err: ", cart);
							redisClient.set(id_cart, JSON.stringify(cart));
							sessionUser.id_cart = id_cart;
							//update session user
							redisClient.set(session_id, JSON.stringify(sessionUser));

							let currentQty = 0;
							return resolve({ session: sessionUser, type: 'created', data: { product: product, quantity: currentQty } });
						}
						if (oldCart) {
							oldCart = JSON.parse(oldCart);
							let cartHasItem = false; //flag product has in items
							oldCart.items.forEach(function (item, index) {
								if (item.id_product == product) {
									cartHasItem = true;
									// console.info("Cart has product", index);
									oldCart.items[index].quantity = Number(oldCart.items[index].quantity) + Number(quantity);
									if (oldCart.items[index].quantity <= 0)
										oldCart.items[index].quantity = 0;
									currentQty = oldCart.items[index].quantity;
								}
							});
							if (!cartHasItem) {
								// console.info("Cart have no product")
								oldCart.items.push({
									id_product: product,
									quantity: Number(quantity)
								});
								currentQty = Number(quantity);
							}
							oldCart.updateAt = Date.now();
							// console.log("update cart: ", oldCart);

							redisClient.set(oldCart.id_cart, JSON.stringify(oldCart));
							return resolve({ session: sessionUser, type: 'updated', data: { product: product, quantity: currentQty } });
						}
					})
				}
				else {
					// console.info("New cart");
					let id_cart = 'cart_' + aguid();
					let cart = {
						id_cart: id_cart,
						items: [
							{
								id_product: product,
								quantity: Number(quantity)
							}
						],
						createAt: Date.now(),
						updateAt: Date.now()
					};
					// console.log("new cart: ", cart);					
					redisClient.set(id_cart, JSON.stringify(cart));
					sessionUser.id_cart = id_cart;
					//update session user
					redisClient.set(session_id, JSON.stringify(sessionUser));

					return resolve({ session: sessionUser, type: 'created' });
				}
			}
		});
	});
}

/*
* Delete cart 
* @param session_id: session request
* Return: Promise with session update
*/
internals.deleteCart = function (session_id) {
	return new Promise(function (resolve, reject) {
		redisClient.get(session_id, function (err, sessionUser) {
			if (err) {
				throw err;
				return reject(err);
			}
			if (sessionUser) {
				sessionUser = JSON.parse(sessionUser);
				// delete redis value
				if (sessionUser.id_cart)
					redisClient.del(sessionUser.id_cart);
				// delete id_cart properties
				delete sessionUser.id_cart;
				// update session user

				redisClient.set(session_id, JSON.stringify(sessionUser));
			}
			return resolve({ session: sessionUser, type: 'deleted' });
		});
	});
}

/*
* Delete items in cart 
* @param session_id: session request
* @param product: product id want to delete
* Return: Promise with session update
*/
internals.deleteItem = function (session_id, product) {
	return new Promise(function (resolve, reject) {
		redisClient.get(session_id, (err, sessionUser) => {
			if (err) {
				throw err;
				return reject(err);
			}
			if (sessionUser) {
				sessionUser = JSON.parse(sessionUser);
				if (sessionUser.id_cart) {
					redisClient.get(sessionUser.id_cart, function (err, cart) {
						if (cart) {
							cart = JSON.parse(cart);
							cart.items.forEach((item, index) => {
								if (item.id_product == product) {
									cart.items.splice(index, 1);
									cart.updateAt = Date.now();
									// console.info("update cart: ", cart);
									redisClient.set(cart.id_cart, JSON.stringify(cart));
								}
							});
						}

					});
				}
			}
			return resolve({ success: true, product: product, type: 'deleted' });
		});
	});
}


/*
* Add item to cart 
* @param session_id: session request
* @param: product: id product
* @param: quantity: quantity of product
	- default: 1
	- Note: Khi thêm product làm giảm số lượng (quantiy <= 0)
		quantity sẽ chuyển về 0 mà không xoá sản phẩm khỏi cart
* Return: Promise with session update
* Err if session does not exits
*/
internals.addItem = function (session_id, product, quantity = 1) {
	return internals.addCart(session_id, product, quantity);
}

/*
* Edit quantity's item in cart
* @param session_id: session request
* @param: product: id product
* @param: quantity: quantity of product
	- default: 1
	- Note: 
		+ Khi thêm product làm giảm số lượng (quantiy <= 0)
			quantity sẽ chuyển về 0 mà không xoá sản phẩm khỏi cart
		+ Nếu sản phẩm không tồn tai thì sẽ thêm vào cart
 Return: Promise with session update
 Err if session does not exits
*/
internals.setQuantity = function (session_id, product, new_quantity = 1) {
	return new Promise(function (resolve, reject) {
		redisClient.get(session_id, (err, sessionUser) => {
			if (err) {
				return reject(err);
			}

			if (sessionUser) {
				// Nếu user đã có cart => cập nhật cart
				// console.log("get sessionUser: ", sessionUser);
				sessionUser = JSON.parse(sessionUser);
				if (sessionUser.hasOwnProperty('id_cart')) {
					// console.info("Updating cart");
					redisClient.get(sessionUser.id_cart, (err, oldCart) => {
						if (err) {
							// console.info("Cart id incorrect => creating new cart");
							let id_cart = 'cart_' + aguid();
							let cart = {
								id_cart: id_cart,
								items: [
									{
										id_product: product,
										quantity: Number(quantity)
									}
								],
								createAt: Date.now(),
								updateAt: Date.now()
							};
							// console.log("new cart err: ", cart);
							redisClient.set(id_cart, JSON.stringify(cart));
							sessionUser.id_cart = id_cart;
							//update session user
							redisClient.set(session_id, JSON.stringify(sessionUser));

							return resolve({
								success: true, data: {
									product: product,
									new_quantity: new_quantity
								},
								type: 'created'
							});
						}
						if (oldCart) {
							oldCart = JSON.parse(oldCart);
							let cartHasItem = false; //flag product has in items
							oldCart.items.forEach(function (item, index) {
								if (item.id_product == product) {
									cartHasItem = true;
									// SET NEW QUANTITY
									oldCart.items[index].quantity = Number(new_quantity);
									if (oldCart.items[index].quantity <= 0)
										oldCart.items[index].quantity = 0;
								}
							});
							if (!cartHasItem) {
								// console.info("Cart have no product")
								oldCart.items.push({
									id_product: product,
									quantity: Number(new_quantity)
								});
							}
							oldCart.updateAt = Date.now();
							// console.log("update cart: ", oldCart);

							redisClient.set(oldCart.id_cart, JSON.stringify(oldCart));
							return resolve({
								success: true,
								data: { product: product, new_quantity: new_quantity },
								type: 'updated'
							});
						}
					})
				}
				else {
					// console.info("New cart");
					let id_cart = 'cart_' + aguid();
					let cart = {
						id_cart: id_cart,
						items: [
							{
								id_product: product,
								quantity: Number(quantity)
							}
						],
						createAt: Date.now(),
						updateAt: Date.now()
					};
					// console.log("new cart: ", cart);					
					redisClient.set(id_cart, JSON.stringify(cart));
					sessionUser.id_cart = id_cart;
					//update session user
					redisClient.set(session_id, JSON.stringify(sessionUser));

					return resolve({
						success: true,
						data: { product: product, new_quantity: new_quantity },
						type: 'created'
					});
				}
			}
		});
	});
}



/*
* Get Cart
* @param session_id: session request
* If session have no cart => reply cart with properties is null
* Err if session does not exits
*/
internals.getCart = function (session_id) {
	var cart = {
		id_cart: null,
		items: [],
		createAt: null,
		updateAt: null
	};
	return new Promise(function (resolve, reject) {
		if (session_id) {
			let get = function () {
				redisClient.get(session_id, function (err, sessionUser) {
					if (err) return reject(err);
					if (sessionUser) {
						sessionUser = JSON.parse(sessionUser);
						// Nếu user đã có cart thì lấy trong redis
						if (sessionUser.hasOwnProperty('id_cart')) {

							redisClient.get(sessionUser.id_cart, function (err, resp) {
								cart = JSON.parse(resp);
								let setDetailProduct = function (index = 0) {
									if (index == cart.items.length)
										return resolve(cart);
									else {
										var query = Product.findOne({ _id: cart.items[index].id_product });
										query.select('name slug qty_in_stock category price images thumb view_unit id_unit id_promotion due_date');
										query.populate('id_unit id_promotion category');

										query.exec(function (err, res) {
											if (err || !res) {
												cart.items.splice(index, 1);
												redisClient.set(cart.id_cart, JSON.stringify(cart));
												return get();
											}

											// Check quanty in cart with qty in stock
											// remove qty's cart to max qty in stock if qty in cart > qty in stock

											// check due date product
											if (res.due_date && res.due_date.end_date && cart.items[index].quantity > 0) {
												if (res.due_date.end_date < Date.now()) {
													cart.items[index].quantity = 0;
													redisClient.set(cart.id_cart, JSON.stringify(cart));
													return get();
												}
											}

											if (res.qty_in_stock < cart.items[index].quantity) {
												cart.items[index].quantity = res.qty_in_stock;
												redisClient.set(cart.id_cart, JSON.stringify(cart));
												// restart get process
												return get();
											}
											else {
												// continue get cart data and set detail product to cart
												cart.items[index].product = res;
												return setDetailProduct(index + 1);
											}

										});
									}
								};
								return setDetailProduct(0);
							});

						}
						else {
							return resolve(cart);
						}
					}
					else
						return resolve(cart);
				})
			}
			return get();
		}
	});
}
