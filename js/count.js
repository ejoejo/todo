var Storage = require('./my-storage');

function Count(key) {
    var count = 0;
    var db = new Storage("localStorage");
    var ItemKeys = db.getCollection("item-keys");
    for (var index = 0; index < ItemKeys.length; index++) {
        var Item = db.getItem(ItemKeys[index]);
        if (Item.id === key) {
            count++;
        }
    }
    return count;
}

module.exports = Count;