function Collection(name) {
    this.name = name;
    this.keys = [];
    this.data = {};
}

Collection.prototype.insert = function (item) {
    var key = this.name + "_" + (new Date()).getTime();
    item.key = key;
    this.keys.push(key);
    this.data[key] = item;
};

Collection.prototype.find = function (key) {
    return this.data[key];
};

Collection.prototype.update = function (key, newItem) {
    this.data[key] = newItem;
};

Collection.prototype.delete = function (key) {
    delete this.data[key];
    for (var index = 0; index < this.keys.length; index++) {
        if (this.keys[index] === key)
            this.keys.splice(index, 1);
    }
};

module.exports = Collection;