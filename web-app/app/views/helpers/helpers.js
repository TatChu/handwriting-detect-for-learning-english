'use strict';

const Handlebars = require('handlebars');
const Handlebars_Helpers = require('handlebars-helpers')({
    handlebars: Handlebars
});
const moment = require('moment');
const globalWeb = global.configManager.getData();
const settings = globalWeb.web.context.settings;
const helpers = {
    linkPublic: function (link) {
        return `${settings.services.webUrl}/${link}`;
    },
    linkModules: function (link) {
        return `${settings.services.webUrl}/modules/${link}`;
    },
    linkAssets: function (link) {
        return `${settings.services.webUrl}/assets/${link}`;
    },
    linkLibs: function (link) {
        return `${settings.services.webUrl}/libs/${link}`;
    },
    aboutLink: function () {
        return '/about';
    },
    contactLink: function () {
        return '/contact';
    },
    postListLink: function () {
        return '/posts';
    },
    postCategoryLink: function (category) {
        return `/posts/${category.slug}`;
    },
    postDetailLink: function (post) {
        return `/post/${post.slug}`;
    },

    json: function (context) {
        return JSON.stringify(context);
    },
    formatDate: function (date) {
        return moment(date).format('DD/MM/YYYY');
    },
    getVietNamDayOfWeek: function (date) {
        let dayEnglish = moment(date).format('dd');
        if (dayEnglish == 'Su') return 'Chủ nhật';
        if (dayEnglish == 'Mo') return 'Thứ hai';
        if (dayEnglish == 'Tu') return 'Thứ ba';
        if (dayEnglish == 'We') return 'Thứ tư';
        if (dayEnglish == 'Th') return 'Thứ năm';
        if (dayEnglish == 'Fr') return 'Thứ sáu';
        if (dayEnglish == 'Sa') return 'Thứ bảy';
    },
    parseMonth: function (date) {
        return moment(date).format('M');
    },
    parseDay: function (date) {
        return moment(date).format('d');
    },
    parseYear: function (date) {
        return moment(date).format('YYYY');
    },
    if_eq: function (a, b, opts) {
        if (a == b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    if_neq: function (a, b, opts) {
        if (a != b) // Or === depending on your needs
            return opts.fn(this);
        else
            return opts.inverse(this);
    },
    discount: function (type_discount, value_discount, price) {
        if (type_discount == 'PC')
            return price * (100 - value_discount) / 100;
        if (type_discount == 'MN')
            return price - value_discount;
    },
    limitTextDisplay: function (numberWordOfTitle, desc) {// giới hạn mô tả hiển thị trên trang líst blog
        var numberWordOfTitle = numberWordOfTitle.split(' ').length;
        if (numberWordOfTitle > 6) // 2 dong
            return desc.substring(0, 200) + (desc.length > 200 ? '...' : '');
        return desc.substring(0, 250) + (desc.length > 250 ? '...' : '');;
    },
    compare: function (lvalue, rvalue, options) {

        if (arguments.length < 3) {
            console.log(("Handlerbars Helper 'compare' needs 2 parameters"));
            return false;
        }

        var operator = options.hash.operator || "==";

        var operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        }

        if (!operators[operator]) {
            console.log("Handlerbars Helper 'compare' doesn't know the operator " + operator);
            return false;
        }

        var result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },
    math: function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },/*fix lỗi img khi bị chuyển domain*/
    fixLinkImg: function (content) {
        let replaceUrl1 = new RegExp("http://ec2-54-169-159-62.ap-southeast-1.compute.amazonaws.com", 'g')
        let replaceUrl2 = new RegExp("//mhv-live.bizzon.com.vn", 'g')
        // content = content.replace(replaceUrl1, settings.services.webUrl);
        // content = content.replace(replaceUrl2, settings.services.webUrl);
        return content.replace(replaceUrl1, settings.services.webUrl).replace(replaceUrl2, settings.services.webUrl);
    },

    capitalize: function (string) {
        string = string.toLowerCase().replace(/\b./g, function (a) { return a.toUpperCase(); });
        return string.split('-').join('');
    },

    // Set old image product url to new url
    checkImgOld: function (new_url, image) {
        let tmp_arr = image.split('/');
        if (tmp_arr.length > 1) {
            let url = globalWeb.web.upload.oldMediaPathProduct.slice(0, -1);
            return url + image;
        }
        return new_url + image;
    },

    fixImgProductDetail: function (content) {
        let urlReplaceLeft = new RegExp('{{media url="', 'g')
        let urlReplaceRight = new RegExp('"}}', 'g')
        let url = globalWeb.web.upload.oldMediaPath;
        let replaceUrl2 = new RegExp("//mhv-live.bizzon.com.vn", 'g')

        return content.replace(urlReplaceLeft, settings.services.webUrl + url).replace(urlReplaceRight, '').replace(replaceUrl2, settings.services.webUrl);
    }

};

for (let key in helpers) {
    Handlebars.registerHelper(key, helpers[key]);
}
module.exports = {};
