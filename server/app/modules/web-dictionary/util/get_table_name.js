'use strict';
module.exports = function(word){

        word = word || '0';

        var Table_Name = '';
        word =  word.toLowerCase();
        if (word.startsWith("a"))
            Table_Name = "words_0061";
        else
        if (word.startsWith("b"))
            Table_Name = "words_0062";
        else
        if (word.startsWith("c"))
            Table_Name = "words_0063";
        else
        if (word.startsWith("d"))
            Table_Name = "words_0064";
        else
        if (word.startsWith("e"))
            Table_Name = "words_0065";
        else
        if (word.startsWith("f"))
            Table_Name = "words_0066";
        else
        if (word.startsWith("g"))
            Table_Name = "words_0067";
        else
        if (word.startsWith("h"))
            Table_Name = "words_0068";
        else
        if (word.startsWith("i"))
            Table_Name = "words_0069";
        else
        if (word.startsWith("j"))
            Table_Name = "words_006A";
        else
        if (word.startsWith("k"))
            Table_Name = "words_006B";
        else
        if (word.startsWith("l"))
            Table_Name = "words_006C";
        else
        if (word.startsWith("m"))
            Table_Name = "words_006D";
        else
        if (word.startsWith("n"))
            Table_Name = "words_006E";
        else
        if (word.startsWith("o"))
            Table_Name = "words_006F";
        else
        if (word.startsWith("p"))
            Table_Name = "words_0070";
        else
        if (word.startsWith("q"))
            Table_Name = "words_0071";
        else
        if (word.startsWith("r"))
            Table_Name = "words_0072";
        else
        if (word.startsWith("s"))
            Table_Name = "words_0073";
        else
        if (word.startsWith("t"))
            Table_Name = "words_0074";
        else
        if (word.startsWith("u"))
            Table_Name = "words_0075";
        else
        if (word.startsWith("v"))
            Table_Name = "words_0076";
        else
        if (word.startsWith("w"))
            Table_Name = "words_0077";
        else
        if (word.startsWith("x"))
            Table_Name = "words_0078";
        else
        if (word.startsWith("y"))
            Table_Name = "words_0079";
        else
        if (word.startsWith("z"))
            Table_Name = "words_007A";
        else


        if (word.startsWith("à"))
                Table_Name = "words_00E0";
            else
            if (word.startsWith("á"))
                Table_Name = "words_00E1";
            else
            if (word.startsWith("â"))
                Table_Name = "words_00E2";
            else
            if (word.startsWith("è"))
                Table_Name = "words_00E8";
            else
            if (word.startsWith("é"))
                Table_Name = "words_00E9";
            else
            if (word.startsWith("ê"))
                Table_Name = "words_00EA";
            else
            if (word.startsWith("ì"))
                Table_Name = "words_00EC";
            else
            if (word.startsWith("í"))
                Table_Name = "words_00ED";
            else
            if (word.startsWith("ò"))
                Table_Name = "words_00F2";
            else
            if (word.startsWith("ó"))
                Table_Name = "words_00F3";
            else
            if (word.startsWith("ô"))
                Table_Name = "words_00F4";
            else
            if (word.startsWith("õ"))
                Table_Name = "words_00F5";
            else
            if (word.startsWith("ù"))
                Table_Name = "words_00F9";
            else
            if (word.startsWith("ú"))
                Table_Name = "words_00FA";
            else
            if (word.startsWith("ý"))
                Table_Name = "words_00FC";
            else
            if (word.startsWith("ă"))
                Table_Name = "words_0103";
            else
            if (word.startsWith("ĩ"))
                Table_Name = "words_0129";
            else
            if (word.startsWith("ơ"))
                Table_Name = "words_01A1";
            else
            if (word.startsWith("ư"))
                Table_Name = "words_01B0";
            else
            if (word.startsWith("ạ"))
                Table_Name = "words_1EA1";
            else
            if (word.startsWith("ả"))
                Table_Name = "words_1EA3";
            else
            if (word.startsWith("ấ"))
                Table_Name = "words_1EA5";
            else
            if (word.startsWith("ầ"))
                Table_Name = "words_1EA7";
            else
            if (word.startsWith("ẩ"))
                Table_Name = "words_1EA9";
            else
            if (word.startsWith("ẫ"))
                Table_Name = "words_1EAB";
            else
            if (word.startsWith("ậ"))
                Table_Name = "words_1EAD";
            else
            if (word.startsWith("ắ"))
                Table_Name = "words_1EAF";
            else
            if (word.startsWith("ẳ"))
                Table_Name = "words_1EB3";
            else
            if (word.startsWith("ẵ"))
                Table_Name = "words_1EB5";
            else
            if (word.startsWith("ẹ"))
                Table_Name = "words_1EB9";
            else
            if (word.startsWith("ẻ"))
                Table_Name = "words_1EB3";
            else
            if (word.startsWith("ẽ"))
                Table_Name = "words_1EBD";
            else
            if (word.startsWith("ế"))
                Table_Name = "words_1EBD";
            else
            if (word.startsWith("ề"))
                Table_Name = "words_1EC1";
            else
            if (word.startsWith("ễ"))
                Table_Name = "words_1EC5";
            else
            if (word.startsWith("ệ"))
                Table_Name = "words_1EC7";
            else
            if (word.startsWith("ỉ"))
                Table_Name = "words_1EC9";
            else
            if (word.startsWith("ị"))
                Table_Name = "words_1ECB";
            else
            if (word.startsWith("ọ"))
                Table_Name = "words_1ECD";
            else
            if (word.startsWith("ỏ"))
                Table_Name = "words_1ECF";
            else
            if (word.startsWith("ố"))
                Table_Name = "words_1ED1";
            else
            if (word.startsWith("ồ"))
                Table_Name = "words_1ED3";
            else
            if (word.startsWith("ổ"))
                Table_Name = "words_1ED5";
            else
            if (word.startsWith("ộ"))
                Table_Name = "words_1ED8";
            else
            if (word.startsWith("ớ"))
                Table_Name = "words_1EDB";
            else
            if (word.startsWith("ờ"))
                Table_Name = "words_1EDD";
            else
            if (word.startsWith("ở"))
                Table_Name = "words_1EDF";
            else
            if (word.startsWith("ỡ"))
                Table_Name = "words_1EE1";
            else
            if (word.startsWith("ợ"))
                Table_Name = "words_1EE3";
            else
            if (word.startsWith("ụ"))
                Table_Name = "words_1EE5";
            else
            if (word.startsWith("ủ"))
                Table_Name = "words_1EE7";
            else
            if (word.startsWith("ứ"))
                Table_Name = "words_1EE9";
            else
            if (word.startsWith("ừ"))
                Table_Name = "words_1EEB";
            else
            if (word.startsWith("ử"))
                Table_Name = "words_1EED";
            else
            if (word.startsWith("ự"))
                Table_Name = "words_1EE9";
            else
            if (word.startsWith("ỳ"))
                Table_Name = "words_1EF3";
            else
            if (word.startsWith("ỷ"))
                Table_Name = "words_1EF7";
            else
                Table_Name = "words_num";//ký tự - số

        return Table_Name;
}
 