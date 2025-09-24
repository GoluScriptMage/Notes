// #This is the example for the Closures
// -> Closures are like a bagpack for the newborn child where he will have all the thigs needs in the school
// But he can use those but the someone other than him can't see those also only someone with certain condition can access them like the return fn there

// const cart = function (accNo) {
//   let accountNo = 1234;
//   let accountBalance = 2222;

//   return {
//     buyTheCart: function (item, amount) {
//       if (!(accountNo === accNo)) {
//         console.log("Transaction not succeful check the account no.");
//         return;
//       }
//       accountBalance += amount;
//       console.log("Transaction successful");
//       return accountBalance;
//     },
//   };
// };

// const callCart1 = cart(1234);
// const callCart2 = cart(124);

// callCart1.buyTheCart(12, 200);
// callCart2.buyTheCart(12, 2300);

// console.log(cart.accountBalance);

// #This is the example of this and bind useCase
// -> So we use this keyword to point to the current boss or Object but sometime in the process of calling it loses it's identity and give use undefined
// To solve that undefined we use "bind" method
// => What it does is simple it sticks the identity of the owner with the fn u are calling like giving a child its idCard so he can find his parents
/*
const idCard = {
  fatherName: "ABC",
  childName: "XYZ",
  getDetails: function () {
    console.log(
      `The child with name ${this.childName} has the father name ${this.fatherName}.`
    );
  },
};

console.log('Logging the idCard Details...');
idCard.getDetails();

console.log('Logging the child Details...');
// const childDetails = idCard.getDetails;
const childDetails = idCard.getDetails.bind(idCard);
childDetails();
*/

// This is the example of the "arrowFn"
// => Arrow fn don't have this keyword so it alawys have the same parents don't dwindle with it
// => Need to use arrow fn when needs callback that is then owner gets separate

/*

class Account {
  constructor(accountNo) {
    this.accountNO = accountNo;
    this.balance = 0;
    this.accHolderName = "Golu";
    this.sendMoney(this.accountNO, 3000);
  }

  sendMoney(accountNo, amount) {
    if (this.accountNO == accountNo) {
      this.balance += amount;
      console.log(
        `The new balance is ${this.balance} of owner ${this.accHolderName}`
      );
      return console.log("Transaction successful...");
    }
    console.log("Transaction failed...");
  }
}

const bankAcc = new Account(3232);
// bankAcc.sendMoney(3232, 3000);  // It will work fine

const callBank = bankAcc.sendMoney;
// setTimeout(() => callBank(3232, 400), 100); // Will get undefined the owner got lost from the callback use bind or arrow fn
// / -------- FIX ------- //
setTimeout(() => bankAcc.sendMoney(3232, 10000), 300);
*/

// => This is the example of "Promises" and "Promises.alll"
// -> Promises are like future value that can be resolved (success) or rejected (failed)
// -/- So, promises are like i am promising u i will get world richest it can be happened or not -/-

/* Problem  
It starts by calling getUser(1) to get the user's profile.

After the user has been successfully fetched, it should then fetch the orderHistory, cart, and recommendations all at the same time (in parallel).

If all three parallel operations are successful, it should log a final dashboard object to the console, like this:

--- DASHBOARD READY ---
User: Golu
Orders: 3
Cart Items: 2
Recommendations: [...]
The Twist: Since getRecommendations is designed to fail, your code must gracefully handle this error. It should catch the error from the parallel operations and log a user-friendly message like: "Could not load all dashboard widgets. Please try again later." without crashing the entire application.

// 1. Fetches the user's profile.
function getUser(id) {
  console.log("API: Getting user...");
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: id, name: "Golu", email: "golu@example.com" });
    }, 1000); // Takes 1 second
  });
}

// 2. Fetches the user's order history.
function getOrderHistory(user) {
  console.log(`API: Getting orders for ${user.name}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Order #1", "Order #2", "Order #3"]);
    }, 1500); // Takes 1.5 seconds
  });
}

// 3. Fetches the user's shopping cart.
function getCart(user) {
  console.log(`API: Getting cart for ${user.name}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Laptop Charger", "Mechanical Keyboard"]);
    }, 500); // Takes 0.5 seconds
  });
}

// 4. Fetches product recommendations. (This one is unreliable!)
function getRecommendations(user) {
  console.log(`API: Getting recommendations for ${user.name}...`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Oh no, the recommendation engine crashed!
      reject("Error: Recommendation service is down.");
    }, 1000); // Fails after 1 second
  });
}

// Promise.all always take an array and return an array
// catch will run for rejects and also for bugs in .then like reference error
// there is something called variable shadowing so be sure to use different names 
// and catch is mostly used then a promise rejected and also then there is a bug in there.

let finalUser;

getUser(1)
  .then((user) => {
    console.log("Getting started");
    finalUser = user;
    return Promise.all([
      getOrderHistory(user),
      getCart(user),
      getRecommendations(user)
    ]);
  }).then(( results) => {
    const orders = results[0];
    const cart = results[1];

    console.log('---User dashboard');
    console.log(`User: ${finalUser.name}`);
    console.log('Orders:', orders.length);
    console.log('Cart items:', cart.length);    
  }).catch((err) => {
    console.log('Something went wrong!')
  })
*/

