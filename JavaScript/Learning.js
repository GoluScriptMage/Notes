#This is the example for the Closures
// -> Closures are like a bagpack for the newborn child where he will have all the thigs needs in the school
// But he can use those but the someone other than him can't see those also only someone with certain condition can access them like the return fn there 

const cart = function (accNo) {
        let accountNo = 1234
        let accountBalance = 2222;

        return {
            buyTheCart: function (item, amount) {
                if (!(accountNo === accNo)) {
                    console.log("Transaction not succeful check the account no.")
                    return
                };
                accountBalance += amount;
                console.log('Transaction successful');
                return accountBalance;
            }
        }
    }

const callCart1 = cart(1234);
const callCart2 = cart(124);

callCart1.buyTheCart(12, 200);
callCart2.buyTheCart(12, 2300);

console.log(cart.accountBalance);