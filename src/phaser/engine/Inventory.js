class Inventory {
    constructor() {
        this.items = {};
    }

    addItem(item, quantity = 1) {
        if (this.items[item]) {
            this.items[item] += quantity;
        } else {
            this.items[item] = quantity;
        }
    }

    removeItem(item, quantity = 1) {
        if (this.items[item]) {
            this.items[item] -= quantity;
            if (this.items[item] <= 0) {
                delete this.items[item];
            }
        }
    }

    getItemQuantity(item) {
        return this.items[item] || 0;
    }

    hasItem(item, quantity = 1) {
        return this.getItemQuantity(item) >= quantity;
    }

    listItems() {
        return Object.keys(this.items).map(item => ({
            item: item,
            quantity: this.items[item]
        }));
    }

    listItemsDebugJson(separator = null, spacing = 4){
        return JSON.stringify(this.items, separator, spacing)
    }

    clearInventory() {
        this.items = {};
    }

    isEmpty() {
        return Object.keys(this.items).length === 0;
    }

    getTotalItemCount() {
        return Object.values(this.items).reduce((total, quantity) => total + quantity, 0);
    }
}

export default Inventory