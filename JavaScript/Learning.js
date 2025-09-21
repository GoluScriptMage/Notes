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
