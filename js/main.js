var Storage = require('./my-storage');
var $ = require('jquery');
var Sortable = require('sortablejs');
var Count = require('./count');

$(function () {
    var db = new Storage("localStorage");

    function initializeCollection(name) {
        var collection = db.getCollection(name);
        if (!collection)
            collection = db.addCollection(name);
        return collection;
    }

    var nodes, items;

    var url = window.location.href;
    if (url.indexOf("id=") === -1) { //分類
        var node = db.getCollection('node-order');

        $('#node').fadeIn();
        $('#item').fadeOut();

        if (node.length > 0) {

            var $node = $('#node');
            var note = [];
            var $span1;
            for (var index = 0; index < node.length; index++) {
                note = db.getItem(node[index]);
                var $note = $('<li id=' + node[index] + '>');
                var $a = $('<a href=?id=' + node[index] + '>');
                if (Count(node[index]) > 0) {
                    $span1 = $('<span>' + Count(node[index]) + '</span>');
                } else {
                    $span1 = $('');
                }
                var $span2 = $('<span>x</span>');

                $a.text(note.text);
                if (Count(node[index]) > 0) {
                    $span1.addClass("count");
                }
                $span2.addClass("close");
                $note.appendTo($node);
                $note.append($a);
                $note.append($span1);
                $note.append($span2);
            }
        }
        $(this).mousedown(function () {
            var el = document.getElementById('node');
            var sortable = Sortable.create(el, {
                store: {
                    /**
                     * Get the order of elements. Called once during initialization.
                     * @param   {Sortable}  sortable
                     * @returns {Array}
                     */
                    get: function (sortable) {
                        var order = localStorage.getItem("node-order");
                        return order ? order.split('|') : [];
                    },

                    /**
                     * Save the order of elements. Called onEnd (when the item is dropped).
                     * @param {Sortable}  sortable
                     */
                    set: function (sortable) {
                        var nodes = sortable["el"]["childNodes"];
                        var order = [];
                        for (var index = 0; index < nodes.length; index++) {
                            var node = nodes[index]["id"];
                            order.push(node);
                        }
                        localStorage.setItem("node-order", JSON.stringify(order));
                    }
                }
            });
        });

        $("#add").click(function () {
            var note = {
                text: $('#input').val()
            };
            db.insert('node-order', note);
            var $node = $('#node');
            var $note = $('<li>');
            var $span = $('<span>x</span>');
            $note.text(note.text);
            $span.addClass("close");
            $span.append($note);
            $note.appendTo($node);
            $note.append($span);
            location.reload();
        });
        $(".close").click(function () {
            var $li = $(this).parents("li").attr('id');
            db.delete($li);
            location.reload();
        });
    } else {
        var $params = url.slice(url.indexOf("id=") + 3, url.length);

        $('#input').attr("placeholder", "請輸入項目名稱");
        $('#node').fadeOut();
        $('#item').fadeIn();
        $('#back').fadeIn();

        items = db.getCollection("item-keys");
        if (items.length > 0) {
            for (var index = 0; index < items.length; index++) {
                //console.log(items[index]);  //ex:item_1498650772708
                item = db.getItem(items[index]);
                //console.log(item.id);   //ex:node_1498650761345

                var $item = $('#item');
                if (item.id === $params) {
                    var $note = $('<li id=' + item.key + '>');
                    var $span = $('<span>x</span>');

                    $note.text(item.text);
                    $span.addClass("close");
                    $note.appendTo($item);
                    $note.append($span);
                }
            }

            $(this).mousedown(function () {
                var el = document.getElementById('item');
                var sortable = Sortable.create(el, {
                    store: {
                        /**
                         * Get the order of elements. Called once during initialization.
                         * @param   {Sortable}  sortable
                         * @returns {Array}
                         */
                        get: function (sortable) {
                            var order = localStorage.getItem($params);
                            return order ? order.split('|') : [];
                        },

                        /**
                         * Save the order of elements. Called onEnd (when the item is dropped).
                         * @param {Sortable}  sortable
                         */
                        set: function (sortable) {
                            var items = sortable["el"]["childNodes"];
                            // console.log("items:" + items);
                            var order = [];
                            for (var index = 0; index < items.length; index++) {
                                var node = items[index]["id"];
                                // console.log("node:" + node);
                                order.push(node);
                            }
                            localStorage.setItem("item-keys", JSON.stringify(order));
                        }
                    }
                });
            });
        }

        $("#add").click(function () {
            var note = {
                id: $params,
                text: $('#input').val()
            };
            db.insert($params, note);
            var $item = $('#item');
            var $note = $('<li>');
            var $span = $('<span>x</span>');
            $note.text(note.text);
            $span.addClass("close");
            $span.append($note);
            $note.appendTo($item);
            $note.append($span);
            location.reload();
        });
        $(".close").click(function () {
            var $li = $(this).parents("li").attr('id');
            db.delete($li);
            localStorage.removeItem($li);
            location.reload();
        });
        $("#back").click(function () {
            window.location = history.go(-1);
        });
    }
});