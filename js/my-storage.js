var Collection = require('./collection');

function MyStorage(type) {
    if (type === "localStorage")
        this.storage = localStorage;
    else if (type === "sessionStorage")
        this.storage = sessionStorage;
    else
        this.storage = localStorage;
    this.collections = {};
}


MyStorage.prototype.createCollection = function (name) {
    var collection = new Collection(name);
    this.collections[name] = collection;
    this.setItem(collection.name, collection.keys);
};

MyStorage.prototype.getCollection = function (name) {
    var keys = this.getItem(name);
    if (!keys) {
        this.createCollection(name);
        return this.getItem(name);
    }
    return keys;
};

MyStorage.prototype.getItem = function (key) {
    return JSON.parse(this.storage.getItem(key));
};

MyStorage.prototype.setItem = function (key, value) {
    this.storage.setItem(key, JSON.stringify(value));
};

MyStorage.prototype.insert = function (collectionName, item) {
    var newinput = [];
    var Name, orgkey, collection, keys, key, index;
    if (collectionName === "node-order") {
        Name = "node";
        orgkey = this.getCollection(collectionName);
        collection = new Collection(Name);
        this.collections[Name] = collection;
        collection = this.collections[Name];
        collection.insert(item);
        keys = collection.keys;
        key = keys[keys.length - 1];
        this.setItem(collectionName, keys);
        this.setItem(key, item);

        if (orgkey.length > 0) {
            for (index = 0; index < orgkey.length; index++) {
                newinput.push(orgkey[index]);
            }
            newinput.push(key);
            this.setItem(collectionName, newinput);
        }
    } else {
        Name = "item";
        orgkey = this.getCollection("item-keys");
        collection = new Collection(Name);
        this.collections[Name] = collection;
        collection = this.collections[Name];
        collection.insert(item);
        keys = collection.keys;
        key = keys[keys.length - 1];
        this.setItem("item-keys", keys);
        this.setItem(key, item);

        if (orgkey.length > 0) {
            for (index = 0; index < orgkey.length; index++) {
                newinput.push(orgkey[index]);
            }
            newinput.push(key);
            this.setItem("item-keys", newinput);
        }
    }
};

MyStorage.prototype.delete = function (key) {
    var url = window.location.href;
    if (url.indexOf("id=") === -1) { //分類
        var ItemKeys = this.getCollection("item-keys"); //讀取item-keys陣列
        var newItemKey = [];
        for (var index = 0; index < ItemKeys.length; index++) {
            var Item = this.getItem(ItemKeys[index]);
            if (Item.id === key) {
                localStorage.removeItem(Item.key);
            } else {
                newItemKey.push(ItemKeys[index]);
            }
        }
        this.setItem("item-keys", newItemKey);
        var keys = this.getCollection('node-order'); //刪除後要更新的node-order
        for (var index = 0; index < keys.length; index++) { //產出最後的node-order
            if (keys[index] === key) {
                keys.splice(index, 1);
            }
        }
        this.setItem("node-order", keys);
        localStorage.removeItem(key);
    } else {
        var keys = this.getCollection('item-keys');

        item = this.getItem(key);
        for (var index = 0; index < keys.length; index++) {
            if (keys[index] === key)
                keys.splice(index, 1);
        }
        this.setItem("item-keys", keys);

    }
};

module.exports = MyStorage;