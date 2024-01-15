var register = function(Handlebars) {
    var helpers = { // add all helpers as key: value pairs
        // a listsnack helper to iterate over
        // snacks and display these in the page
        listfood: function (foods) {
          var ret = "<ul>";
          for (var i = 0, j = foods.length; i < j; i++) {
            ret = ret + "<li> " +
             "<a href=\"/customer/snacks/" + foods[i]._id + "\">" +
             "<img src=" + "\"" + "/images/snack" + foods[i].imageId + ".jpg" + "\"" + ">" +
             "</a>" +

             "<a href=\"/customer/snacks/" + foods[i]._id + "\">" +
             foods[i].name +
             "</a></li>"
          }
          return ret + "</ul>";
		    },


        listVendorOrder: function(orders){
           var ret ="<ul>";
           for (var i = 0, j = orders.length; i < j; i++) {
             ret = ret +
             "<tr>" +
             "<td>" + (i+1) + "</td>" +
             "<td>" + orders[i].customerLastName + "</td>" +
             "<td>" + orders[i].orderStatus  + "</td>" +
             "<td>" + orders[i].createdAt  + "</td>" +
             "<td>" + "<a style=\"color: rgba(5, 5, 68, 0.425);\" href=\"/vendor/orderDetails/" + orders[i]._id + "\"> Action "   + "</td>" +
             "</tr>"

           }
           return ret + "</ul>";
        }


    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

  };

  // export helpers to be used in our express app
  module.exports.register = register;
  module.exports.helpers = register(null);
