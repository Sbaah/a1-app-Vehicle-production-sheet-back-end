//  Sefa Baah - Acheamphour student#: 015381130
// Data service operations setup

const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Load the schemas...

// Data entities; the standard format is:
const vehicleSch = require("./vehicles_scheme.js");
// Add others as needed

module.exports = function(mongoDBConnectionString) {
  // Collection properties, which are created upon connection to the database
  let vehicle;

  return {
    // connect: function() { ...
    // Add the following function members below the "connect" function member
    connect: function() {
      return new Promise(function(resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        console.log(mongoDBConnectionString);
        db.on("error", error => {
          reject(error);
        });

        db.once("open", () => {
          vehicle = db.model("vehicles", vehicleSch, "vehicles");
          resolve();
        });
      });
    },

    // ############################################################
    // vehicle requests
    vehicleGetAll: function() {
      return new Promise(function(resolve, reject) {
        // Fetch all documents
        vehicle
          .find()
          .sort({
            car_Make: "asc"
          })
          .exec((error, items) => {
            if (error) {
              // Query error
              return reject(error.message);
            }
            console.log(items);
            // Found, a collection will be returned
            return resolve(items);
          });
      });
    },

    vehicleGetById: function(itemId) {
      return new Promise(function(resolve, reject) {
        // Find one specific document
        vehicle.findById(itemId, (error, item) => {
          if (error) {
            // Find/match is not found
            return reject(error.message);
          }
          // Check for an item
          if (item) {
            // Found, one object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },
    vehicleAdd: function(newItem) {
      return new Promise(function(resolve, reject) {
        vehicle.create(newItem, (error, item) => {
          if (error) {
            // Cannot add item
            return reject(error.message);
          }
          //Added object will be returned
          return resolve(item);
        });
      });
    },

    vehicleEdit: function(id, newItem) {
      return new Promise(function(resolve, reject) {
        vehicle.findByIdAndUpdate(id, newItem, { new: true }, (error, item) => {
          if (error) {
            // Cannot edit item
            return reject(error.message);
          }
          if (item) {
            // Edited object will be returned
            return resolve(item);
          } else {
            return reject("Not found");
          }
        });
      });
    },

    vehicleDelete: function(itemId) {
      return new Promise(function(resolve, reject) {
        vehicle.findByIdAndRemove(itemId, error => {
          if (error) {
            // Cannot delete item
            return reject(error.message);
          }
          // Return success, but don't leak info
          return resolve();
        });
      });
    }
  }; // return
}; // module.exports