// This is example of Async Loop Trap and how can be safe from it
// -> So, In the async fn then u are using await inside the loop it waits for all calls to finish one by one
// - / - It is like in a race waiting for each runner to complete the run one by one not all at once
// => So, to tackle up this problem we use ".map" & "Promise.all" combo like this
/*
const running = (runner) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Line-183 Completed run:", runner);
      resolve(runner);
    }, 3000);
  });
};

const olympicsRace = async (runners) => {
  const completedRunners = [];

  // It waits for each runner to complets run only then send the second runner
  // for (const runner of runners) {
  //   const raceRunner = await running(runner);
  //   completedRunners.push(raceRunner);
  // }

  // It creats a array of callbacks and then run them all at once
  const runnersPromise = runners.map((runner) => running(runner));
  const finalList = await Promise.all(runnersPromise);
  console.log(" Yo, Race completed the winner is me");
};

const runners = [1, 2, 3];
olympicsRace(runners);
*/

/*
// This is example of the Event Loop Blocking and solving it with help of Worker
const express = require("express");
const { Worker } = require("worker_threads");
const app = express();
const PORT = 3000;

// To solve the blocking beahviour we will use worker thread 
// -> Worker threads we will do the heavy loading works while not blocking the main code
// * // The main thing we create the worker file and then call it in main file
// It is like a chef now can make up the other orders too while the soup is being created by the assistant chef

// A non-blocking route
app.get("/fast", (req, res) => {
  console.log("I have completed my task.");
  res.send("I am fast!");
});

// This fn will now use the worker to run the heavy blocking task and not block the main code
app.get("/slow", (req, res) => {
  // creating new worker
  const worker = new Worker("./JavaScript/worker.js");
  // listening for the message from the worker
  worker.on("message", (result) => {
    console.log("Task finished: ", result);
  });
  // It is like sending signal to worker
  worker.postMessage("start");
  res.send("I am slow but non-blocking now!");
});

// A simple async task to show it's also blocked
setTimeout(() => {
  console.log(
    "This timer was supposed to fire after 2 seconds, but it was blocked!"
  );
}, 2000);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
*/

// This is a problem i have to solve with Promises that have 3 promise and one is sure to reject so i have to handle it
// -> I can't use the .all method bcz if one promise failed the whole thing will be failed
// => So for this problem we are going to use "Promise.allSettled" method

/*
function fetchTwitterPosts(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Tweet 1", "Tweet 2"]), 1000);
  });
}

function fetchInstagramPosts(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject("Instagram API is down"), 1500);
  });
}

function fetchThreadsPosts(user) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(["Thread 1"]), 500);
  });
}

const user = "golu";

Promise.allSettled([
  fetchTwitterPosts(user),
  fetchInstagramPosts(user),
  fetchTwitterPosts(user),
]).then((results) => {
  results.forEach(result => {
    console.log(result);
  });
});
*/

// This is a problem i have added the last method to the array prototype fn 
// Prootype used only Ancient fn no arrow ok
Array.prototype.last = function(){
  // console.log(arr);
  return this[this.length - 1];
}

const object = function (name, age) {
  this.name = name;
  this.age = age;
}

object.prototype = Object.create(Array.prototype);
console.log(object.push(34));

const numArray = [1, 2, 3, 4];
console.log(numArray.last())


