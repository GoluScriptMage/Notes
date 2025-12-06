// 🔴 Challenge 3: Package Delivery Tracker (Boss Fight!)
// Your task: Model a package delivery system with 5 different states

// Step 1: Define all 5 status types
type OrderedStatus = {
  status: "Ordered";
  orderId: string;
  estimatedDays: number;
};
type ShippedStatus = {
  status: "Shipped";
  trackingNumber: string;
  carrier: string;
  currentLocation: string;
};
type OutForDeliveryStatus = {
  status: "OutForDelivery";
  driverName: string;
  estimatedTime: string;
};
type DeliveredStatus = {
  status: "Delivered";
  deliveredAt: Date;
  signedBy: string;
  leftAtDoor: boolean;
};
type FailedStatus = {
  status: "Failed";
  reason: string;
  nextAttempt: Date;
};

// Step 2: Create the union
type PackageStatus =
  | OrderedStatus
  | ShippedStatus
  | OutForDeliveryStatus
  | DeliveredStatus
  | FailedStatus;

// Step 3: Write the update function
function getPackageUpdate(pkg: PackageStatus): string {
  // Your code here
  // BONUS: Add exhaustiveness checking with a default case!
  switch (pkg.status) {
    case "Ordered": {
      return `Order ${pkg.orderId} placed! Estimated Delivery:  ${pkg.estimatedDays} days`;
    }
    case "Shipped": {
      return `Shipped via ${pkg.carrier} (${pkg.trackingNumber}). Currently in: ${pkg.currentLocation}`;
    }
    case "OutForDelivery": {
      return `Out for delivery with ${pkg.driverName}. Estimated arrival: ${pkg.estimatedTime}`;
    }
    case "Delivered": {
      return `Delivered on ${pkg.deliveredAt}. ${
        pkg.leftAtDoor ? "Left at Door" : `Signed by: ${pkg.signedBy}`
      }`;
    }
    case "Failed": {
      return `Delivery failed: ${pkg.reason}. Next attempt: ${pkg.nextAttempt}`;
    }
    default:
      {
        const _exhaustiveCheck: never = pkg;
        return `Unhandled case: ${_exhaustiveCheck}`;
      }
      break;
  }
}

// Step 4: Test your code
const ordered: PackageStatus = {
  status: "Ordered",
  orderId: "ORD-123",
  estimatedDays: 3,
};
console.log(getPackageUpdate(ordered));

const shipped: PackageStatus = {
  status: "Shipped",
  trackingNumber: "TRK-456",
  carrier: "FedEx",
  currentLocation: "Los Angeles, CA",
};
console.log(getPackageUpdate(shipped));

const outForDelivery: PackageStatus = {
  status: "OutForDelivery",
  driverName: "John",
  estimatedTime: "2:00 PM",
};
console.log(getPackageUpdate(outForDelivery));

const delivered: PackageStatus = {
  status: "Delivered",
  deliveredAt: new Date("2024-12-05T14:30:00"),
  signedBy: "Jane Doe",
  leftAtDoor: false,
};
console.log(getPackageUpdate(delivered));

const failed: PackageStatus = {
  status: "Failed",
  reason: "Address not found",
  nextAttempt: new Date("2024-12-06T10:00:00"),
};
console.log(getPackageUpdate(failed));

// Expected outputs:
// "📦 Order ORD-123 placed! Estimated delivery: 3 days"
// "🚚 Shipped via FedEx (TRK-456). Currently in: Los Angeles, CA"
// "🚗 Out for delivery with John. Estimated arrival: 2:00 PM"
// "✅ Delivered on 2024-12-05 14:30. Signed by: Jane Doe"
// "❌ Delivery failed: Address not found. Next attempt: 2024-12-06"
