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
