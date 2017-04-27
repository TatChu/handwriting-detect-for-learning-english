const async = require("async");
const moment = require("moment");
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const user = 'roles';
const Acl = require('acl');
const rolesData = require('./../data/roles.json');
var listResource = require('./../data/resources.json');
var Permission = require('./../data/permission.json');
var config = require('./../../../../commander.json');
var acl = undefined;
var listNameCollectionACL = JSON.stringify(listResource);
listNameCollectionACL = JSON.parse(listNameCollectionACL);
module.exports = function initRolesUserCommand(program) {
    'use strict';

    program
    .command('initRolesUser')
    .description('In it data roles')
    .action(function (command) {
        mongodb.connect(config.web.db.uri, function (error, db) {
            acl = new Acl(new Acl.mongodbBackend(db, 'tb_acl_'));
            async.waterfall(
                [
                function removeOldColection(callback) {
                    program.successMessage('Step 1/6: Preparing remove old collection ACL');
                    for (var i = 0; i < listResource.length; i++) {
                        listNameCollectionACL[i] = config.web.db.prefixCollection + 'acl_allows_' + listResource[i];
                    };
                    listNameCollectionACL.push(config.web.db.prefixCollection + 'acl_meta');
                    listNameCollectionACL.push(config.web.db.prefixCollection + 'acl_resources');
                    listNameCollectionACL.push(config.web.db.prefixCollection + 'acl_roles');
                    listNameCollectionACL.push(config.web.db.prefixCollection + 'acl_users');

                    /*Xóa collection ACL*/
                    program.successMessage('Bạn ko chọn xóa collection khi nó đã tồn tại !!!');
                    // async.each(listNameCollectionACL, function (collection, fnCallback) {
                    //     mongoose.connection.db.dropCollection(collection, function (err, result) {
                    //         if (err)
                    //             program.errorMessage('\t -> Skiped for \'%s\' because collection does not exist', collection);
                    //         if (result)
                    //             program.successMessage('\t -> Deleted collection \'%s\'', collection);
                    //         fnCallback();
                    //     });
                    // },
                    // function (err) {
                        callback()
                    // });
                },
                function addUserRoles(callback) {
                    acl.addUserRoles(user, rolesData, function (err) {
                        if (err)
                            program.errorMessage('Can not add user roles: %s', '' + err);
                        else
                            program.successMessage('Step 2/6: Add user \'roles\' success');
                        callback()
                    })
                },
                function setDefaultRoles(callback) {
                    acl.allow(rolesData[0], listResource, Permission.full_permission, function (err) {
                        if (err)
                            program.errorMessage('Can not set default roles: %s', '' + err);
                        else
                            program.successMessage('Step 3/6: Set default roles for \'%s\' success', rolesData[0]);
                        callback()
                    })
                },
                function createAccountAdmin(callback) {
                    program.successMessage('Step 4/6: Enter info admin accout: ');

                    program.prompt.get({
                        properties: {
                            email: {
                                description: 'Enter email\'s admin: ',
                                required: true,
                                pattern: /.+\@.+\..+/,
                                default: 'tatchu.it@gmail.com',
                                type: 'string'
                            },
                            phone: {
                                description: 'Enter phone number for admin: ',
                                required: true,
                                default: '0969369499',
                                type: 'string'
                            },
                            password: {
                                description: 'Enter password for admin: ',
                                required: true,
                                hidden: true,
                                replace: '*',
                                default: 'Boss4517',
                                type: 'string'
                            }
                        }
                    }, function (err, input) {
                        if (err) {
                            return program.handleError(err);
                        } else {
                                    // init data
                                    input.status = true;
                                    input.provider = 'local';
                                    input.name = 'The Boss';
                                    let admin = new User(input);

                                    admin.hashPassword(input.password, function (err, hash) {
                                        admin.password = hash;
                                        admin.activeToken = '';

                                        const promise = admin.save();

                                        promise.then(admin => {
                                            program.successMessage('Step 5/6: Account created!');
                                            callback('' + admin._id);
                                        }).catch(err => {
                                            program.errorMessage('Can not create account admin: %s', '' + err);
                                            User.findOne({
                                                phone: input.phone
                                            }, function (err, user) {
                                                if (err) callback(null);
                                                else
                                                    callback('' + user._id);
                                            })
                                        });
                                    });
                                }
                            });
                }
                ],
                function setPermissionForAdmin(idAdmin) {
                    if (idAdmin === null) {
                        program.errorMessage('Step 6/6: Can not set permission admin');
                        process.exit(1);

                    }
                    else {
                        acl.addUserRoles(idAdmin, rolesData, function (err) {
                            if (err) {
                                program.errorMessage('Can not set permission for admin: %s', '' + err);
                                process.exit(1);
                            } else {
                                program.successMessage('Step 6/6: set full permission for admin success!');
                                program.successMessage('------------->> Succesfully <<-------------');
                                process.exit(1);
                            }
                        })
                    }

                });
});
});

};
