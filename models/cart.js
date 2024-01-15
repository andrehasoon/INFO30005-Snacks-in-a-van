const mongoose = require("mongoose")
const Snack = mongoose.model("Snack")

// the shopping cart module

module.exports = function Cart(){
    this.items = [];
    this.totalAmount = 0;

    // push the new item in the arrary and increase the total amount
    this.addToCart = async function(orderItem){
        this.items.push(orderItem);
        //this.totalAmount += orderItem.totalPrice;
        try {
          const snackDoc = await Snack.findOne({_id: orderItem.snackId})
          this.totalAmount += snackDoc.price * orderItem.quantity
        } catch (err) {
            console.log(err)
        }
    };

    this.removeFromCart = async function(id){

        // search the orderitem based on the orderitem id
        var itemIndex = null;
        for (let index = 0; index < this.items.length; index++) {

            if (id == this.items[index]._id) {
                itemIndex = index;
                break;
            }
        }

        //remove the orderitem if it exists
        if (itemIndex != null) {
            // Get price of this snack, calculate how much to deduct
            try {
              const orderItem = this.items[itemIndex]
              const snackDoc = await Snack.findOne({_id: orderItem.snackId})
              this.totalAmount -= snackDoc.price * orderItem.quantity

              // Remove orderItem from the cart
              this.items.splice(itemIndex,1)
            } catch (err) {
                console.log(err)
            }
        }
    }

    this.emptyCart = function() {
        this.items = [];
        this.totalAmount = 0;
    }
}
